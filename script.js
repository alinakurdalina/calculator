// Получаем элементы DOM
const display = document.getElementById('display');
const historyDiv = document.getElementById('history');

// Функция для добавления значения в поле ввода
function appendToDisplay(value) {
    display.value += value;
}

// Функция для добавления записи в историю
function addToHistory(expression, result) {
    const newEntry = document.createElement('div');
    newEntry.textContent = `${expression} = ${result}`;
    historyDiv.appendChild(newEntry);
}

// Функция вычисления результата
function calculate() {
    try {
        const expression = display.value;
        const result = eval(expression); // Используем eval для вычисления выражения

        // Добавляем вычисление в историю
        addToHistory(expression, result);

        // Показываем результат в поле ввода
        display.value = result;
    } catch (error) {
        display.value = 'Ошибка';
        setTimeout(() => {
            display.value = '';
        }, 1500);
    }
}
