
function merge_str_recursively(row, index) {
	row_td = row.getElementsByTagName('td');
    // if (index >= row_td.length - 1) {
    //     return null;
	// };
	index = merge_strs(row, row_td, index);	

	return index ;
    // index = merge_strs(row_td, index, row);
	// merge_str_recursively(row,index);
}

function merge_str_recursively_gap(row, row_td, index) {
    if (index >= row_td.length - 1) {
        return null;
    };
    // index = merge_strs(row_td, index, row);
	index = merge_strs(row,row_td, index);
	merge_str_recursively(row,row_td, index )
};

function merge_strs(row, row_td, index) {
    if (index >= row_td.length - 1) {
        return null;
    };
	current_node = row_td[index];
	current_text = current_node.innerHTML;
	
    next_node = row_td[index + 1];
	next_text = next_node.innerHTML;

	previous_node = row_td[index-1];

    // console.log(`${index}--${row_td.length}-current:${current_text}  next:${next_text}`);

    if (current_text == next_text) {
        //如果相等，本节点数字*2,删掉上个节点
        current_result = get_letter_number(current_text);
        current_letter = current_result.letter;
        current_number = current_result.number;

		var new_text = current_letter + current_number * 2;
		current_node.innerHTML = new_text ;
		row.removeChild(next_node);
		//如果上个元素和本元素相同，返回index-1
		if (typeof previous_node != 'undefined'){
			previous_text = previous_node.innerHTML;
			if (previous_text == new_text){
				current_node.innerHTML = current_letter + current_number * 4;
				row.removeChild(previous_node);
				//合并后需要再次检查上一个是否和合并的相等，所以index-1再回头去看上一个元素
				index = index - 1 ;
				// merge_strs(row, row_td, index);	
			}
		}
    } else {
		index = index + 1  ;
        return merge_strs(row, row_td, index);
    }
    return index;
}


function get_letter_number(input_text) {
    letter = input_text.replace(/[0-9]/g, "");
    number = parseInt(input_text.replace(/[a-zA-Z]/g, ""));
    return {
        'letter': letter,
        'number': number
    }
}

function bt1_click() {
    // 读取表格
    var table_rows = document.getElementsByTagName("table")[0].childNodes[1].childNodes;
	// 循环读取id带有t的行

    for (var i = 0; i < table_rows.length; i++) {
        var row = table_rows[i];
        var row_id = row.id;
        if (typeof row_id == "string") {
			var table_tag = 't';
			var index = 0 ;
            if (row_id.startsWith(table_tag) == true) {
				while (index != null){
					index = merge_str_recursively(row, index)
				}
            }
        }
    }
}
function bt2_click() {
    // 读取表格
    var table_rows = document.getElementsByTagName("table")[0].childNodes[1].childNodes;
	// 循环读取id带有t的行

    for (var i = 0; i < table_rows.length; i++) {
        var row = table_rows[i];
        var row_id = row.id;
        if (typeof row_id == "string") {
			var table_tag = 't';
			var index = 0 ;
			var time_gap = 500;
            if (row_id.startsWith(table_tag) == true) {	
				time_gap = time_gap + 500;
				while (index != null){
					index = setTimeout(merge_str_recursively(row, index), time_gap)
				}
            }
        }
    }
}
