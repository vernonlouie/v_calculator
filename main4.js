/* Calculator project, version1.1     Vernon Louie    C11.16      December 11, 2016 */

var index = 0;              // index should always point to the last object in obj_array
var obj_array = [];         // obj_array is the array that holds the objects of type number, operator or equalSign

var global_result;          // used only for "operation repeat" in equal_clicked function
var multi_op_index;         // used only for "operation repeat" in equal_clicked function

var rollover_result;        // used only for "operation rollover" in equal_clicked function
var flag_for_op_rollover = null;    //flag to see if rollover_result needs to be set to temp or not in equal_clicked function

$(document).ready(function () {
    $(".number").click(number_clicked);         // Call function number_clicked when clicking on a number button (including decimal point)
    $(".operator").click(operator_clicked);     // for any 4 of the operator (/ x - +) buttons
    $(".equal").click(equal_clicked);           // for equal "=" sign
    $(".special").click(special_clicked);       // for the clear keys (C and CE)
});

// 4 main functions ***************************************************************************
function number_clicked () {
    /* boolean variables */ var thereIsDecimal;
    /* number variables */  /* none */
    /* object variables */  var just_clicked;
    /* string variables */  var numString;

    numString = $(this).text();     // get the text from the button just clicked, which in this case is a number that is of type string
    numString = numString.trim();       // .trim Removes white space from the string/text.

    if (obj_array[index] !== undefined) {       // case: multiple decimals (Comprehensive Operations). check for decimal pt if there is a number
        thereIsDecimal = checkForDecimal ();    // thereIsDecimal used later in last "else if" conditional below
    }

    if (obj_array[index] === undefined) {   // if this is the very first number
        just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // don't increase index by 1, since index is already set correctly for first element (index = 0)
        create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
    } else if (obj_array[index].value === "/" && numString === "0") {   // case: division by zero (Comprehensive Operations)
        create_div_text_in_display (numString);
        create_div_text_in_display ("Error - division by zero.  Click C to clear!!");
    } else if (obj_array[index].type === "operator") {
        cOPID("number", numString);
    } else if (numString === "." && thereIsDecimal === true) {  // case: multiple decimal points
        console.log("no decimal point added");          // nothing happens, not adding to obj_array nor appending to current number
    } else {    // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }
} // end of function number_clicked


function operator_clicked () {
    /* string variables */  var mathOperString;

    mathOperString = $(this).text();    // grab the operator from the button text just clicked
    mathOperString = mathOperString.trim();

    console.log("oper: " + mathOperString);

    if (obj_array[index] === undefined && mathOperString === "()") {    // allow very first character to be "("
        mathOperString = "(" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index] === undefined) { // case: premature operation (ADVANCED Operations); can't start with +,-,/ or x
        create_div_text_in_display ("need number!");    // do nothing except display message

    } else if (obj_array[index].value === ")" && mathOperString === "()" ) {        //  ))
        mathOperString = ")" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].value === ")" ) {                                   //  )+ or )x or )/ or )-
        cOPID("operator", mathOperString);

    } else if (obj_array[index].type === "operator" && mathOperString === "()") {   //  (( or +( or -( or x( or /(
        mathOperString = "(" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].type === "number" && mathOperString === "()" ) {    //  8)
        mathOperString = ")" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].value === "(" ) {
        console.log("illegal operation");
        /* this branch is needed to do nothing; otherwise the case where the "(" is followed by a +,-,x or / will fall into the
           case: multiple and changing operation keys branch (the next "else if" branch); ie, the "(" gets replaced */

    } else if (obj_array[index].type === "operator") {  // case: multiple and changing operation keys (Comprehensive Operations)
        obj_array[index].value = mathOperString;        // replace the previous operator with the operator just clicked
        $(".container1 .display h3:last-child").text(obj_array[index].value);   // display the operator just clicked
    } else {                                            // previous button clicked is a number or equal sign
        cOPID("operator", mathOperString);
    }
} // end of function operator_clicked


function equal_clicked () { // clicking "=" usually means "do the math"
    /* boolean variables */ var parenGood;
    /* number variables */  var length, num1, num2, result, temp;
    /* string variables */  var mathOper, string_result;

    parenGood = check_parentheses();
    console.log("parenGood: " + parenGood);

    if (parenGood === true) {   // parenGood could also have value of "null" if there are no parentheses at all in the equation
        evaluateParentheses();
    } else if (parenGood === false) {
        create_div_text_in_display ("Parentheses are not good");
    }

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

        length = obj_array.length - 1;

        var moreThan2Numbers = countNumbersInArray (obj_array);

        if (moreThan2Numbers === true) {   // don't bother with order of operations if there are only 2 numbers
            var first3_array = order_of_ops(obj_array);     // case: order of operations (Extra Operations); call order_of_ops function
            num1 = first3_array[0];             // because obj_array might have been changed by function order_of_ops
            mathOper = first3_array[1];         // num1, mathOper, num2 and length need to be reassigned just in case
            num2 = first3_array[2];             // first3_array is just an array of 3 numbers; it isn't "born" from PunchTemplate constructor
            index = first3_array[3];
            length = obj_array.length - 1;
        }

        temp = do_math (num1, mathOper, num2);

        if (flag_for_op_rollover === null) {   // if rollover_result hasn't been used yet (this is the 1st rollover), set it equal to temp; if still using (for 2nd and any subsequent rollovers), use rollover_result as, that is, as it was calculated in the if statement below
            rollover_result = temp;
        }

        // loop and do left most operators first; if there are only 2 numbers with 1 operator, then this for loop is not executed because length of obj_array in this case would only be 3 and i would fail the initial condition check
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

// end 4 main functions ***************************************************************************************************

// sub functions and 1 constructor, PunchTemplate in alphabetical order by function name **********************************
function check_first_and_last_parentheses () {  // check that the 1st and last open and close parentheses are in the correct order
    var length = obj_array.length;
    var psn_first_openParen = null, psn_first_closeParen = null, psn_last_openParen = null, psn_last_closeParen = null;

    // find the 1st "(" and 1st ")"
    for (var p=0; p < length; ++p) {
        if (obj_array[p].value ===  "(" && psn_first_openParen === null) {
            psn_first_openParen = p;
        } else if (obj_array[p].value ===  ")" && psn_first_closeParen === null) {
            psn_first_closeParen = p;
        }
    }
    console.log("psn_1st_openParen: " + psn_first_openParen + "  psn_1st_closeParen: " + psn_first_closeParen);

    // find the last "(" and last ")"
    for (var q = length-1; q >= 0; --q) {
        if (obj_array[q].value ===  "(" && psn_last_openParen === null) {
            psn_last_openParen = q;
        } else if (obj_array[q].value ===  ")" && psn_last_closeParen === null) {
            psn_last_closeParen = q;
        }
    }
    console.log("psn_last_openParen: " + psn_last_openParen + "  psn_last_closeParen: " + psn_last_closeParen);

    if (psn_first_openParen < psn_first_closeParen) {
        if (psn_last_openParen < psn_last_closeParen) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
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

function check_number_of_parentheses () {   // check that there are an equal number of opening and closing parentheses
    var length = obj_array.length;
    var count = 0;

    for (var p=0; p < length; ++p) {
        if (obj_array[p].value ===  "(") {
            count++;    // increase by 1 if there is a "(" , opening parenthesis
        } else if (obj_array[p].value ===  ")") {
            count--;    // decrease by 1 if there is a ")" , closing parenthesis
        }
        console.log("count: " + count);
    }

    if (count === 0) {
        return true;
    } else {
        return false;
    }
}

function check_parentheses () {
    var length = obj_array.length;

    for (var h=0; h < length; ++h) {
        if (obj_array[h].value ===  "(" || obj_array[h].value === ")") {
            console.log("There are parentheses in the equation...proceed to parentheses checks");
            var parenCountGood = check_number_of_parentheses ();
            var parenOrderGood = check_first_and_last_parentheses ();

            if (parenCountGood === true && parenOrderGood === true) {
                return true;
            } else {
                return false;
            }
        }
    }
    return null;    // no parentheses were found in the equation
}

function cOPID (tipe, valu) {                           // cOPID = create Object, Push, Increase index, and Display
    var just_clicked = new PunchTemplate (tipe, valu);  // create new object from constructor
    obj_array.push(just_clicked);                       // push object just_clicked into obj_array
    index++;                                            // increase index by 1 to stay matched with the just-pushed object
    create_div_text_in_display (valu);                  // display operator or number in display area
}

function create_div_text_in_display (strng) {   //dynamically create h3 element, place it in display with number, operator or '=' just clicked
    var new_h3 = $("<h3>", {
        text: " " + strng + " "
    });
    $(".container1 .display").append(new_h3);
}

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

function evaluateParentheses () {
/* array variables */   var first3array = [], sliceArray = [];
/* number variables */  var num1, num2, psn_first_openParen, psn_first_closeParen, shift, slice_length, temp,  length = obj_array.length;
/* string variables */  var mathOper;

    for (var p=0; p < length; ++p) {
        if (obj_array[p].value ===  "(" ) {
            psn_first_openParen = p;
        } else if (obj_array[p].value ===  ")" ) {
            psn_first_closeParen = p;
        }
    }

    sliceArray = obj_array.slice(psn_first_openParen + 1, psn_first_closeParen);
    slice_length = sliceArray.length;
    console.log("sliceArray: " + sliceArray);
    num1 = Number(sliceArray[0].value);
    mathOper = sliceArray[1].value;
    num2 = Number(sliceArray[2].value);

    if (slice_length > 3) {   // don't bother with order of operations if there is only 1 operator
        first3_array = order_of_ops(sliceArray);      // case: order of operations (Extra Operations); call order_of_ops function
        num1 = first3_array[0];                 // because obj_array might have been changed by function order_of_ops
        mathOper = first3_array[1];             // num1, mathOper, num2 and length need to be reassigned just in case
        num2 = first3_array[2];                 // first3_array is just an array of 3 numbers; it isn't "born" from PunchTemplate constructor
        slice_length = sliceArray.length;
    }

    temp = do_math (num1, mathOper, num2);

    for (i=3; i < slice_length; i+=2) { // case: successive operation & multi keys (Comprehensive Operations)
        num1 = temp;
        mathOper = sliceArray[i].value;
        num2 = Number(sliceArray[i+1].value);

        temp = do_math(num1, mathOper, num2);   // do 1 math operation at a time
        console.log("temp: " + temp);
    } // end of for loop

    obj_array[psn_first_openParen].type = "number";
    obj_array[psn_first_openParen].value = temp;

    shift = psn_first_closeParen - psn_first_openParen;

    for (var c = (psn_first_openParen + 1);  (c + shift) < length;  c++) {
        obj_array[c] = obj_array[c+shift];
    }

    for (var d=0; d < shift; d++) {
        obj_array.pop();
    }
    index = index - shift;
}

function countNumbersInArray (array) {
    var count = 0;
    var length = array.length;

    for (var i=0; i < length; i++) {
        if (array[i].type === "number") {
            count++;
        }
    }

    if (count > 2) {
        return true;
    } else {
        return false;
    }
}

function order_of_ops (input_array) {
    /* array variables */   array = [];
    /* number variables */  var mini_result, num1, num2,    a = input_array.length - 1, length = input_array.length - 1;
    /* string variables */  var mathOper;

    console.log ("length: " + length);

    for (var j=0; j <= length; ++j) {   // look for "+" or "-"; the logic below doesn't work if there are no "+"s or "-"s in input_array
        console.log("j: " + j);
        if (input_array[j].value === "+" || input_array[j].value === "-") { // if only "/" and/or "x", then bypass the following for loop

            for (var a = 0; a <= length; a) {   // look for division and multiplication
                console.log("a: " + a + "  input_array[a].value: " + input_array[a].value + "  length: " + length);
                if (input_array[a].value === "/" || input_array[a].value === "x") {
                    num1 = input_array[a - 1].value;
                    mathOper = input_array[a].value;
                    num2 = input_array[a + 1].value;
                    mini_result = do_math(num1, mathOper, num2);

                    input_array[a - 1].value = mini_result; // insert mini_result of the division or multiplication, into the slot of what was num1

                    for (var b = a; b < length; ++b) {
                        // now for remaining objects to the right of what was num1, shift objects to the left 2 positions
                        input_array[b] = input_array[b + 2];
                        console.log("b: " + b);
                    } // end of inner most loop

                    input_array.pop();    // destroy the last 2 objects from input_array since they are no longer needed; shorten input_array
                    input_array.pop();
                    console.log("input_array: " + input_array);
                    length = length - 2;
                    // "a" doesn't increment, since the array has shifted underneath so to speak
                } else {
                    a++;
                }
            } // end of middle for loop

            // if mini_result has value (that is, input_array has been shortened), then...
            // if (mini_result !== undefined && obj_array[a].value === "=") {//     index = a;  // if input_array has been shortened, index needs to be reset to "a" to target the last obj, which should be the "="
            // }
        } // end of 1st if
    } // end of outer for loop
    num1 = Number(input_array[0].value);  //
    mathOper = input_array[1].value;      // get num1, mathOper and num2 for revamped input_array and return to function equal_clicked
    num2 = Number(input_array[2].value);  //

    array = [num1, mathOper, num2, a];  // set index = a for obj_array;
    return array;
}

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}



/*************************************          Functions that I once used          **********************/




