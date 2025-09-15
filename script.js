        document.addEventListener('DOMContentLoaded', function() {
            const display = document.querySelector('.current-operand');
            const previousDisplay = document.querySelector('.previous-operand');
            const buttons = document.querySelectorAll('button');
            let currentOperand = '0';
            let previousOperand = '';
            let operation = undefined;
            let resetScreen = false;

            // Update display
            function updateDisplay() {
                display.textContent = currentOperand;
                if (operation != null) {
                    previousDisplay.textContent = `${previousOperand} ${getOperationSymbol(operation)}`;
                } else {
                    previousDisplay.textContent = previousOperand;
                }
            }

            function getOperationSymbol(op) {
                switch(op) {
                    case '+': return '+';
                    case '-': return '-';
                    case '×': return '×';
                    case '÷': return '÷';
                    case '%': return '%';
                    default: return '';
                }
            }

            // Add digit to current operand
            function appendNumber(number) {
                if (currentOperand === '0' || resetScreen) {
                    currentOperand = number;
                    resetScreen = false;
                } else {
                    currentOperand += number;
                }
                
                // Limit length to prevent overflow
                if (currentOperand.length > 12) {
                    currentOperand = currentOperand.slice(0, 12);
                }
            }

            // Add decimal point
            function addDecimal() {
                if (resetScreen) {
                    currentOperand = '0.';
                    resetScreen = false;
                    return;
                }
                
                if (!currentOperand.includes('.')) {
                    currentOperand += '.';
                }
            }

            // Handle operations
            function chooseOperation(op) {
                if (currentOperand === '') return;
                
                if (previousOperand !== '') {
                    calculate();
                }
                
                operation = op;
                previousOperand = currentOperand;
                resetScreen = true;
            }

            // Perform calculation
            function calculate() {
                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            computation = 'Error';
                        } else {
                            computation = prev / current;
                        }
                        break;
                    case '%':
                        computation = prev % current;
                        break;
                    default:
                        return;
                }
                
                // Format the result to avoid very long numbers
                currentOperand = computation.toString();
                if (currentOperand.length > 12) {
                    currentOperand = parseFloat(currentOperand).toExponential(5);
                }
                
                operation = undefined;
                previousOperand = '';
                resetScreen = true;
            }

            // Clear the calculator
            function clear() {
                currentOperand = '0';
                previousOperand = '';
                operation = undefined;
            }

            // Delete the last digit
            function deleteDigit() {
                if (currentOperand.length === 1) {
                    currentOperand = '0';
                } else {
                    currentOperand = currentOperand.slice(0, -1);
                }
            }

            // Handle button clicks
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    if (button.classList.contains('operator')) {
                        chooseOperation(button.textContent);
                    } else if (button.classList.contains('equals')) {
                        calculate();
                    } else if (button.classList.contains('clear')) {
                        clear();
                    } else if (button.classList.contains('delete')) {
                        deleteDigit();
                    } else if (button.textContent === '.') {
                        addDecimal();
                    } else {
                        appendNumber(button.textContent);
                    }
                    
                    updateDisplay();
                });
            });

            // Initialize display
            updateDisplay();
        });
