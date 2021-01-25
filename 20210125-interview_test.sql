create database interview;
use interview ; 

create table z_store_hierarchy
(
store_code VARCHAR(80),
store_name varchar(255),
region varchar(80),
market varchar(80)
) ; 

create table data
(
store_code VARCHAR(80),
period varchar(10),
sales_type varchar(20),
price decimal(19,6),
quantity decimal(19,6)
) ; 

-- 1、 “SQL数据源.xlsx”是从MySQL中导出的两张数据表，z_store_hierarchy：餐厅的主数据，data：销售数据明细（price表示销售单价，quantity表示销售数量）。
-- 1）通过store_code字段连接两表，按market，period，sales_type分组，计算销售收入和平均单价；
-- 2）	按market，sales_type计算2月相对1月的平均单价涨跌幅度，给出排名字段并写入结果表；
-- 3）创建存储过程：
-- 把步骤2）的计算范围扩展为2到12月，计算每月相对上月的平均单价涨跌幅，
-- 并写入新创建的结果数据库表

-- store_code, store_name, region, market
-- store_code, period, sales_type, price, quantity
# ==================================================================================
#所有维度分组统计结果表
drop table if exists temp_details ; 
create temporary table temp_details (
--  同时获取数字型的月份，计算每行的销售额 
select a.store_code, a.market, b.period, month(str_to_date(b.period,'%b')) period_month, 
	   b.sales_type, price, quantity, price * quantity sales
       from z_store_hierarchy  a 
inner join data b 
on a.store_code = b.store_code ) ;

-- 1）通过store_code字段连接两表，按market，period，sales_type分组，计算销售收入和平均单价；
select  market, period, sales_type, 
		round(sum(quantity),2) total_quantity, round(sum(sales),2) total_sale, 
		round(sum(sales)/sum(quantity),2) price_avg from temp_details
group by market, period, sales_type 
order by market, period, sales_type ; 

# ===================================================================================
-- 2）	按market，sales_type计算2月相对1月的平均单价涨跌幅度，给出排名字段并写入结果表；
#先计算所有月份的结果
drop table if exists temp_month_compare ; 
create table temp_month_compare (
	select  market, sales_type, period_month, 
			round(sum(quantity),2) total_quantity, round(sum(sales),2) total_sales, 
			round(sum(sales)/sum(quantity),2) price_avg
	from temp_details 
	-- where period_month = 1  
	group by market, period_month, sales_type 
	order by market, period_month, sales_type 
) ;  

-- 前后月关联,获取上个月的平均单价, 计算涨跌幅度，给出排名字段, 并写入结果表；
drop table if exists temp_result_certain_month ; 
create temporary table temp_result_certain_month ( 
		select market, current_month, sales_type, 
			   current_price_avg, 
			   previous_price_avg,
               change_pct_month , 
			   concat(change_pct_month, '%' ) change_pct_month_str , 
			   rank()over( partition by current_month order by change_pct_month desc ) change_rank 
			   from 
					(
					select a.market, a.period_month current_month, a.sales_type, 
						   a.total_sales current_total_sales , 
						   a.price_avg current_price_avg, 
						   b.total_sales previous_total_sales , 
						   b.price_avg previous_price_avg,
						   round(100* (a.price_avg -  b.price_avg)/b.price_avg,2) change_pct_month
					from  temp_month_compare a
					left join temp_month_compare b 
					on a.market = b.market 
					and a.sales_type = b.sales_type 
					and a.period_month = b.period_month + 1 
                    --  选定2月
					where a.period_month = 2 
					) x 
					-- where market = 'SH'
					order by current_month, change_rank, market, sales_type
	);  

drop table if exists result_table ; 
-- 创建结果表
create table result_table (
	market varchar(10), 
    current_month int, 
    sales_type varchar(30), 
    current_price_avg decimal(9,2), 
    previous_price_avg decimal(18,4), 
    change_pct_month decimal(9,2), 
    change_pct_month_str varchar(20), 
    change_rank int 
) ; 


-- 写入结果表 
insert into result_table 
select market, current_month, sales_type, current_price_avg, 
	   previous_price_avg , change_pct_month, 
       change_pct_month_str, change_rank from temp_result_certain_month ; 
       
select * from result_table;

#==================================================================================
-- 3）创建存储过程：
-- 把步骤2）的计算范围扩展为2到12月，计算每月相对上月的平均单价涨跌幅，
-- 并写入新创建的结果数据库表
CREATE DEFINER=`data_account`@`%` PROCEDURE `calc_sales_month_change`()
BEGIN
#先计算所有月份的结果
drop table if exists temp_month_compare ; 
-- 需要打开两次做关联，不适用临时表
create table temp_month_compare (
	select  market, sales_type, period_month, 
			round(sum(quantity),2) total_quantity, round(sum(sales),2) total_sales, 
			round(sum(sales)/sum(quantity),2) price_avg
	from temp_details 
	-- where period_month = 1  
	group by market, period_month, sales_type 
	order by market, period_month, sales_type 
) ;  

-- 前后月关联,获取上个月的平均单价, 计算涨跌幅度，给出排名字段, 并写入结果表；
drop table if exists temp_result_month ; 
create temporary table temp_result_month ( 
		select market, current_month, sales_type, 
			   current_price_avg, 
			   previous_price_avg,
               change_pct_month , 
			   concat(change_pct_month, '%' ) change_pct_month_str , 
			   rank()over( partition by current_month order by change_pct_month desc ) change_rank 
			   from 
					(
					select a.market, a.period_month current_month, a.sales_type, 
						   a.total_sales current_total_sales , 
						   a.price_avg current_price_avg, 
						   b.total_sales previous_total_sales , 
						   b.price_avg previous_price_avg,
						   round(100* (a.price_avg -  b.price_avg)/b.price_avg,2) change_pct_month
					from  temp_month_compare a
					left join temp_month_compare b 
					on a.market = b.market 
					and a.sales_type = b.sales_type 
					and a.period_month = b.period_month + 1 
					) x 
					order by current_month, change_rank, market, sales_type
	);  
 
-- 写入结果表 
insert into result_table 
select market, current_month, sales_type, current_price_avg, 
	   previous_price_avg , change_pct_month, 
       change_pct_month_str, change_rank from temp_result_month ; 
       
-- 删掉临时表
drop table temp_month_compare, temp_result_month ; 

END 

call calc_sales_month_change() ; 
