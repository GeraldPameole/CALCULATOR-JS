//Stocke l'état actuel du calculateur, y compris la valeur affichée (displayValue), le premier opérande (firstOperand), un booléen indiquant si le calculateur attend le second opérande (waitingForSecondOperand), et l'opérateur actuel (operator)
const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

//Gère l'entrée des chiffres. Si un second opérande est attendu, la fonction remplace la displayValue par le chiffre entré et réinitialise l'attente du second opérande. Sinon, elle ajoute le chiffre à la displayValue.
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
  }
}
//Ajoute un point décimal à la displayValue si aucun n'est présent, sauf si un second opérande est attendu, auquel cas elle commence une nouvelle displayValue avec "0.".
function inputDecimal(dot) {
  if (calculator.waitingForSecondOperand === true) {
    calculator.displayValue = "0."
    calculator.waitingForSecondOperand = false;
    return
  }

  if (!calculator.displayValue.includes(dot)) {
    calculator.displayValue += dot;
  }
}

//Traite les opérations. Si un opérateur est déjà en attente et que l'utilisateur en sélectionne un nouveau, l'opérateur est mis à jour sans effectuer de calcul. Sinon, si un calcul est possible, il est effectué et le résultat devient le premier opérande pour la prochaine opération.
function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }


  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);

    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

// Effectue le calcul entre deux opérandes en fonction de l'opérateur (+, -, *, /) et renvoie le résultat.
function calculate(firstOperand, secondOperand, operator) {
  if (operator === '+') {
    return firstOperand + secondOperand;
  } else if (operator === '-') {
    return firstOperand - secondOperand;
  } else if (operator === '*') {
    return firstOperand * secondOperand;
  } else if (operator === '/') {
    return firstOperand / secondOperand;
  }

  return secondOperand;
}

//Réinitialise l'état du calculateur à ses valeurs par défaut.
function resetCalculator() {
  calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}
//Met à jour l'écran du calculateur avec la displayValue actuelle.
function updateDisplay() {
  const display = document.querySelector('.calculator-screen');
  display.value = calculator.displayValue;
}

//Après avoir défini la logique, updateDisplay est appelée pour afficher l'état initial, et un écouteur d'événements est attaché à la div .calculator-keys. Cet écouteur gère les clics sur les boutons du calculateur, déclenchant les fonctions appropriées en fonction de la valeur du bouton pressé (chiffres, opérateurs, décimal, réinitialisation) et met à jour l'affichage après chaque action.
updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', event => {
  const { target } = event;
  const { value } = target;
  if (!target.matches('button')) {
    return;
  }

  switch (value) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '=':
      handleOperator(value);
      break;
    case '.':
      inputDecimal(value);
      break;
    case 'all-clear':
      resetCalculator();
      break;
    default:
      if (Number.isInteger(parseFloat(value))) {
        inputDigit(value);
      }
  }

  updateDisplay();
});