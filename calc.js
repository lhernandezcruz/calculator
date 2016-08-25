var queue = []; // use shift and push
var stack = []; // use pop and push
var operators = {
    "-": 0
    , "+": 0
    , "*": 1
    , "/": 1
    , "^": 4
    , "sqrt": 4
    , "-u": 5
    , "sin": 2
    , "cos": 2
    , "tan": 2
    , "max": 3
    , "min": 3
    , "log": 2
    , "ln": 2
    , "pi": 4
}

var special = ["sin", "cos", "sqrt", "-u", "tan", "log", "ln", "pi"]
    /**
     *  readInput
     *  input : mathExp = a string that has a math expression
     *  ouput : a list with the mathExp returned as 'tokens'
     */
var readInput = function (mathExp) {
    // get rid of spaces
    mathExp = mathExp.replace(/\s+/g, '');

    var output = [];
    var str = "";
    // loop through mathExp
    for (var i = 0; i < mathExp.length; i++) {
        var current = mathExp[i];

        // if it is first element... add to str
        if (i === 0) {
            if (current === "(") {
                output.push(current);
            } else {
                str = current;
            }

        } else {
            if (!isNaN(str) && isNaN(current) && current !== "," && current !== "(" && current !== ")") {
                if (str !== "") {
                    output.push(str);
                }
                str = current;
            } else if (operators.hasOwnProperty(current) || current === "(" || current === ")" || current === ",") {
                // check if current character is an operator or a "(  ,  )"
                // if str is not empty add str to output
                if (str !== "") {
                    output.push(str);
                }
                // make str empty... push current character to output
                str = "";
                output.push(current);

            } else {
                // if str is operator add it to output
                // update str by adding current chracter to it
                if (operators.hasOwnProperty(str)) {
                    output.push(str);
                    str = current;
                } else {
                    str += current;
                }
            }

        }
    }
    if (str !== "") {
        output.push(str);
    }
    return output;
}

/**
 * operation
 *   input : a,b, operand
 *   ouput : the operand done on a and b
 */
var operation = function (a, b, operand) {
    // check which operand it is and do function
    switch (operand) {
    case "-":
        return a - b;
    case "+":
        return a + b;
    case "*":
        return a * b;
    case "/":
        return a / b;
    case "^":
        return Math.pow(a, b);
    case "-u":
        return -1 * a;
    case "sin":
        return Math.sin(a);
    case "cos":
        return Math.cos(a);
    case "tan":
        return Math.tan(a);
    case "max":
        return Math.max(a, b);
    case "min":
        return Math.min(a, b);
    case "sqrt":
        return Math.sqrt(a);
    case "log":
        return Math.log10(a);
    case "ln":
        return Math.log(a);
    case "pi":
        return Math.PI;
    }

};

/**
 *  doMath(postFix)
 *  input : postFix = a list in postFix notation
 *  output : the value of the postFix
 **/
var doMath = function (postFix) {
    // create mathStack 
    var mathStack = [];

    // while postFix not empty
    while (postFix.length !== 0) {
        // get first element of postFix array
        var first = postFix.shift();

        // check if it is an operation
        if (operators.hasOwnProperty(first)) {
            // check if it is a "one number operation", do appropriate math and add to mathstack
            if (special.indexOf(first) !== -1) {
                var stackA = mathStack.pop();
                var result = operation(stackA, null, first);
                mathStack.push(result);
            } else {
                // get the last two numbers and do operation
                var stackB = mathStack.pop();
                var stackA = mathStack.pop();
                // get result and push it onto stack
                var result = operation(stackA, stackB, first);
                mathStack.push(result);
            }

        } else {
            // must be number... add it to mathStack
            mathStack.push(first);
        }
    }
    // return first and only element of mathStack :)
    return mathStack.shift();
};

/**
 *  getPriority(inputToken, inputQ, inputStack)
 *  input: inputOperator = token that will be checked (will be operator)
 *         inputQ = queue that contains tokens
 *         operatorStack = stack that contains operators (will be non-empty)
 *  output: the same queue and stack but modified
 **/
var getPriority = function (inputOperator, tokenQ, operatorStack) {
    // get operator at top of stack
    var stackOperator = operatorStack.pop();

    // check priority of stackOperator vs inputOperator
    if (operators[stackOperator] >= operators[inputOperator]) {
        // add stackOperator to tokenQ, and inputOperator to operatorStack
        tokenQ.push(stackOperator);
        operatorStack.push(inputOperator);
    } else {
        // add both to stack
        operatorStack.push(stackOperator);
        operatorStack.push(inputOperator);
    }
    // return tokenQ and operatorStack
    return [tokenQ, operatorStack];
};

/**
 *  solve(str)
 *  input: str = a string of a math problem ex: 1 + 1
 *  output : the answer to the mathProblem
 **/
// input = str... changes str to postFix
var solve = function (mathProblem) {
    // get it in infix form
    var infix = readInput(mathProblem);
    // loop through tokens
    for (var i = 0; i < infix.length; i++) {
        var token = infix[i];

        // if token is just a number... add it to queue
        if (!isNaN(token)) {
            // parse string to a float
            queue.push(parseFloat(token));
        } else {
            // check if token is an operator
            if (operators.hasOwnProperty(token)) {

                // check if token is a negative sign
                if (token === "-") {
                    // if token is at begining, or if an operator/comma preceded token it must be negative number
                    if (i === 0 || infix[i - 1] === "(" || operators.hasOwnProperty(infix[i - 1]) || infix[i - 1] === ",") {
                        // if stack is empty add "-u" to stack
                        if (stack.length === 0) {
                            stack.push("-u");
                        } else {
                            // check where operator at top of stack should be placed
                            var priority = getPriority("-u", queue, stack);
                            queue = priority[0];
                            stack = priority[1];
                        }
                    } else {
                        // it is negative number... check where to add token
                        if (stack.length === 0) {
                            stack.push(token);
                        } else {
                            var priority = getPriority(token, queue, stack);
                            queue = priority[0];
                            stack = priority[1];

                        }
                    }
                } else if (token === "pi") {
                    // if it is pi
                    if (queue.length === 0) {
                        // queu is empty add 1,pi, * to queue
                        queue.push(1);
                        queue.push(Math.PI);
                        queue.push("*");
                    } else if (infix[i - 1] === "*") {
                        // get top of stack (will be *)
                        var top = stack.pop();
                        queue.push(Math.PI);
                        queue.push(top);
                    } else if (operators.hasOwnProperty(infix[i - 1]) === -1) {
                        // has number before it so add pi and * to queue
                        queue.push(1);
                        queue.push(Math.PI);
                        queue.push("*");
                    } else {
                        // has operation before it
                        if (stack.length === 0 || !isNaN(infix[i-1])) {
                            queue.push(Math.PI);
                            queue.push("*");
                        } else {
                            queue.push(Math.PI);
                        }
                    }
                } else {
                    // just operator... check where to add it
                    if (stack.length === 0) {
                        stack.push(token);
                    } else {
                        // check for priority
                        var priority = getPriority(token, queue, stack);
                        queue = priority[0];
                        stack = priority[1];
                    }
                }
            } else if (token === "(") {
                // add ( to stack
                stack.push(token);
            } else if (token === ")") {
                // add the operators until you find the left-parenthesis
                var notFound = true;
                while (notFound) {
                    var top = stack.pop();
                    if (top === "(") {
                        notFound = false;
                        break;
                    } else {
                        queue.push(top);
                    }
                }
            } else if (token === ",") {
                // this is for max(a,b) and min(a,b)
                // checks if a is negative
                var top = stack.pop();
                if (top === "-u") {
                    queue.push(top);
                } else {
                    stack.push(top);
                }
            } else {
                // handle error here
            }

        }
    }

    // take out remaining operators off stack and add to queue
    while (stack.length !== 0) {
        queue.push(stack.pop());
    }

    // dislpay the result
    var result = doMath(queue);
    $("input").val(result);
};

$(document).ready(function () {

    // when form is submitted.... get input
    // call functions and display data
    $("#frm1").on("submit", function (e) {
        e.preventDefault();
        var input = $("input").val();

        solve(input);
    });
    $("button").on("click", function () {
        var clicked = this.id;
        $("input").val($("input").val() + clicked);

    });


});