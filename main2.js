/* Calculator project, version1     Vernon Louie    C11.16      December 5, 2016 */

var index = 0;
var obj_array = [];
var temp_array = [];
var global_result;
var global_temp = -7.77;
var multi_op_index;

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

    // console.log("numString: " + numString + "  obj_array[index]: " + obj_array[index]);

    if (obj_array[index] !== undefined) {           // case: multiple decimals (Comprehensive Operations). check for decimal pt if there is a number
        var thereIsDecimal = checkForDecimal ();    // thereIsDecimal used later in 2nd else if conditional below
    }

    if (obj_array[index] === undefined) {   // if this is the very first number
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // don't increase index by 1, since index is already set correctly for first element (index = 0)
        create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
        // console.log("in number_clicked - undefined");
    } else if (obj_array[index].value === "/" && numString === "0") {
        create_div_text_in_display (numString);
        create_div_text_in_display ("Error - division by zero.  Click C to clear!!");
    } else if (obj_array[index].type === "operator") {  // create a div & text and object for the new number following a math operator
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);
        ++index;                                        // increase index by 1 to match the newly created object
        create_div_text_in_display (obj_array[index].value);
        // console.log("in number_clicked - operator");
    } else if (numString === "." && thereIsDecimal === true) {  // case: multiple decimal points
        console.log("no decimal point added");          // nothing happens, not adding to obj_array nor appending to current number
    } else {    // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }
    console.log("in number_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function number_clicked


function operator_clicked () {
    var mathOperString = $(this).text();    // grab the operator from the button text just clicked
    mathOperString = mathOperString.trim();

    if (obj_array[index] === undefined) {               // case: premature operation (ADVANCED Operations)
        create_div_text_in_display ("need number!");    // do nothing except display message
    } else if (obj_array[index].type === "number") {
        var just_clicked = new PunchTemplate ("operator", mathOperString);  // new object is "type" of operator and a "value" of mathOperString
        obj_array.push(just_clicked);                   // push operator just clicked into obj_array
        index++;                                        // increase index by 1 to stay matched with the just-pushed object
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index].type === "operator") {  // case: multiple and changing operation keys (Comprehensive Operations)
        obj_array[index].value = mathOperString;        // replace the previous operator with the operator just clicked
        $(".container1 .display h3:last-child").text(obj_array[index].value);   // display the operator just clicked
    } else {
        var just_clicked = new PunchTemplate ("operator", mathOperString);  // new object is "type" of operator and a "value" of mathOperString
        obj_array.push(just_clicked);                   // push operator just clicked into obj_array
        index++;                                        // increase index by 1 to stay matched with the just-pushed object
        create_div_text_in_display (mathOperString);
    }
    // console.log("in operator_clicked, obj_array[index].value: " + obj_array[index].value + "  obj_array: " + obj_array + "  index: " + index);
} // end of function operator_clicked


function equal_clicked () {
    var result; var num1;   var num2;   var mathOper;   var string_result;  var temp;
    var length = obj_array.length - 1;  // get the length of the array before I push the equal sign onto obj_array; important for the do loop below

    if (obj_array[index] === undefined) {   // case: missing operands (ADVANCED Operations)
        create_div_text_in_display ("Ready");
    } else if (obj_array[index].type === "equalSign") {    // case: operation repeat (consecutive equal signs, Comprehensive Operations)
        console.log("A: " + obj_array[multi_op_index].value + "  B: " + global_result + "  C: " + obj_array[multi_op_index + 1].value);
        // ensure numbers, not strings, are being manipulated otherwise the + sign in function do_math will concatenate, not add
        num1 = Number(global_result);
        mathOper = obj_array[multi_op_index].value;
        num2 = Number(obj_array[multi_op_index + 1].value);

        global_result = do_math(num1, mathOper, num2);

        console.log("global_result: " + global_result);

        string_result = "=".concat(global_result);     // concatenate "=" to result so it shows up in 1 div element instead of in separate divs
        create_div_text_in_display (string_result);
    } else {
        var just_clicked = new PunchTemplate ("equalSign", "=");
        obj_array.push(just_clicked);
        index++;    // global variable

        console.log("in equal_clicked, obj_array: " + obj_array);

        // always calculate result of first 2 numbers if there is more than 1 math operator and store it into temp
        num1 = Number(obj_array[0].value);

        if (obj_array[1].type !== "operator") { // case: missing operation (ADVANCED Operations)
            mathOper = "x";     // this is case where you have only a number and an equal sign and we return num1
            num2 = 1;
        } else {                // normal operation
            mathOper = obj_array[1].value;
            num2 = Number(obj_array[2].value);
        }

        if (isNaN(num2)) {  // case: partial operand (ADVANCED Operations). if num2 is not a number, then...
            num2 = num1;
            obj_array.push(obj_array[0]);
            ++index;
            create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
        }

        var temp = do_math (num1, mathOper, num2);

        if (global_temp === -7.77) {   // if global_temp hasn't been used yet, set it equal to temp; if still using, use global_temp as is
            global_temp = temp;
        }

        // loop and do left most operators first; if there are only 2 numbers with 1 operator, then this for loop is not executed
        for (i=3; i < length; i+=2) { // case: successive operation & multi keys (Comprehensive Operations)
            num1 = temp;
            mathOper = obj_array[i].value;
            num2 = Number(obj_array[i+1].value);

            temp = do_math(num1, mathOper, num2);   // do 1 math operation at a time
            console.log("temp: " + temp);
        } // end of for loop

        if (obj_array[index - 1].type === "operator") { // case: operation rollover (Comprehensive Operations)
            global_temp = do_math(global_temp, mathOper, global_temp);
            console.log("operator global_temp: " + global_temp);
            string_result = "=".concat(global_temp);
            create_div_text_in_display (string_result);
        } else {
            result = temp;
            global_result = result;
            multi_op_index = i - 2;     // multi_op_index is needed for operation repeat
            string_result = "=".concat(result);
            create_div_text_in_display (string_result);
        } // end of 2nd else
    } // end of 1st else
} // end of function equal_clicked


function special_clicked () {
    var clearKey = $(this).text();
    clearKey = clearKey.trim();

    if (clearKey === "C") {
        for (var j=0; j <= index; ++j) {
            obj_array.pop();            // remove all objects/elements from the array, but removes them 1 at a time
            console.log("obj_array: " + obj_array);
        }

        global_temp = -7.77;            // set global_temp to "unused"
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
function do_math (number1, mathOperator, number2) {
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

function checkForDecimal () {   // case: multiple decimals (Comprehensive Operations)
    var array_of_stringNumber = (obj_array[index].value).split("");
    var length = array_of_stringNumber.length;

    for (var i=0; i < length; ++i) {
        if (array_of_stringNumber[i] ===  ".") {
            console.log("decimal present");
            return true;
        }
    }
    return false;
}

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}














/*************************************          Functions that I once used

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

*/

