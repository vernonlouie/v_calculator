/* Calculator      Vernon Louie       December 2016 */

/* Global vars */
var index = 0;              // index should always point to the last object in obj_array
var obj_array = [];         // obj_array is the array that holds the objects of type number, operator or equalSign

var global_result;          // used only for "operation repeat" in equal_clicked function
var multi_op_index;         // used only for "operation repeat" in equal_clicked function

var rollover_result;        // used only for "operation rollover" in equal_clicked function
var flag_for_op_rollover = null;    //flag to see if rollover_result needs to be set to temp or not in equal_clicked function

var num_of_paren_pairs = 0;         // used to count how many pairs of open and close parentheses there are
/* end Global vars */

$(document).ready(function () {
    $(".number").click(number_clicked);         // when clicking on a number, decimal point or +/-)
    $(".operator").click(operator_clicked);     // for any 4 of the operator (/ x - +) buttons
    $(".equal").click(equal_clicked);           // for equal "=" sign
    $(".special").click(special_clicked);       // for the clear keys (C and CE)
});

// 4 main functions ***************************************************************************
function number_clicked () {
/* boolean vars */ var thereIsDecimal;
/* number vars */  /* none */
/* object vars */  var just_clicked;
/* string vars */  var numString;

    numString = $(this).text();     // get the text from the button just clicked, which in this case is a number that is of type string
    numString = numString.trim();   // .trim Removes white space from the string/text.

    if (obj_array[index] !== undefined) {       // case: multiple decimals (Comprehensive Operations). check for decimal pt if there is a number
        thereIsDecimal = checkForDecimal ();    // thereIsDecimal used later in last "else if" conditional below
    }

    if (obj_array[index] === undefined && numString === "+/-") {
        just_clicked = new PunchTemplate ("number", "-");
        obj_array.push(just_clicked);       // don't increase index by 1, since index is already set correctly for first element (index = 0)
        create_div_text_in_display (obj_array[index].value);
    } else if (obj_array[index] === undefined) {   // if this is the very first number entered into display (after clearing, "C")
        just_clicked = new PunchTemplate ("number", numString);
        obj_array.push(just_clicked);       // don't increase index by 1, since index is already set correctly for first element (index = 0)
        create_div_text_in_display (obj_array[index].value);    // create h3 element, place it in display with the number just clicked
    } else if (obj_array[index].value === "/" && numString === "0") {   // case: division by zero (Comprehensive Operations)
        create_div_text_in_display (numString);
        create_div_text_in_display ("Error - division by zero.  Click C to clear!!");
    } else if ((obj_array[index].value === "-" && obj_array[index].type === "number") && numString === "+/-") {
        deleteLastH3();
    } else if (numString === "+/-") {
        cOPID ("number", "-");
    } else if (obj_array[index].type === "operator") {
        cOPID ("number", numString);
    } else if (numString === "." && thereIsDecimal === true) {  // case: multiple decimal points
        console.log("no decimal point added");          // nothing happens, not adding to obj_array nor appending to current number
    } else if (obj_array[index].type = "number") { // append number just clicked to already existing number in current object
        obj_array[index].value = obj_array[index].value + numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    } else if ( (obj_array[index - 1].value === "/" && obj_array[index].value === "0") && numString !== ".") {
        create_div_text_in_display (numString);
        create_div_text_in_display ("Error - division by zero.  Click C to clear!!");
    } else {    // append number just clicked to what is already in the "value" property of the object, which should be a string of numbers
        obj_array[index].value += numString;
        $(".container1 .display h3:last-child").text(obj_array[index].value);
    }
} // end of function number_clicked


function operator_clicked () {
/* string vars */  var mathOperString;

    mathOperString = $(this).text();    // grab the operator from the button text just clicked
    mathOperString = mathOperString.trim();

    console.log("oper: " + mathOperString);

    if (obj_array[index] === undefined && mathOperString === "()") {    // allow very first character to be "("
        mathOperString = "(" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index] === undefined) { // case: premature operation (ADVANCED Operations); can't start with +,-,/ or x
        create_div_text_in_display ("need number!");    // do nothing except display message

    } else if (obj_array[index].value === ")" && mathOperString === "()" ) {        //  e.g. ))
        mathOperString = ")" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].value === ")" ) {                                   //  e.g. )+ or )x or )/ or )-
        cOPID("operator", mathOperString);

    } else if (obj_array[index].type === "operator" && mathOperString === "()") {   //  e.g. (( or +( or -( or x( or /(
        mathOperString = "(" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].value === "-" && mathOperString === "()" ) {        //  e.g. -(n x m)
        mathOperString = "(" ;
        cOPID("operator", mathOperString);
    } else if (obj_array[index].type === "number" && mathOperString === "()" ) {    //  e.g. 8)
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


/** When "=" is clicked, it triggers the processing of the equation.  */
function equal_clicked () {
/* boolean vars */ var parenGood;
/* number vars */  var count, length, num1, num2, result, temp;
/* string vars */  var mathOper, string_result;

    // 1st, process the parentheses if there are any
    parenGood = check_parentheses();
    console.log("parenGood: " + parenGood);

    if (parenGood === true) {   // parenGood could also have value of "null" if there are no parentheses at all in the equation
        evaluateAllParentheses();
    } else if (parenGood === false) {
        create_div_text_in_display ("Parentheses are not good");
    }

    // 2nd, begin processing special cases
    if (obj_array[index] === undefined) {   // case: missing operands (ADVANCED Operations)
        create_div_text_in_display ("Ready");   // basically do nothing
    } else if (obj_array[index].type === "equalSign") {    // case: operation repeat (consecutive equal signs, Comprehensive Operations)
        console.log("A: " + obj_array[multi_op_index].value + "  B: " + global_result + "  C: " + obj_array[multi_op_index + 1].value);
        // ensure numbers, not strings, are being manipulated otherwise the + sign in function do_math will concatenate, not add
        num1 = Number(global_result);
        mathOper = obj_array[multi_op_index].value;
        num2 = Number(obj_array[multi_op_index + 1].value);

        global_result = do_math(num1, mathOper, num2);  // global variable, because its value is needed for the next time thru this branch
        string_result = "=".concat(global_result);      // concatenate "=" to result so it displays in 1 div instead of in separate divs
        create_div_text_in_display (string_result);     // note that global_result is not pushed onto obj_array
    } else {        // else represents all cases outside of "missing operands" and "operation repeat"
        var just_clicked = new PunchTemplate ("equalSign", "=");
        obj_array.push(just_clicked);
        index++;    // global variable

        // always calculate result of first 2 numbers and store it into temp
        num1 = Number(obj_array[0].value);  // for all cases

        if (obj_array[1].type !== "operator") { // case: missing operation (ADVANCED Operations)
            mathOper = "x";     // this is the case where you have only a number and an equal sign and we return num1
            num2 = 1;           // so you get "num1 x 1" which results in num1
        } else {                // mathOper and num2 for normal operations
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
        count = countNumbersInArray (obj_array);

        // 3rd, do order of operations if necessary; that is, do / and x before - and +
        if (count > 2) {        // do order of operations if there are more than 2 numbers
            var first3_array = order_of_ops(obj_array);     // case: order of operations (Extra Operations); call order_of_ops function
            num1 = first3_array[0];             // because obj_array might have been changed by function order_of_ops
            mathOper = first3_array[1];         // num1, mathOper, num2 and length need to be reassigned just in case
            num2 = first3_array[2];             // first3_array is just an array of 3 numbers; it isn't "born" from PunchTemplate constructor
            index = first3_array[3];            // index has changed if there was any "/" or "x" in obj_array
            length = obj_array.length - 1;
        }

        temp = do_math (num1, mathOper, num2);

        if (flag_for_op_rollover === null) {   // if rollover_result hasn't been used yet (this is the 1st rollover), set it equal to temp; if still using (for 2nd and any subsequent rollovers), use rollover_result as, that is, as it was calculated in the if statement below
            rollover_result = temp;
        }

        // 4th, do successive operations.  By now, obj_array has no parentheses.  obj_array has no multiplication or division left to process.  Any processing now is just addition and subtraction.  Loop and do left most operators first; if there are only 2 numbers with 1 operator, then this for loop is not executed because length of obj_array in this case would only be 3 and i would fail the initial condition check
        for (i=3; i < length; i+=2) { // case: successive operation & multi keys (Comprehensive Operations)
            mathOper = obj_array[i].value;
            num2 = Number(obj_array[i+1].value);

            temp = do_math(temp, mathOper, num2);   // do 1 math operation at a time
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


/** This function is for the rest of the buttons that aren't number, operator or equal.  So that leaves "C" and "CE" */
function special_clicked () {
    var clearKey = $(this).text();
    clearKey = clearKey.trim();

    if (clearKey === "C") {
        for (var j=0; j <= index; ++j) {
            obj_array.pop();            // remove all objects/elements from the array, but removes them 1 at a time
            console.log("obj_array: " + obj_array); // using obj_array = [] leaves obj_array with definition and I want it to be undefined
        }

        flag_for_op_rollover = null;    // set flag_for_op_rollover to "unused"
        index = 0;                      // set the index back to the beginning position
        num_of_paren_pairs = 0;
        $(".display > h3").remove();    // destroys all h3 elements in the display
    } else {                        // CE button
        deleteLastH3 ();
    }
} // end of function special_clicked
// end 4 main functions ***************************************************************************************************

// sub functions and 1 constructor, PunchTemplate in alphabetical order by function name **********************************

/** Checks that the 1st and last open and close parentheses are in the correct order.  You don't have something like "8))+((7=".  You have the correct number of parentheses, but they're not in the correct order. */
function check_first_and_last_parentheses () {
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

    /* so both the first set of parentheses and the last set of parentheses must be in order to return true */
    if (psn_first_openParen < psn_first_closeParen) {
        return (psn_last_openParen < psn_last_closeParen);
    } else {
        return false;
    }
}

/** case: multiple decimal points (Comprehensive Operations) */
function checkForDecimal () {
    var array_of_stringNumber = (obj_array[index].value).split(""); // returns an array of 1-character strings; arrays easier to deal with
    var length = array_of_stringNumber.length;

    for (var i=0; i < length; ++i) {
        if (array_of_stringNumber[i] ===  ".") {
            return true;    // true means there is a decimal in the string
        }
    }
    return false;   // false means there is no decimal point in the string
}

/** check that there are an equal number of opening and closing parentheses */
function check_number_of_parentheses () {
    var length = obj_array.length;
    var count = 0;

    for (var p=0; p < length; ++p) {
        if (obj_array[p].value ===  "(") {
            count++;    // increase by 1 if there is a "(" , opening parenthesis
        } else if (obj_array[p].value ===  ")") {
            count--;    // decrease by 1 if there is a ")" , closing parenthesis
            num_of_paren_pairs++;   // num_of_paren_pairs is used by function evaluateAllParentheses to set up for loop
        }
        console.log("count: " + count);
    }

    return (count === 0);   // if there are an equal number of open and close parentheses, then "count" should be zero (return true)
}

/** Checks if there are any parentheses and then calls 2 functions to do further checks to see that the parentheses are in good order */
function check_parentheses () {
    var length = obj_array.length;

    for (var h=0; h < length; ++h) {
        if (obj_array[h].value ===  "(" || obj_array[h].value === ")") {
            console.log("There are parentheses in the equation...proceed to parentheses checks");
            var parenCountGood = check_number_of_parentheses ();
            var parenOrderGood = check_first_and_last_parentheses ();

            return (parenCountGood === true && parenOrderGood === true);    // return false if either is false
        }
    }
    return null;    // no parentheses were found in the equation
}

/** cOPID acronym = create Object, Push, Increase index, and Display */
function cOPID (tipe, valu) {
    var just_clicked = new PunchTemplate (tipe, valu);  // create new object from constructor
    obj_array.push(just_clicked);                       // push object just_clicked into obj_array
    index++;                                            // increase index by 1 to stay matched with the just-pushed object
    create_div_text_in_display (valu);                  // display operator or number in display area
}

/** Determines the quantity of numbers in the array.  If more than 2 numbers, then returns true. */
function countNumbersInArray (array) {
    var count = 0;
    var length = array.length;

    for (var i=0; i < length; i++) {
        if (array[i].type === "number") {
            count++;
        }
    }
    return count;
}

/** dynamically creates h3 element, places it in display with number, operator or '=' just clicked */
function create_div_text_in_display (strng) {
    var new_h3 = $("<h3>", {
        text: " " + strng + " "
    });
    $(".container1 .display").append(new_h3);
}

/** removes the last element in the array; is basically the "CE" button */
function deleteLastH3 () {
    obj_array.pop();                // delete the object in the last array position
    $("h3:last-child").remove();    // destroy the last h3 element

    if (index !== 0) {
        index--;            // if clearing 1st number/object, don't want index of -1, since all arrays start at 0
    }
}

function do_math (number1, mathOperator, number2) {
    if (mathOperator === "/") {
        answer  = number1 / number2;
    } else if (mathOperator === "x") {
        answer = number1 * number2;
    } else if (mathOperator === "-") {
        answer = number1 - number2;
    } else {
        answer = number1 + number2;
        // ensure that number1 & number2 are numbers and not strings, otherwise you will get concatenation instead of addition
    }
    return answer;
}

/** Evaluates expressions within each set of parentheses in the correct order.  Gets rid of parentheses and shortens obj_array accordingly.  Does not do any math outside of parentheses. */
function evaluateAllParentheses () {
    for (var i=0; i < num_of_paren_pairs; i++)  {
        var array = findParenthesesToEvaluate ();
        evaluate1SetOfParentheses (array[0], array[1]);     // pass in positions of the target parentheses
    }
}

/** Evaluates whatever is in 1 set of open and close parentheses.  Replaces the parentheses and their content with the result (a number) of the evaluation into obj_array. */
function evaluate1SetOfParentheses (psn_openParen, psn_closeParen) {
/* array vars */    var first3_array = [], sliceArray = [];
/* boolean vars */
/* number vars */   var count, num1, num2, shift, slice_length, temp,  length = obj_array.length;
/* string vars */   var mathOper;

    sliceArray = obj_array.slice(psn_openParen + 1, psn_closeParen);    //get part of the equation that is between the parentheses)
    console.log("sliceArray: " + sliceArray);

    count = countNumbersInArray (sliceArray);

    if (count > 2) {   // don't bother with order of operations if there are only 2 numbers
        first3_array = order_of_ops(sliceArray);      // case: order of operations (Extra Operations); call order_of_ops function

        num1 = first3_array[0];                 // because obj_array might have been changed by function order_of_ops
        mathOper = first3_array[1];             // num1, mathOper, num2 and length need to be reassigned just in case
        num2 = first3_array[2];                 // first3_array is just an array of 3 numbers; it isn't "born" from PunchTemplate constructor

      /* in case the expression inside the parenthesis is just one number and nothing else; this is for when you have more parentheses surrounding an expression than is needed; e.g. ((7+3)) becomes (10) and according to the logic, (10) still needs to be evaluated since there are parentheses around it, but (10) is missing an operator and the second operand. So this "else if" supplies (10) with an operator and second operand, so when we call function do_math below, we call it properly with 3 parameters */
    } else if (count === 1) {
        num1 = sliceArray[0].value;
        mathOper = "x";
        num2 = 1;               // so you get "num1 x 1" which results in the variable temp (see below) being equal to num1 (desired)
    } else {
        num1 = Number(sliceArray[0].value);
        mathOper = sliceArray[1].value;
        num2 = Number(sliceArray[2].value);
    }

    temp = do_math (num1, mathOper, num2);
    slice_length = sliceArray.length;

    for (i=3; i < slice_length; i+=2) { // case: successive operation & multi keys (Comprehensive Operations)
        mathOper = sliceArray[i].value;
        num2 = Number(sliceArray[i+1].value);

        temp = do_math(temp, mathOper, num2);   // do 1 math operation at a time
        console.log("temp: " + temp);
    }   // after for loop, the expression inside the parentheses has been reduced to a single value, temp

    obj_array[psn_openParen].type = "number";
    obj_array[psn_openParen].value = temp;      // store temp into obj_array at position of what was the open parenthesis

    // calculate how much to "shift" the objects that were to the right of the evaluated set of parentheses
    shift = psn_closeParen - psn_openParen;

    for (var c = (psn_openParen + 1);  (c + shift) < length;  c++) {
        obj_array[c] = obj_array[c+shift];      // now shift or copy those objects to the left
    }

    for (var d=0; d < shift; d++) {
        obj_array.pop();
        // now delete the objects that were just shifted in the previous for loop, otherwise there will be two sets of those shifted objects
    }

    index = index - shift;  // update index, global variable, to point at the last object in obj_array
}

/** This applies to obj_array, the main array holding all the numbers and operators and parentheses.  Gets the correct set of parentheses to evaluate.  This function is called by function evaluateAllParentheses. */
function findParenthesesToEvaluate () {
/* array vars */    var array = [];
/* number vars */   var psn_openParen, psn_closeParen, length = obj_array.length;

    console.log("in function findParenthesesToEvaluate");

    for (var p = 0; p < length; ++p) {
        if (obj_array[p].value === "(") {
            psn_openParen = p;              // gets the 1st open parenthesis from left to right
            console.log("OpenParen: " + p);

            /* once the 1st open parenthesis is found, keep on searching the rest of obj_array until a closing parenthesis is found.  If there are more open parentheses between the 1st open parenthesis and the 1st closing parenthesis, then replace what was the position of the 1st open parenthesis with the position of the next open parenthesis and so on. */
            for (var q = p + 1; q < length; ++q) {
                if (obj_array[q].value === "(" ) {
                    psn_openParen = q;
                    console.log("OpenParen: " + q);
                } else if (obj_array[q].value === ")") {
                    psn_closeParen = q;
                    console.log("CloseParen: " + q);
                    break;
                }
            }   // break out of both inner and outer loops once we have the positions of parentheses that will be evaluated
        break;
        }
    }

    array[0] = psn_openParen;   // store in array, so we can pass both array indices/positions to the calling function
    array[1] = psn_closeParen;
    return array;
}

/** Takes in an array and does order of ops on it.  From left to right, this function divides or multiplies.  Inserts the result of the division or multiplication into the 1st operand's slot, and shifts the rest of the array 2 indexes to the left.  And then shortens the array by 2.  This is for each / or x.  If the equation is all / or * (no + or -), then this function does nothing to the array. */
function order_of_ops (input_array) {
/* array vars */    var array = [];
/* number vars */   var mini_result, num1, num2,     length = input_array.length - 1,
                    a = input_array.length - 1; /* a is initially set to equal the last index of the array, since if this function doesn't reduce the equation (reduce the array by "pop"), then the index shouldn't change.  Within the inner for loop, "a" gets its value set.
/* string vars */  var mathOper;

    console.log ("length: " + length);

    for (var j=0; j <= length; ++j) {   // look for "+" or "-"; the logic below doesn't work if there are no "+"s or "-"s in input_array
        console.log("j: " + j);
        if (input_array[j].value === "+" || input_array[j].value === "-") { // if only "/" and/or "x", then bypass the following for loop

            for (var a = 0; a <= length; a) {   // look for division, "/" and multiplication, "x"
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
        } // end of 1st if
    } // end of outer for loop

    num1 = Number(input_array[0].value);    //
    mathOper = input_array[1].value;        // get num1, mathOper and num2 for revamped input_array and return to function equal_clicked
    num2 = Number(input_array[2].value);    //

    array = [num1, mathOper, num2, a];  // set index = a for obj_array back in function equal_clicked;
    return array;
}

function PunchTemplate (type, value) {  // PunchTemplate as in punching a button
    this.type = type;       // type can be number, operator or equalSign
    this.value = value;     // value should be the value of the button just clicked
}


/***********************************************************/




