/**
 * Created by Vernon on 12/7/2016.
 */

/* Calculator project, version1     Vernon Louie    C11.16      December 7, 2016 */

var index = 0;              // index should always point to the last object in obj_array
var obj_array = [];         // obj_array is the array that holds the objects of type number, operator or equalSign

var global_result;          // used only for "operation repeat" in equal_clicked function
var multi_op_index;         // used only for "operation repeat" in equal_clicked function

var flag_for_op_rollover = null;    //flag to see if rollover_result needs to be set to temp or not in equal_clicked function
var rollover_result;        // used only for "operation rollover" in equal_clicked function

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

    if (obj_array[index] !== undefined) {           // case: multiple decimals (Comprehensive Operations). check for decimal pt if there is a number
        var thereIsDecimal = checkForDecimal ();    // thereIsDecimal used later in 2nd else if conditional below
    }

    if (obj_array[index] === undefined) {   // if this is the very first number
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // don't increase index by 1, since index is already set correctly for first element (index = 0)
        create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
    } else if (obj_array[index].value === "/" && numString === "0") {   // case: division by zero (Comprehensive Operations)
        create_div_text_in_display (numString);
        create_div_text_in_display ("Error - division by zero.  Click C to clear!!");
    } else if (obj_array[index].type === "operator") {  // create a div & text and object for the new number following a math operator
        var just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);
        ++index;                                        // increase index by 1 to match the newly created object
        create_div_text_in_display (obj_array[index].value);
    } else if (numString === "." && thereIsDecimal === true) {  // case: multiple decimal points
        console.log("no decimal point added");          // nothing happens, not adding to obj_array nor appending to current number
    } else {    // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }
} // end of function number_clicked


function operator_clicked () {
    var mathOperString = $(this).text();    // grab the operator from the button text just clicked
    mathOperString = mathOperString.trim();

    console.log("oper: " + mathOperString);

    if (obj_array[index] === undefined && mathOperString === "(") {
        var just_clicked = new PunchTemplate ("operator", mathOperString);
        obj_array.push(just_clicked);                   // push operator just clicked into obj_array
        index++;                                        // increase index by 1 to stay matched with the just-pushed object
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index] === undefined && mathOperString === "-") {
        var just_clicked = new PunchTemplate ("operator", mathOperString);
        obj_array.push(just_clicked);
        index++;
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index] === undefined) { // case: premature operation (ADVANCED Operations); can't start with operator
        create_div_text_in_display ("need number!");    // do nothing except display message
    } else if (obj_array[index].type === "operator" && mathOperString === "(" ) {
        var just_clicked = new PunchTemplate ("operator", mathOperString);
        obj_array.push(just_clicked);
        index++;
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index].type === "operator" && mathOperString === ")" ) {
        var just_clicked = new PunchTemplate ("operator", mathOperString);
        obj_array.push(just_clicked);
        index++;
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index].value = ")" ) {
        var just_clicked = new PunchTemplate ("operator", mathOperString);
        obj_array.push(just_clicked);
        index++;
        create_div_text_in_display (mathOperString);
    } else if (obj_array[index].type === "operator") {  // case: multiple and changing operation keys (Comprehensive Operations)
        obj_array[index].value = mathOperString;        // replace the previous operator with the operator just clicked
        $(".container1 .display h3:last-child").text(obj_array[index].value);   // display the operator just clicked
    } else {                                            // previous button clicked is a number or equal sign
        var just_clicked = new PunchTemplate ("operator", mathOperString);  // new object is "type" of operator and a "value" of mathOperString
        obj_array.push(just_clicked);                   // push operator just clicked into obj_array
        index++;                                        // increase index by 1 to stay matched with the just-pushed object
        create_div_text_in_display (mathOperString);
    }
} // end of function operator_clicked


function equal_clicked () { // clicking "=" usually means "do the math"
    var result; var num1;   var num2;   var mathOper;   var string_result;  var temp;
    var length = obj_array.length - 1;

    check_parentheses();

    if (obj_array[index] === undefined) {   // case: missing operands (ADVANCED Operations)
        create_div_text_in_display ("Ready");   // basically do nothing
    } else if (obj_array[index].type === "equalSign") {    // case: operation repeat (consecutive equal signs, Comprehensive Operations)
        console.log("A: " + obj_array[multi_op_index].value + "  B: " + global_result + "  C: " + obj_array[multi_op_index + 1].value);
        // ensure numbers, not strings, are being manipulated otherwise the + sign in function do_math will concatenate, not add
        num1 = Number(global_result);
        mathOper = obj_array[multi_op_index].value;
        num2 = Number(obj_array[multi_op_index + 1].value);

        global_result = do_math(num1, mathOper, num2);  // it's a global variable, because its value is needed for the next time thru this branch
        string_result = "=".concat(global_result);      // concatenate "=" to result so it displays in 1 div element instead of in separate divs
        create_div_text_in_display (string_result);     // note that global_result is not pushed onto obj_array
    } else {    // else represents all cases outside of "missing operands" and "operation repeat"
        var just_clicked = new PunchTemplate ("equalSign", "=");
        obj_array.push(just_clicked);
        index++;    // global variable

        // always calculate result of first 2 numbers if there is more than 1 math operator and store it into temp
        num1 = Number(obj_array[0].value);  // for all cases

        if (obj_array[1].type !== "operator") { // case: missing operation (ADVANCED Operations)
            mathOper = "x";     // this is the case where you have only a number and an equal sign and we return num1
            num2 = 1;
        } else {                // normal operations
            mathOper = obj_array[1].value;
            num2 = Number(obj_array[2].value);
        }

        if (isNaN(num2)) {  // case: partial operand (ADVANCED Operations); if num2 is not a number, then...
            num2 = num1;
            obj_array.push(obj_array[0]);
            ++index;
            create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
        }

        if (length > 3) {   // don't bother with order of operations if there is only 1 operator
            var first3_array = order_of_ops();      // case: order of operations (Extra Operations)
            num1 = first3_array[0];                 // because obj_array might have been changed by function order_of_ops
            mathOper = first3_array[1];             // num1, mathOper, num2 and length need to be reassigned just in case
            num2 = first3_array[2];
            length = obj_array.length - 1;
        }

        var temp = do_math (num1, mathOper, num2);

        if (flag_for_op_rollover === null) {   // if rollover_result hasn't been used yet (this is the 1st rollover), set it equal to temp; if still using (for 2nd and any subsequent rollovers), use rollover_result as, that is, as it was calculated in the if statement below
            rollover_result = temp;
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
            rollover_result = do_math(rollover_result, mathOper, rollover_result);
            console.log("operator rollover_result: " + rollover_result);
            string_result = "=".concat(rollover_result);
            create_div_text_in_display (string_result);
            flag_for_op_rollover = true;
        } else {
            result = temp;              // result is for normal operations
            global_result = result;     // global_result is for operation repeat
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
            console.log("obj_array: " + obj_array); // using obj_array = [] leaves obj_array with definition and I want it to be undefined
        }

        flag_for_op_rollover = null;            // set flag_for_op_rollover to "unused"
        index = 0;                      // set the index back to the beginning position
        $(".display > h3").remove();    // destroys all h3 elements in the display
    } else {                        // CE button
        obj_array.pop();                // delete the object in the last array position

        if (index !== 0) {
            index--;                    // if clearing the 1st number/object, don't want to go index of -1, since all arrays start at 0
        }

        $("h3:last-child").remove();    // destroy the last h3 element
    }
} // end of function special_clicked

// end 4 main functions ***************************************************************************

// 4 sub functions and 1 constructor, PunchTemplate ***************************************************************************
function check_parentheses () {
    var flag1 = check_number_of ();
    // var flag2 = check_first_and_last ();

    if (flag1 === false) {
        return false;
    } else {
        return true;
    }
}

function check_number_of () {
    var length = obj_array.length;
    var count = 0;

    for (var p=0; p < length; ++p) {
        if (obj_array[p].value ===  "(") {
            count++;    // increase by 1 if there is a ( "opening parenthesis)"
        } else if (obj_array[p].value ===  ")") {
            count--;    // decrease by 1 if there is a ) "closing parenthesis"
        }

        console.log("count: " + count);
    }

    if (count === 0) {
        return true;
    } else {
        return false;
    }
}

// function check_first_and_last () {
//     var length = obj_array.length;
//     var count = 0;
//
//     // find the 1st (
//     for (var p=0; p < length; ++p) {
//         if (obj_array[p].value ===  "(") {
//             position1 = p;    //
//         } else if (obj_array[p].value ===  ")") {
//             position2 = p;    //
//         }
//
//         console.log("first"
//     }
//
//     if (count === 0) {
//         return true;
//     } else {
//         return false;
//     }
// }

function do_math (number1, mathOperator, number2) {
    if (mathOperator === "/") {
        answer  = number1 / number2;
    } else if (mathOperator === "x") {
        answer = number1 * number2;
    } else if (mathOperator === "-") {
        answer = number1 - number2;
    } else {
        answer = number1 + number2;     // ensure that number1 & number2 are numbers and not strings, otherwise concatenation instead of addition
    }
    return answer;
}

function order_of_ops () {
    var num1;   var num2;   var mathOper;   var mini_result;    var array = [];
    var length = obj_array.length - 1;
    console.log ("length: " + length);

    for (var j=0; j <= length; ++j) {   // look for "+" or "-"; the logic below doesn't work if there are no "+"s or "-"s in obj_array
        console.log("j: " + j);
        if (obj_array[j].value === "+" || obj_array[j].value === "-") { // if only "/" and/or "x", then bypass the following for loop

            for (var a = 0; a <= length; a) {   // look for division and multiplication
                console.log("a: " + a + "  obj_array[a].value: " + obj_array[a].value + "  length: " + length);
                if (obj_array[a].value === "/" || obj_array[a].value === "x") {
                    num1 = obj_array[a - 1].value;
                    mathOper = obj_array[a].value;
                    num2 = obj_array[a + 1].value;
                    mini_result = do_math(num1, mathOper, num2);

                    obj_array[a - 1].value = mini_result; // insert mini_result of the division or multiplication, into the slot of what was num1

                    for (var b = a; b < length; ++b) {  // now for remaining objects to the right of what was num1, shift objects to the left 2 positions
                        obj_array[b] = obj_array[b + 2];
                        console.log("b: " + b);
                    } // end of inner most loop

                    obj_array.pop();    // destroy the last 2 objects from obj_array since they are no longer needed; shorten obj_array
                    obj_array.pop();
                    console.log("obj_array: " + obj_array);
                    length = length - 2;
                    // "a" doesn't increment, since the array has shifted underneath so to speak
                } else {
                    a++;
                }
            } // end of middle for loop
            if (mini_result !== undefined) {    // if mini_result has value (that is, obj_array has been shortened), then...
                index = a;  // if obj_array has been shortened, index needs to be reset to "a" to target the last obj, which should be the "="
            }
        } // end of 1st if
    } // end of outer for loop
    num1 = Number(obj_array[0].value);  //
    mathOper = obj_array[1].value;      // get num1, mathOper and num2 for revamped obj_array and return to function equal_clicked
    num2 = Number(obj_array[2].value);  //

    array = [num1, mathOper, num2]  // "a" doesn't need to be returned, since it is a global variable
    return array;
}

function create_div_text_in_display (strng) {   //dynamically create h3 element, place it in display with number, operator or '=' just clicked
    var new_h3 = $("<h3>", {
        text: " " + strng + " "
    });
    $(".container1 .display").append(new_h3);
}

function checkForDecimal () {   // case: multiple decimals (Comprehensive Operations)
    var array_of_stringNumber = (obj_array[index].value).split(""); // returns an array of 1-character strings; arrays easier to deal with
    var length = array_of_stringNumber.length;

    for (var i=0; i < length; ++i) {
        if (array_of_stringNumber[i] ===  ".") {
            return true;    // true means there is a decimal in the string
        }
    }
    return false;   // false means there is no decimal point in the string
}

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}



/*************************************          Functions that I once used          **********************/




