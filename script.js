const expressionInput = document.getElementById('expressionInput');
const historyList = document.getElementById('historyList');
const clearBtn = document.getElementById('clearBtn');
const equalsBtn = document.getElementById('equalsBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

let currentExpression = '';

function updateDisplay() {
    expressionInput.value = currentExpression || '0';
}

function addToExpression(value) {
    if (currentExpression === '' && (value === '*' || value === '/' || value === '+' || value === '.')) {
        return;
    }
    
    const lastChar = currentExpression[currentExpression.length - 1];
    const operators = ['+', '-', '*', '/'];
    
    if (operators.includes(lastChar) && operators.includes(value)) {
        currentExpression = currentExpression.slice(0, -1) + value;
    } else {
        currentExpression += value;
    }
    
    updateDisplay();
}

function clearExpression() {
    currentExpression = '';
    updateDisplay();
}

function addToHistory(expression, result) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    historyItem.innerHTML = `${expression} = ${result}`;
    
    historyList.appendChild(historyItem);
    
    const emptyMessage = historyList.querySelector('.history-empty');
    if (emptyMessage) {
        emptyMessage.remove();
    }
    
    historyItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateExpression(expression) {
    if (expression === '' || expression === null) {
        return null;
    }
    
    try {
        let calcExpression = expression;
        const result = Function('"use strict";return (' + calcExpression + ')')();
        
        if (!isFinite(result)) {
            if (result === Infinity) return 'Ошибка: деление на 0';
            if (isNaN(result)) return 'Ошибка: неверное выражение';
            return 'Ошибка';
        }
        
        return Math.round(result * 10000000000) / 10000000000;
    } catch (error) {
        console.error('Ошибка вычисления:', error);
        return null;
    }
}

function handleEquals() {
    // Проверяем, есть ли выражение
    if (currentExpression === '') {
        return;
    }
    
    const lastChar = currentExpression[currentExpression.length - 1];
    if (['+', '-', '*', '/'].includes(lastChar)) {
        alert('Некорректное выражение: не может заканчиваться оператором');
        return;
    }
    
    const result = calculateExpression(currentExpression);
    
    if (result !== null && result !== 'Ошибка: деление на 0' && result !== 'Ошибка: неверное выражение') {
        const expressionToSave = currentExpression;
        
        addToHistory(expressionToSave, result);
        
        currentExpression = String(result);
        updateDisplay();
    } else if (result === 'Ошибка: деление на 0') {
        alert('Ошибка: деление на ноль!');
        clearExpression();
    } else if (result === null) {
        alert('Ошибка: неверный формат выражения');
        clearExpression();
    } else {
        alert(result);
        clearExpression();
    }
}

function clearHistory() {
    historyList.innerHTML = '';
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'history-empty';
    emptyMessage.textContent = 'История пуста';
    historyList.appendChild(emptyMessage);
}

function setupEventListeners() {
    const numberButtons = document.querySelectorAll('.btn-number');
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            if (value) {
                addToExpression(value);
            }
        });
    });
    
    const operatorButtons = document.querySelectorAll('.btn-operator');
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const op = button.getAttribute('data-op');
            if (op) {
                addToExpression(op);
            }
        });
    });
    
    equalsBtn.addEventListener('click', handleEquals);
    
    clearBtn.addEventListener('click', clearExpression);
    
    clearHistoryBtn.addEventListener('click', clearHistory);
}

function handleKeyboardInput(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        event.preventDefault();
        addToExpression(key);
    }
    // Точка
    else if (key === '.') {
        event.preventDefault();
        addToExpression('.');
    }
    else if (key === '+') {
        event.preventDefault();
        addToExpression('+');
    }
    else if (key === '-') {
        event.preventDefault();
        addToExpression('-');
    }
    else if (key === '*') {
        event.preventDefault();
        addToExpression('*');
    }
    else if (key === '/') {
        event.preventDefault();
        addToExpression('/');
    }
    else if (key === 'Enter') {
        event.preventDefault();
        handleEquals();
    }
    else if (key === 'Escape') {
        event.preventDefault();
        clearExpression();
    }
    else if (key === 'Backspace') {
        event.preventDefault();
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }
}

function init() {
    setupEventListeners();
    document.addEventListener('keydown', handleKeyboardInput);
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', init);
