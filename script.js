// Elemente der Anzeige
const expressionEl = document.getElementById("expression");
const currentEl = document.getElementById("current");

// Zustand des Taschenrechners
let current = "0";       // Zahl, die gerade eingegeben wird
let previous = null;     // erste Zahl
let operator = null;     // gewählte Rechenart (+, -, *, /)
let resetNext = false;   // nach "=" oder einer Rechenart neue Zahl beginnen

// Symbole der Rechenarten für die Anzeige
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// Anzeige aktualisieren
function updateDisplay() {
    currentEl.textContent = current.replace(".", ",");
    if (operator !== null) {
        expressionEl.textContent = String(previous).replace(".", ",") + " " + symbols[operator];
    } else {
        expressionEl.textContent = "";
    }
}

// Ziffer eingeben
function inputNumber(digit) {
    if (current === "Fehler" || resetNext) {
        current = digit;
        resetNext = false;
    } else if (current === "0") {
        current = digit;
    } else if (current.length < 15) {
        current += digit;
    }
}

// Komma eingeben
function inputDecimal() {
    if (current === "Fehler" || resetNext) {
        current = "0.";
        resetNext = false;
    } else if (!current.includes(".")) {
        current += ".";
    }
}

// Ergebnis aus zwei Zahlen berechnen
function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? null : a / b;
    }
}

// Runden, damit nicht 0.1 + 0.2 = 0.30000000000000004 herauskommt
function formatResult(number) {
    return String(parseFloat(number.toFixed(10)));
}

// Rechenart wählen
function chooseOperator(op) {
    if (current === "Fehler") return;

    // Wenn schon eine Rechenart gewählt ist, zuerst diese berechnen (z. B. 2 + 3 + ...)
    if (operator !== null && !resetNext) {
        equals();
        if (current === "Fehler") return;
    }

    previous = parseFloat(current);
    operator = op;
    resetNext = true;
}

// Taste "="
function equals() {
    if (operator === null) return;

    const result = calculate(previous, parseFloat(current), operator);
    current = result === null ? "Fehler" : formatResult(result);

    previous = null;
    operator = null;
    resetNext = true;
}

// Taste "C"
function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
}

// Taste "⌫" – letzte Ziffer löschen
function deleteLast() {
    if (current === "Fehler" || resetNext) {
        current = "0";
        resetNext = false;
    } else if (current.length > 1) {
        current = current.slice(0, -1);
    } else {
        current = "0";
    }
}

// Taste "%" – Zahl durch 100 teilen
function percent() {
    if (current === "Fehler") return;
    current = formatResult(parseFloat(current) / 100);
}

// Klicks auf die Tasten verarbeiten
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
        const { number, operator: op, action } = button.dataset;

        if (number !== undefined) inputNumber(number);
        else if (op !== undefined) chooseOperator(op);
        else if (action === "decimal") inputDecimal();
        else if (action === "equals") equals();
        else if (action === "clear") clearAll();
        else if (action === "delete") deleteLast();
        else if (action === "percent") percent();

        updateDisplay();
    });
});

// Bedienung mit der Tastatur
document.addEventListener("keydown", event => {
    const key = event.key;

    if (key >= "0" && key <= "9") inputNumber(key);
    else if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
    else if (key === "." || key === ",") inputDecimal();
    else if (key === "Enter" || key === "=") { event.preventDefault(); equals(); }
    else if (key === "Backspace") deleteLast();
    else if (key === "Escape") clearAll();
    else if (key === "%") percent();
    else return;

    updateDisplay();
});

updateDisplay();
