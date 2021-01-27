function merge_str_recursively(index, row) {

    if (index >= row_td.length - 1) {
        return null;
    };
    if (index < 0) {
        return merge_str_recursively(0, row)
    };

    row_td = row.getElementsByTagName('td');
    index = merge_strs(row_td, index, row);

    merge_str_recursively(index, row)
}

function merge_strs(row_td, index, row) {
    if (index >= row_td.length - 1) {
        return null;
    };

    if (index < 0) {
        return merge_strs(row_td, 0, row)
    };

    current_node = row_td[index]
    current_text = current_node.innerHTML;
    next_node = row_td[index + 1];
    next_text = next_node.innerHTML;

    console.log(`${index} --${row_td.length} --current:${current_text}  next:${next_text}`);

    if (current_text == next_text) {
        //如果相等，本节点数字*2,删掉上个节点
        current_result = get_letter_number(current_text);
        current_letter = current_result.letter;
        current_number = current_result.number;

        current_node.innerHTML = current_letter + current_number * 2;
        row.removeChild(next_node);
        // return merge_strs(row_td, index - 1, row);
        index = index - 1
    } else {
        // return merge_strs(row_td, index + 1, row);
        index = index + 1
    }
    return index
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
            var table_tag = 't3';
            if (row_id.startsWith(table_tag) == true) {
                // console.log(table_tag + '-------------');
                row_td = row.getElementsByTagName('td');
                // console.log(row_td);
                // 分别获取该行列表的字母和数字,array形式
                // array_result = get_letter_array(row_td);
                // letter_array = array_result.letter_array;
                // number_array = array_result.number_array;
                merge_str_recursively(0, row);
                // merge_strs(row_td, 0, row)
                // for (var i = 0; i < row_td.length; i++) {
                //     merge_str_recursively(row, row_td[i], letter_array[i], number[i]);
                // }
            }
        }
    }
}
function bt2_click() {
}