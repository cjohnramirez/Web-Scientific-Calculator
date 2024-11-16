const bigNumberDisplay = document.getElementById("big-number-display");
const smallNumberDisplay = document.getElementById("small-number-display");
const equalButton = document.getElementById("equals-button");
const deleteButton = document.getElementById("delete-button");
const minusButton = document.getElementById("minus-button");
const dotButton = document.getElementById("dot-button");

//if expression is undefined and AC is clicked, then enable operators and numbers
document.getElementById("all-clear-button").addEventListener("click", function() {
    if (disabledOperatorsForUndefined) {
        enableOperators();
        enableNumbers();
    }
})

//include flags for constraints
let expression = "";
let answer = "";
let historyExpression = [];
let answerExpression = [];
let operators = ['+', 'x', '/', '*', '-'];
let oneDot = false;
let isModeClicked = false;
let disabledOperatorsForUndefined = false;
let firstParam = true;
let isParenthesisClosed = false;
let lastParenthesis = [];

defaultState();

//Status: Basic Arithmetic Finished
function defaultState() {
    disableOperators();
    disableScientificOperators();
    deleteButton.disabled = false;

    //disables equal and minus for default states
    equalButton.disabled = expression.length === 0; 
    minusButton.disabled = expression.length !== 0; 
}

function disableOperators() {
    document.querySelectorAll(".operator").forEach(button => {
        button.disabled = true;
    });
}

function enableOperators() {
    document.querySelectorAll(".operator").forEach(button => {
        button.disabled = false;
    });
}

function disableNumbers() {
    document.querySelectorAll(".number").forEach(button => {
        button.disabled = true;
    });
}

function enableNumbers() {
    document.querySelectorAll(".number").forEach(button => {
        button.disabled = false;
    });
}

function disableScientificOperators() {
    document.querySelectorAll(".calculator-scientific-buttons button").forEach((button) => {
        button.disabled = true;
    });
}

function enableScientificOperators() {
    document.querySelectorAll(".calculator-scientific-buttons button").forEach((button) => {
        button.disabled = false;
    });
}

const lastChar = expression => expression.charAt(expression.length - 1);

const lastCharInclusion = expression => operators.includes(lastChar(expression));

const evaluateExpression = (expression) => {
    //due to constraints, the eval() function is safe
    answer = eval(expression);

    //truncation
    if (answer.toString().includes('e')){
        answer = answer.toPrecision(8); 
    } else {
        answer = Math.floor(answer * 100**4) / 100**4;
    }
    
    return answer;
}

const addSymbolToExpression = (symbol) => {
    equalButton.disabled = expression.length - 1 === 0; 
    expression += symbol;
    console.log(expression);

    disableMultipleOperators();

    bigNumberDisplay.innerHTML = `<p class="big-number-output">${expression}</p>`;
    bigNumberDisplay.innerHTML += `<p class="big-number-suggestion">${lastParenthesis.join("")}</p>`;
}

//disables multiple adjacent operators, alongside dot
const disableMultipleOperators = () => {
    if (lastCharInclusion(expression)){
        disableOperators();
        dotButton.disabled = false;
        oneDot = false;
    } else {
        enableOperators();
        if (lastChar(expression) === '.'){
            dotButton.disabled = true;
            oneDot = true;
        } else {
            dotButton.disabled = oneDot;
        }
    } 
}

const equalsButton = () => {
    if (lastCharInclusion(expression)){
        expression = expression.substring(0, expression.length - 1);
    } 

    //evaluates divide by zero
    if (evaluateExpression(expression) === Infinity){
        disableOperators();
        disableNumbers();
        expression = "undefined";
        equalButton.disabled = true; 
        deleteButton.disabled = true;
        smallNumberDisplay.innerHTML = "";
        disabledOperatorsForUndefined = true;
    } else {
        historyExpression.push(expression);
        expression = evaluateExpression(expression);
        answerExpression.push(evaluateExpression(expression));
        smallNumberDisplay.innerHTML = `<p class="small-number-output">${historyExpression[historyExpression.length - 1]}</p>`;
    }

    //for diagnosis
    console.log(historyExpression);
    console.log(answerExpression);

    bigNumberDisplay.innerHTML = `<p class="big-number-output">${expression}</p>`;
    
}

const allClear = () => {
    bigNumberDisplay.innerHTML = "";
    smallNumberDisplay.innerHTML = " ";
    expression = "";
}

const deleteCharacters = () => {
    expression =  String(expression);
    const secondToLast = expression[expression.length - 2];

    //erases arithmetic operator to avoid last char as operator
    if (operators.includes(secondToLast)){
        expression = expression.slice(0, -1);
    } else if (expression.length === 1){
        smallNumberDisplay.innerHTML = "";
    }

    expression = expression.slice(0, -1);
    bigNumberDisplay.innerHTML = `<p class="big-number-output">${expression}</p>`;
}

//Status: Scientific Operations ongoing development
const addParenthesis = character => {
    //adds suggested parenthesis
    if (lastParenthesis.length === 0){
        firstParam = false;
    } 
    
    if (character === '(' && !firstParam){
        lastParenthesis.push(')');
        addSymbolToExpression('(');
    } else if (character === ')' && !firstParam) {
        if (lastParenthesis.length !== 0){
            firstParam = true;
            lastParenthesis.pop(); 
            addSymbolToExpression(')');
        }
    }

    console.log(firstParam);
}

//HARD: Ability to evaluate nested expressions 
const scientificOperatorsButton = (string) => {
    addSymbolToExpression(string);
    addParenthesis('(');
}