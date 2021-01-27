function merge_str_recursively(row, row_td, letter_array, number_array, index, counter) {
	// 递归处理相同的字符串合并以及把右边数字相加,确保左边的字母相同，然后右边的数字*2，remove跟在后面的item
	// base case 如果已经读到最后一个节点，返回
	if (index >= number_array.length - 1) {
		console.log(`${counter}--${index}-${row_td.length}-${letter_array}--${number_array}`);
		console.log('stop');
		return null
	};

	var current_letter = letter_array[index];
	var current_number = number_array[index];
	var next_letter = letter_array[index + 1];
	var next_number = number_array[index + 1];

	new_text = `${current_letter}${current_number * 2}`;

	console.log(`${counter}--${index}-${row_td.length}-${current_letter}${current_number}==${next_letter}${next_number}`);

	//判断是否相等
	counter = counter + 1;
	if (current_letter == next_letter && current_number == next_number) {
		//如果字母相同 + 数字也相同 --> 赋值修改 , 删掉后面一个元素
		row_td[index].innerHTML = new_text;
		number_array[index] = next_number * 2;
		// console.log(row_td[index + i]);
		row.removeChild(row_td[index + 1]);
		letter_array.splice(index + 1, 1);
		number_array.splice(index + 1, 1);
		if (index >= 1) {
			if (row_td[index - 1].innerHTML == new_text) {
				index = index - 1;
			}
		}
		// 检查
		// console.log(letter_array + '--' + number_array);
		//继续往下找，index不变
	} else if (current_letter == next_letter && current_number != next_number) {
		// a2, a1, a1, a1 ，现在知道a2 != a1, 2/1 = 2, 判断a2后面的a1 是否够2个 进而可以合并成a2 和开始的a2组合
		same_tag = true;
		//如果字母相同,数字不同,处理index+1位的数字
		var quotient = current_letter / next_letter;
		if (Number.isInteger(quotient) == true) {
			for (var i = 2; i < quotient + 2; i++) {
				if (letter_array[index + i] != next_letter || number_array[index + i] != next_number) {
					same_tag = false;
				}
			}
		} else {
			same_tag = false;
		};
		//如果符合条件,对index+1 到 index + N 的数字进行合并, 并删除 index +2 到 index+N的部分
		if (same_tag == true) {
			var original_len = letter_array.length;
			//修改index+1
			row_td[index + 1].innerHTML = row_td[index].innerHTML;
			//后面剩下的删掉
			for (var i = 2; i < quotient + 2; i++) {
				row.removeChild(row_td[index + i]);
				letter_array.splice(index + i, 1);
				number_array.splice(index + i, 1);
			};
			if (index >= 1) {
				if (row_td[index - 1].innerHTML == new_text) {
					index = index - 1;
				}
			};
			var current_len = letter_array.length;
			if (original_len - current_len >= 2) {
				console.log(original_len + ' vs ' + current_len);
				return;
			};
			// merge_str_recursively(row_td, letter_array, number_array, index, counter)
		} else {
			index = index + 1;
		}
	} else {
		//字母不同
		index = index + 1;
	}
	merge_str_recursively(row, row_td, letter_array, number_array, index, counter)
}

function get_letter_array(row_td) {
	var letter_array = Array();
	var number_array = Array();
	for (var i = 0; i < row_td.length; i++) {
		letter_array.push(row_td[i].innerHTML.replace(/[0-9]/g, ""))
		number_array.push(row_td[i].innerHTML.replace(/[a-zA-Z]/g, ""))
	};
	return {
		'letter_array': letter_array,
		'number_array': number_array
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
			var table_tag = 't3'
			if (row_id.startsWith(table_tag) == true) {
				// console.log(table_tag + '-------------');
				var row_td = row.getElementsByTagName('td');
				var counter = 0;
				// 分别获取该行列表的字母和数字,array形式
				array_result = get_letter_array(row_td);
				letter_array = array_result.letter_array;
				number_array = array_result.number_array;
				// console.log(row_td);
				merge_str_recursively(row, row_td, letter_array, number_array, 0, counter)
			}
		}
	}
}
function bt2_click() {
}