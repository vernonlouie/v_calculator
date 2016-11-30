/* Calculator project v0.5      Vernon Louie    C11.16      November 25, 2016 */

var array1 = [" "];
var index = 0;

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
        array1 = [" "];
        $(".display > h4").remove();    // destroys the h4 elements in the display
    } else {
        $("h4:last-child").text(" ");   // removes text from the last h4
        array1[index] = " ";            // also need to clear out the contents of the array cell
    }
} // end of function special_clicked

function equal_clicked () {
    var num1 = Number(array1[0]);
    var num2 = Number(array1[2]);
    mathOper = array1[1];

    var result;
    console.log("num1: " + num1 + "  num2: " + num2 + "  mathOper: " + mathOper);

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

    // console.log("mathOperString: " + mathOperString);
    index++;

    var new_h4 = $("<h4>", {
        text: mathOperString
    });
    $(".container1 .display").append(new_h4);

    array1[index] = mathOperString;
    // console.log("index: " + index + " array1[" + index + "]: " + array1[index]);
    index++;
    array1[index] = " ";    // Add empty string to the last position of the array
} // end of function operator_clicked

function number_clicked () {
    var numString = $(this).text();
    numString = numString.trim();   // .trim Removes white space from the string/text.

    // console.log("numString: " + numString);
    var isItEmpty = array1[index];

    if (isItEmpty === " ") {
        array1[index] = numString;
        var new_h4 = $("<h4>", {
            text: " " + array1[index] + " "
        });
        $(".container1 .display").append(new_h4);
    } else {
        array1[index] = array1[index] + numString;
        // console.log("index: " + index + array1[index]);
        $(".container1 .display h4:last-child").text(array1[index]);
    }

} // end of function number_clicked




function gut (abc, def, ghi) {
    var array1 = [" "];
    $(".container1 .display").text(abc);
}
