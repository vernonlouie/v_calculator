/* Calculator project, version1     Vernon Louie    C11.16      December 5, 2016 */

var index = 0;
var obj_array = [];

$(document).ready(function () {
    $(".number").click(number_clicked);         // Call function number_clicked when clicking on a number button (including decimal point)
    $(".operator").click(operator_clicked);     // for any 4 of the operator (/ x - +) buttons
    $(".equal").click(equal_clicked);           // for equal "=" sign
    $(".special").click(special_clicked);       // for the clear keys (C and CE)
});

// 4 main functions ***************************************************************************
function number_clicked () {
    var numString = $(this).text();     // get the text from the button just clicked, which in this case is a number that is of type string
    numString = numString.trim();       // .trim Removes white space from the string/text.

    console.log("in number_clicked, index: " + index + "  obj_array[index]: " + obj_array[index]);

    if (obj_array[index] === undefined) { // if this is the very first number
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // whenever we push to the array, we want to increase index by 1, except when doing the first number

        //dynamically create h3 element, place it in the display with the number just clicked
        create_div_text_in_display (obj_array[index].value);
        console.log("number_clicked - undefined");
    } else if (obj_array[index].type === "operator") {  // create an h3 element and object for the new number following a math operator
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);
        ++index;                                        // increase index by 1 to match the newly created object

        create_div_text_in_display (obj_array[index].value);
        console.log("number_clicked - operator");
    }
    else {  // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }

    console.log("in number_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function number_clicked

function operator_clicked () {
    var mathOperString = $(this).text();    // grab the operator from the button text just clicked
    mathOperString = mathOperString.trim();

    var oper_string = obj_array[index].value;
    var length = oper_string.length;
    var array_of_operators = oper_string.split[""];     // convert string to array of strings with each string being 1 character long

    if (obj_array[index].type === "number") {
        rid_decimals_if_any();  // in the number just entered before the operator sign, get rid of any extra decimals if any exist
        var just_clicked = new PunchTemplate ("operator", mathOperString);  // give the new object a "type" of operator and a "value" of mathOperString
        obj_array.push(just_clicked);
        index++;    // increase index by 1 to stay matched with the just-pushed object
        create_div_text_in_display (mathOperString);

    } else if (mathOperString === array_of_operators[length - 1]) {
        // append operator just clicked to what is already in the "value" property of the object, which should be a string of operators
        obj_array[index].value = obj_array[index].value + mathOperString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }

    console.log("in operator_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function operator_clicked

function equal_clicked () {
    var result; var num1;   var num2;   var mathOper;   var string_result;  var temp;
    var length = obj_array.length;  // note that I get the length of the array before I push the equal sign onto obj_array; important for the do loop below

    if (obj_array[index].type === "number") {
        rid_decimals_if_any();  // in the number just entered before the equal sign, get rid of any extra decimals if any exist
    }

    var just_clicked = new PunchTemplate ("equalSign", "=");
    obj_array.push(just_clicked);
    index++;    // global variable

    console.log("in equal_clicked, obj_array: " + obj_array);
    console.log("obj_array: " + obj_array[0].value + " " + obj_array[1].value + " " + obj_array[2].value);

    // always calculate result of first 2 numbers if there is more than 1 math operator and store it into temp
    num1 = Number(obj_array[0].value);
    num2 = Number(obj_array[2].value);
    mathOper = obj_array[1].value;

    var temp = do_math(mathOper, num1, num2);

    // loop and do left most operators first; if there are only 2 numbers with 1 operator, then this for loop is not executed
    for (var i=3; i < length; i+=2) {
        num1 = temp;
        mathOper = obj_array[i].value;
        num2 = Number(obj_array[i+1].value);

        temp = do_math(mathOper, num1, num2);   // do 1 math operation at a time
        console.log("temp: " + temp);
    } // end of for loop

    result = temp;
    string_result = "=".concat(result);
    create_div_text_in_display (string_result);
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
// end 4 main functions ***************************************************************************

// sub functions ***************************************************************************
function do_math (mathOperator, number1, number2) {
    if (mathOperator === "/") {
        answer  = number1 / number2;
    } else if (mathOperator === "x") {
        answer = number1 * number2;
    } else if (mathOperator === "-") {
        answer = number1 - number2;
    } else {
        answer = number1 + number2;
    }
    return answer;
}

function create_div_text_in_display (strng) {   //dynamically create h3 element, place it in display with number, operator or '=' just clicked
    var new_h3 = $("<h3>", {
        text: " " + strng + " "
    });
    $(".container1 .display").append(new_h3);
}

function rid_decimals_if_any () {   // check if there is more than 1 decimal point in the number at the current index before we push the operator or equal sign onto obj_array
    var decimal_count = 0;
    var num_string = (obj_array[index].value);
    var string_length = num_string.length;      // 1st get length of string (number is really a string)
    console.log("string_length: " + string_length);

    var array_of_string = num_string.split("");     // convert string to array of strings with each string being 1 character long

    // cycle through the string to check for and count decimal points
    for (var i=0; i < string_length; ++i) {
        if (array_of_string[i] === ".") {
            decimal_count++;        // if there is a decimal point, increment by 1
            console.log("decimal_count: " + decimal_count);
        }
    }

    // if more than 1 decimal point, grab 2 substrings before and after the decimal points, but include the 1st decimal point only in temp_string1
    if (decimal_count > 1) {
        var first_decimal_position = num_string.indexOf(".");   // locate the 1st decimal point's position within the string
        console.log("first: " + first_decimal_position);

        // get 1st part that includes the decimal point
        var temp_string1 = num_string.substr(0,first_decimal_position + 1);
        // get the 2nd part that gets the string after the decimal points to the end of the string
        var temp_string2 = num_string.substr(first_decimal_position + decimal_count, string_length);

        console.log("temp_string1: " + temp_string1 + "  temp_string2: " + temp_string2);
        num_string = temp_string1.concat(temp_string2); // concatenate the 2 parts into 1 string
        console.log(num_string);
        console.log("obj_array: " + obj_array);
        obj_array[index].value = num_string;            // substitute the string minus the decimal points back into obj_array
        console.log("obj_array: " + obj_array[index].value);
    }
}

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}