import { startQuiz } from '/js/main.js';

document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.getElementById('formContainer');
    const quizContainer = document.getElementById('quizContainer');
    const resultDiv = document.getElementById('result');

    const form = document.createElement('form');
    form.id = 'surveyForm';

    const fields = [
        { label: 'Ім\'я:', id: 'name', name: 'name', type: 'text' },
        { label: 'Група:', id: 'group', name: 'group', type: 'text' }
    ];

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;

        const input = document.createElement('input');
        input.type = field.type;
        input.id = field.id;
        input.name = field.name;
        input.required = true;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
    });

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Зберегти';
    form.appendChild(button);
    formContainer.appendChild(form);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const group = document.getElementById('group').value;

        formContainer.style.display = 'none';
        quizContainer.style.display = 'block';

        startQuiz(name, group);
    });
});
