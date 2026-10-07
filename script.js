document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const mainDisplay = document.getElementById("main-display");
    const historyDisplay = document.getElementById("history-display");

    // State Variables
    let currentInput = "0";
    let previousInput = "";
    let operator = null;
    let shouldResetDisplay = false;

    // Update Display UI
    function updateDisplay() {
        mainDisplay.textContent = currentInput;
        if (operator !== null) {
            historyDisplay.textContent = `${previousInput} ${operator}`;
        } else {
            historyDisplay.textContent = "";
        }
    }

    // Append Number / Decimal
    function appendNumber(number) {
        if (currentInput === "0" || shouldResetDisplay) {
            currentInput = number === "." ? "0." : number;
            shouldResetDisplay = false;
        } else {
            if (number === "." && currentInput.includes(".")) return;
            currentInput += number;
        }
        updateDisplay();
    }

    // Choose Operator
    function chooseOperator(op) {
        if (operator !== null && !shouldResetDisplay) {
            calculate();
        }
        previousInput = currentInput;
        operator = op;
        shouldResetDisplay = true;
        updateDisplay();
    }

    // Execute Scientific Functions
    function handleScientific(func) {
        let num = parseFloat(currentInput);
        let result;

        switch (func) {
            case "sin":
                result = Math.sin(num * (Math.PI / 180)); // Degrees
                historyDisplay.textContent = `sin(${currentInput}°)`;
                break;
            case "cos":
                result = Math.cos(num * (Math.PI / 180)); // Degrees
                historyDisplay.textContent = `cos(${currentInput}°)`;
                break;
            case "tan":
                result = Math.tan(num * (Math.PI / 180)); // Degrees
                historyDisplay.textContent = `tan(${currentInput}°)`;
                break;
            case "sqrt":
                if (num < 0) {
                    alert("Invalid Input for Square Root");
                    return;
                }
                result = Math.sqrt(num);
                historyDisplay.textContent = `√(${currentInput})`;
                break;
            case "square":
                result = Math.pow(num, 2);
                historyDisplay.textContent = `(${currentInput})²`;
                break;
            case "log":
                if (num <= 0) {
                    alert("Invalid Input for Logarithm");
                    return;
                }
                result = Math.log10(num);
                historyDisplay.textContent = `log(${currentInput})`;
                break;
            case "ln":
                if (num <= 0) {
                    alert("Invalid Input for Natural Log");
                    return;
                }
                result = Math.log(num);
                historyDisplay.textContent = `ln(${currentInput})`;
                break;
            case "pow":
                chooseOperator("^");
                return;
            case "pi":
                result = Math.PI;
                historyDisplay.textContent = "π";
                break;
            case "e":
                result = Math.E;
                historyDisplay.textContent = "e";
                break;
            default:
                return;
        }

        result = Math.round(result * 100000000) / 100000000;
        currentInput = result.toString();
        shouldResetDisplay = true;
        mainDisplay.textContent = currentInput;
    }

    // Standard Calculation
    function calculate() {
        if (operator === null || shouldResetDisplay) return;

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case "+":
                result = prev + current;
                break;
            case "-":
                result = prev - current;
                break;
            case "×":
                result = prev * current;
                break;
            case "÷":
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clearAll();
                    return;
                }
                result = prev / current;
                break;
            case "^":
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }

        result = Math.round(result * 100000000) / 100000000;
        historyDisplay.textContent = `${previousInput} ${operator} ${currentInput} =`;
        currentInput = result.toString();
        operator = null;
        shouldResetDisplay = true;
        mainDisplay.textContent = currentInput;
    }

    // Clear All
    function clearAll() {
        currentInput = "0";
        previousInput = "";
        operator = null;
        shouldResetDisplay = false;
        updateDisplay();
    }

    // Delete Last Digit
    function deleteDigit() {
        if (shouldResetDisplay) return;
        if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
            currentInput = "0";
        } else {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay();
    }

    // Percentage
    function percentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
        updateDisplay();
    }

    // Event Delegation for Button Clicks
    document.querySelector(".grid").addEventListener("click", (e) => {
        const target = e.target.closest("button");
        if (!target) return;

        const number = target.dataset.number;
        const op = target.dataset.operator;
        const func = target.dataset.func;
        const action = target.dataset.action;

        if (number !== undefined) appendNumber(number);
        if (op !== undefined) chooseOperator(op);
        if (func !== undefined) handleScientific(func);
        if (action === "clear") clearAll();
        if (action === "delete") deleteDigit();
        if (action === "percent") percentage();
        if (action === "equals") calculate();
    });

    // Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
        if ((e.key >= "0" && e.key <= "9") || e.key === ".") appendNumber(e.key);
        if (e.key === "+") chooseOperator("+");
        if (e.key === "-") chooseOperator("-");
        if (e.key === "*") chooseOperator("×");
        if (e.key === "/") chooseOperator("÷");
        if (e.key === "^") chooseOperator("^");
        if (e.key === "Enter" || e.key === "=") {
            e.preventDefault();
            calculate();
        }
        if (e.key === "Backspace") deleteDigit();
        if (e.key === "Escape") clearAll();
    });
});