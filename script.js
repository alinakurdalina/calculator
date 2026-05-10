const display = document.getElementById('display');
const historyDiv = document.getElementById('history');

function appendToDisplay(value) {
    display.value += value;
}

function addToHistory(expression, result) {
    const newEntry = document.createElement('div');
    newEntry.textContent = `${expression} = ${result}`;
    historyDiv.appendChild(newEntry);
}

function calculate() {
    try {
        const expression = display.value;
        const result = eval(expression);

        addToHistory(expression, result);

        display.value = result;
    } catch (error) {
        display.value = 'Ошибка';
        setTimeout(() => {
            display.value = '';
        }, 1500);
    }
}
