/* Calculator project, version1     Vernon Louie    C11.16      December 5, 2016 */

var index = 0;
var obj_array = [];

$(document).ready(function () {
    $(".number").click(number_clicked);         // Call function number_clicked when clicking on a number button (including decimal point)
    $(".operator").click(operator_clicked);     // for any 4 of the operator (/ x - +) buttons
    $(".equal").click(equal_clicked);           // for equal "=" sign
    $(".special").click(special_clicked);       // for the clear keys (C and CE)
});

function number_clicked () {
    var numString = $(this).text();     // get the text from the button just clicked, which in this case is a number that is of type string
    numString = numString.trim();       // .trim Removes white space from the string/text.

    console.log("in number_clicked, index: " + index + "  obj_array[index]: " + obj_array[index]);

    if (obj_array[index] === undefined) { // if this is the very first number
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // whenever we push to the array, we want to increase index by 1, except when doing the first number

        //dynamically create h3 element, place it in the display with the number just clicked
        var new_h3 = $("<h3>", {
            text: " " + obj_array[index].value + " "
        });
        $(".container1 .display").append(new_h3);

        console.log("number_clicked - undefined");
    } else if (obj_array[index].type === "operator") {  // create an h3 element and object for the new number following a math operator
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);
        ++index;                                        // increase index by 1 to match the newly created object

        //dynamically create h3 element, place it in the display with the number just clicked
        var new_h3 = $("<h3>", {
            text: " " + obj_array[index].value + " "
        });
        $(".container1 .display").append(new_h3);

        console.log("number_clicked - operator");
    }
    else {  // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }

    console.log("in number_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function number_clicked

function operator_clicked () {
    var mathOperString = $(this).text();
    mathOperString = mathOperString.trim();

    var just_clicked = new PunchTemplate ("operator", mathOperString);
    obj_array.push(just_clicked);
    index++;

    var new_h3 = $("<h3>", {
        text: mathOperString
    });
    $(".container1 .display").append(new_h3);

    console.log("in operator_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function operator_clicked

function equal_clicked () {
    var result;
    var num1 = Number(obj_array[0].value);
    var num2 = Number(obj_array[2].value);
    var mathOper = obj_array[1].value;

    var just_clicked = new PunchTemplate ("equalSign", "=");
    obj_array.push(just_clicked);
    index++;

    console.log("in equal_clicked, obj_array: " + obj_array);
    console.log("mathOper: " + mathOper + "  obj_array: " + obj_array[0].value + " " + obj_array[1].value + " " + obj_array[2].value);

    if (mathOper === "/") {
        result = num1 / num2;
    } else if (mathOper === "x") {
        result = num1 * num2;
    } else if (mathOper === "-") {
        result = num1 - num2;
    } else {
        result = num1 + num2;
    }

    var new_h3 = $("<h3>", {
        text: " = " + result
    });
    $(".container1 .display").append(new_h3);
} // end of function equal_clicked

function special_clicked () {
    var clearKey = $(this).text();
    clearKey = clearKey.trim();

    if (clearKey === "C") {
        for (var j=0; j <= index; ++j) {
            obj_array.pop();            // remove all objects/elements from the array, but removes them 1 at a time
            console.log("obj_array: " + obj_array);
        }

        index = 0;                      // set the index back to the beginning position

        $(".display > h3").remove();    // destroys all h3 elements in the display
    } else { // CE button
        obj_array.pop();                // delete the object in the last array position

        if (index !== 0) {
            index--;                    // if clearing the 1st number/object, don't want to go index of -1, since all arrays start at 0
        }

        $("h3:last-child").remove();    // destroy the last h3 element
    }
} // end of function special_clicked

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}

