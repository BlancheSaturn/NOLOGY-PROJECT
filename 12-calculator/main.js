/* ***************************************************************
 * created a calculator object to hold everything that is required to construct a valid expression
 * I need to track some things in other to complete a valid arithmetic expression.
 *****************************************************************/
const calculator = {
  showValue: "0", // this holds the string value (what user inputted or the result of a completed calculation). Tracks what is showns on screen
  previousOperand: null, // this holds the result of the previous operation in the calculator
  checkingForCurrentOperand: false, // checks if both the previous operation and the operator are inputted, if true the next numbers inputted will be the current operand
  operator: null, // stores the operator for an expression.
};

/*****************************************************
 * Created this function updateScren for the content of the showValue property
 * which is one of the property in the calculator object to be shown on screen.
 * Anytime a calculation is done we call this function to show the content of the showValue property
 ******************************************************/

/****************************************************************
 * Updating my updateScreen so when the calculator produce an invalid value
 * there will be an alert message instead of Infinity or Not a number shown on calculator and it will also reset the calculator.
 * The Number.isFinite method identifies whether the value is a finite (countable) number.
 * If it's not, an alert below is seen.
 ******************************************************************/
const updateScreen = () => {
  const displayScreen = document.querySelector(".calculator-result");
  const showValue = parseFloat(calculator.showValue);
  if (!Number.isFinite(showValue)) {
    alert("Out of scope calculation");
    clearCalculator();
    return;
  }
  displayScreen.value = calculator.showValue;
};
updateScreen();
/*****************************************************************
 * created this function so I can listen for clicks on
 * the calculator keys and determine what type of key was clicked.
 * We have these set of buttons on the calculator (calculator__operator, calculator__percent,
 * calculator__plus-minus,calculator__square-root,calcultor__digit, calculator__decimal,calculator__all-clear, equal-sign)
 * Check if the clicked element is a button.
 * If not, exit from the function
 * the querySelector() returns the first element that matches a CSS selector
 *****************************************************************/

const keys = document.querySelector(".calculator__buttons");
keys.addEventListener("click", (event) => {
  const target = event.target; // accessing the clicked element
  if (!target.matches("button")) {
    // Looking to see  if the clicked element is a button. If it not a button, exit from the function
    return;
  }
  if (event.target.classList.contains("operator")) {
    //  Using classList.contains to returns true if the calculator click contains the button we're listening for, otherwise false
    controlOperator(target.value);
    updateScreen();
    return;
  } else if (event.target.classList.contains("calculator__percent")) {
    controlSpecialOperator(target.value);
    updateScreen();
    return;
  } else if (event.target.classList.contains("calculator__plus-minus")) {
    controlSpecialOperator(target.value);
    updateScreen();
    return;
  } else if (event.target.classList.contains("calculator__square-root")) {
    controlSpecialOperator(target.value);
    updateScreen();
    return;
  } else if (event.target.classList.contains("calculator__decimal")) {
    insertDecimal(target.value);
    updateScreen();
    return;
  } else if (event.target.classList.contains("calculator__all-clear")) {
    clearCalculator(target.value);
    updateScreen();
    return;
  } else clickDigit(target.value);
  updateScreen();
});

/*******************************************************************
 * When the decimal point key is clicked on the calculator, I have to add a decimal point to whatever is
 * shown on the screen except if it already has a decimal point.
 * In insertDecimal function, I used the includes() method  to check if shownValue
 * has a decimal point. If true, a decimal is added to the number.
 *******************************************************************/

const insertDecimal = (decimal) => {
  const addDecimal = document.getElementById("calculator__decimal");
  if (calculator.checkingForCurrentOperand === true) {
    // After inputting the firstOperand, operator and checkingForCurrentOperand is true, then click a decimal.
    calculator.showValue = "0."; //showValue will show 0., which means the decimal is appended to the currentOperand
    calculator.checkingForCurrentOperand = false;
    return;
  }
  if (!calculator.showValue.includes(decimal)) {
    // checking to see if the `showValue` property of the calulator object does not contain a decimal point
    calculator.showValue += decimal; // Add the decimal point
  }
};
/****************************************************************
This function is to reset the calculator to it original state by clicking AC. 
*****************************************************************/
const clearCalculator = () => {
  const clearAll = document.getElementsByClassName("calculator__all-clear");
  calculator.showValue = "0";
  calculator.previousOperand = null;
  calculator.checkingForCurrentOperand = false;
  calculator.operator = null;
};

/****************************************************************
The showValue property of the calculator object represents the input of the user.
Creating this function clickDigit to make the digit (numbers) buttons work so that when I click on them,
the value of the clicked button is shown on the screen.

checkingForSecondOperand property is set to true, the showValue property
 is replace with the number that was clicked. Else it will 
 replace or add to showValue as appropriate.
 *****************************************************************/

const clickDigit = (digit) => {
  const { showValue, checkingForCurrentOperand } = calculator;
  if (checkingForCurrentOperand === true) {
    calculator.showValue = digit;
    calculator.checkingForCurrentOperand = false;
  } else {
    calculator.showValue = showValue === "0" ? digit : showValue + digit; // Replace`showValue` with clicked number if the current value is '0' otherwise add to it through string concatenation// (?) is used to check if the current value shown on the calculator is zero.// When true, calculator.showValue is overwritten with whatever digit was clicked.
  }
  console.log(calculator);
};

/**********************************************************************************************************
*This function controlOperator is to get the operators (+, −, ⨉, ÷, =) on the calculator to work. 
Operator button is clicked, the input of showValue is converted to a floating-point number 
and the result is stored in the previousOperand property.

The operator property is also set to whatever operator key was clicked, while 
checkingForSecondOperand is set to true which shows that the previous operand has been entered 
and whatever number the user enters next will be the current operand.
***********************************************************************************************************
*/

const controlOperator = (nextOperator) => {
  const { previousOperand, showValue, operator } = calculator;
  const currentInputValue = parseFloat(showValue);
  if (operator && calculator.checkingForCurrentOperand) {
    calculator.operator = nextOperator;
    return;
  }
  console.log(calculator);

  if (!previousOperand && !isNaN(currentInputValue)) {
    // confirm that previousOperand is null and that the currentInputValue.  // is not a NaN value (NaN: NotaNumber)
    calculator.previousOperand = currentInputValue; // Update the previousOperand property
  } else if (operator) {
    // checks if the operator property has been assigned an operator. // If yes, the calculateResult function is called  and the sum is saved in the calculation variable.
    const calculation = calculateResult(
      previousOperand,
      currentInputValue,
      operator
    );
    calculator.showValue = `${parseFloat(calculation.toFixed(9))}`;
    calculator.previousOperand = calculation; // The value of previousOperand is updated to the result so that it may be used in the next calculation.
  }
  calculator.checkingForCurrentOperand = true;
  calculator.operator = nextOperator;
};

/********************************************************************
calculateResult function takes the previous operand, current operand and operator as arguments and checks 
the value of the operator to determine how the expression should be assessed. 
If the operator is =, the current operand will be returned as is.
*******************************************************************/
const calculateResult = (previousOperand, currentOperand, operator) => {
  if (operator === "+") {
    return previousOperand + currentOperand;
  } else if (operator === "-") {
    return previousOperand - currentOperand;
  } else if (operator === "*") {
    return previousOperand * currentOperand;
  } else if (operator === "/") {
    return previousOperand / currentOperand;
  }
  return currentOperand;
};

/*************************************************************************
 * This function to get my special operators to work using switch statement
 * When the parameter 'specialSign' is % the signResult variable is assigned
 * to the calculation for percentage (/100) etc
 * The signResult is show at 5 decimal places
 * If checkingForCurrentOperand is true, it is set to
 * false so that the result of the function may be used as the current operand.
 ****************************************************************************/
const controlSpecialOperator = (specialOperator) => {
  const { showValue, checkingForCurrentOperand } = calculator;
  const currentInput = parseFloat(showValue);
  let signResult;

  switch (specialOperator) {
    case "%":
      signResult = currentInput / 100;
      break;
    case "+/-":
      signResult = currentInput * -1;
      break;
    case "√x":
      signResult = Math.sqrt(currentInput);
      break;
    default:
      signResult = 0;
  }
  calculator.showValue = `${parseFloat(signResult.toFixed(9))}`;

  if (checkingForCurrentOperand) {
    calculator.checkingForCurrentOperand = false;
  }
};
