/**
 * Created by Vernon on 12/2/2016.
 */

var array1 = [" "];
var index = 0;
var obj_array = [];

$(document).ready(function () {
    $(".number").click(number_clicked);         // Call function number_clicked when clicking on a number button
    $(".operator").click(operator_clicked);     // for any 4 of the operator (/ X - +) buttons
    $(".equal").click(equal_clicked);           // for equal "=" sign
    $(".special").click(special_clicked);       // for the clear keys (C and CE)
});

function special_clicked () {
    var clearKey = $(this).text();
    clearKey = clearKey.trim();

    if (clearKey === "C") {
        // console.log("far");          // we are basically starting over, so reset values to a starting condition
        index = 0;
        obj_array = [" "];
        $(".display > h4").remove();    // destroys the h4 elements in the display
    } else {
        $("h4:last-child").text(" ");   // removes text from the last h4
        obj_array.pop() = " ";            // also need to clear out the contents of the array cell
    }
} // end of function special_clicked

function equal_clicked () {
    var num1 = Number(obj_array[0].value);
    var num2 = Number(obj_array[2].value);
    mathOper = obj_array[1].value;

    var just_clicked = new PunchTemplate ("equalSign", "=");
    obj_array.push(just_clicked);
    index++;

    console.log("obj_array: " + obj_array);

    var result;
    console.log("mathOper: " + mathOper + "  obj_array: " + obj_array[0].value + " " + obj_array[1].value + " " + obj_array[2].value);

    if (mathOper === "/") {
        result = num1 / num2;
    } else if (mathOper === "X") {
        result = num1 * num2;
    } else if (mathOper === "-") {
        result = num1 - num2;
    } else {
        result = num1 + num2;
    }

    var new_h4 = $("<h4>", {
        text: "= " + result
    });
    $(".container1 .display").append(new_h4);
} // end of function equal_clicked

function operator_clicked () {
    var mathOperString = $(this).text();
    mathOperString = mathOperString.trim();

    var just_clicked = new PunchTemplate ("operator", mathOperString);
    obj_array.push(just_clicked);
    index++;

    var new_h4 = $("<h4>", {
        text: mathOperString
    });
    $(".container1 .display").append(new_h4);

    console.log("a: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
    // console.log("index: " + index + " array1[" + index + "]: " + array1[index]);
    // index++;
    // Add empty string to the last position of the array
} // end of function operator_clicked

function number_clicked () {
    var numString = $(this).text();
    numString = numString.trim();   // .trim Removes white space from the string/text.

    if (obj_array[index] === undefined) {
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);

        var new_h4 = $("<h4>", {
            text: " " + obj_array[index].value + " "
        });
        $(".container1 .display").append(new_h4);

        console.log("strange");
    } else if (obj_array[index].type === "operator") {
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);
        ++index;

        var new_h4 = $("<h4>", {
            text: " " + obj_array[index].value + " "
        });
        $(".container1 .display").append(new_h4);

        console.log("rude");
    }
    else {
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h4:last-child").text(obj_array[index].value);
    }

    console.log("a: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function number_clicked

function PunchTemplate (type, value) {
    this.type = type;
    this.value = value;
}

function gut (abc, def, ghi) {
    var array1 = [" "];
    $(".container1 .display").text(abc);
}var array1 = [" "];
var index = 0;
