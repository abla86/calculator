const display = document.getElementById("display");
const previousOperation = document.getElementById("previous-operation");
const buttons = document.querySelectorAll("button");

let currentValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function inputNumber(number) {
  if (currentValue === "Error" || waitingForSecondOperand) {
    currentValue = number;
    waitingForSecondOperand = false;
  } else {
    currentValue = currentValue === "0" ? number : currentValue + number;
  }

  updateDisplay();
}

function inputDecimal() {
  if (currentValue === "Error" || waitingForSecondOperand) {
    currentValue = "0.";
    waitingForSecondOperand = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }

  updateDisplay();
}

function chooseOperator(nextOperator) {
  const inputValue = parseFloat(currentValue);

  if (Number.isNaN(inputValue)) {
    return;
  }

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    previousOperation.textContent =
      `${formatNumber(firstOperand)} ${operatorSymbol(operator)}`;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(firstOperand, inputValue, operator);

    if (result === "Error") {
      showError();
      return;
    }

    currentValue = formatNumber(result);
    firstOperand = result;
    updateDisplay();
  }

  operator = nextOperator;
  waitingForSecondOperand = true;

  previousOperation.textContent =
    `${formatNumber(firstOperand)} ${operatorSymbol(operator)}`;
}

function performCalculation(first, second, selectedOperator) {
  switch (selectedOperator) {
    case "+":
      return first + second;

    case "-":
      return first - second;

    case "*":
      return first * second;

    case "/":
      return second === 0 ? "Error" : first / second;

    case "%":
      return first % second;

    default:
      return second;
  }
}

function calculate() {
  if (operator === null || firstOperand === null || waitingForSecondOperand) {
    return;
  }

  const secondOperand = parseFloat(currentValue);
  const expression =
    `${formatNumber(firstOperand)} ${operatorSymbol(operator)} ${formatNumber(secondOperand)}`;

  const result = performCalculation(
    firstOperand,
    secondOperand,
    operator
  );

  if (result === "Error") {
    showError();
    return;
  }

  currentValue = formatNumber(result);
  previousOperation.textContent = `${expression} =`;

  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;

  updateDisplay();
}

function clearCalculator() {
  currentValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;

  previousOperation.textContent = "";

  updateDisplay();
}

function deleteLastCharacter() {
  if (currentValue === "Error") {
    clearCalculator();
    return;
  }

  if (waitingForSecondOperand) {
    return;
  }

  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = "0";
  }

  updateDisplay();
}

function showError() {
  currentValue = "Error";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = true;

  previousOperation.textContent = "Cannot divide by zero";

  updateDisplay();
}

function formatNumber(number) {
  if (typeof number === "string") {
    return number;
  }

  return Number.parseFloat(number.toFixed(10)).toString();
}

function operatorSymbol(value) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
    "%": "%"
  };

  return symbols[value];
}

function handleInput(value) {
  if (/^\d$/.test(value)) {
    inputNumber(value);
    return;
  }

  if (value === ".") {
    inputDecimal();
    return;
  }

  if (["+", "-", "*", "/", "%"].includes(value)) {
    chooseOperator(value);
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) {
      handleInput(value);
    }

    if (action === "clear") {
      clearCalculator();
    }

    if (action === "delete") {
      deleteLastCharacter();
    }

    if (action === "calculate") {
      calculate();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^\d$/.test(key) || ["+", "-", "*", "/", "%", "."].includes(key)) {
    event.preventDefault();
    handleInput(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    deleteLastCharacter();
    return;
  }

  if (key === "Escape") {
    event.preventDefault();
    clearCalculator();
  }
});

updateDisplay();