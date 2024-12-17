import { quizzes } from "/js/quiz.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Випадковий індекс від 0 до i
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function copmpare_array(arr1, arr2) {
  let ind = true;

  if (arr1.length == arr2.length) {
    for (let index = 0; index < arr1.length; index++) {
      if(arr1[index] != arr2[index]){
        ind = false; 
      }
    }
  }
  else{
    ind = false
  }

  return ind;
}

function determine_drag_and_drop_result(referenceArray) {
  const rightZone = document.querySelector(".right-zone");

  // Масив для зберігання результатів
  const result = [];

  // Перебираємо всі елементи з класом "description-zone" у "right-zone"
  const descriptionZones = rightZone.querySelectorAll(".description-zone");
  descriptionZones.forEach((zone) => {
    // Отримуємо опис з атрибута data-description
    const description = zone.getAttribute("data-description");

    // Знаходимо draggable-item всередині description-zone
    const draggableItem = zone.querySelector(".draggable-item");

    if (draggableItem) {
      // Отримуємо значення властивості "data-property"
      const property = draggableItem.getAttribute("data-property");

      // Додаємо об'єкт до масиву результатів
      result.push({ property, description });
    }
  });

  console.log(result);

  const arraysMatch = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item1) =>
      arr2.some(
        (item2) =>
          item1.property === item2.property &&
          item1.description === item2.description
      )
    );
  };

  return arraysMatch(result, referenceArray);
}

export function startQuiz(name, group) {
  const sortQuizzes = shuffleArray(quizzes);
  const quizContainer = document.getElementById("quizContainer");
  const quiz = document.createElement("form");
  const submitButton = document.createElement("button");
  let result = 0;

  console.log(sortQuizzes);
  quiz.id = "quiz";
  quizContainer.innerHTML = "";
  for (let index = 0; index < sortQuizzes.length; index++) {
    const element = sortQuizzes[index];
    const form = element.createQuiz();
    quiz.appendChild(form);
  }

  submitButton.type = "submit";
  submitButton.textContent = "Надіслати";
  submitButton.className = "sendAnswer";
  quiz.appendChild(submitButton);
  quizContainer.appendChild(quiz);

  quiz.addEventListener("submit", function (event) {
    event.preventDefault();
    const allForms = Array.from(document.getElementsByClassName("quizForm")); // Знаходимо всі форми
    const userAnswers = [];
    let ind;

    console.log(allForms);
    allForms.forEach((form, index) => {
      const formData = new FormData(form);

      console.log(sortQuizzes[index].question);
      switch (sortQuizzes[index].type) {
        case "radio":
          ind = sortQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("radio: " + ind);
          break;
        case "dropdown":
          ind = sortQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("dropdown: " + ind);
          break;
        case "true/false":
          ind = sortQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("true/false: " + ind);
          break;
        case "rating":
          ind = sortQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("rating: " + ind);
          break;
        case "checkbox":
          ind = copmpare_array(sortQuizzes[index].correctAnswer, formData.getAll("quiz"));
          console.log("checkbox: " + formData.getAll("quiz"));
          break;
        case "text":
          ind = sortQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("text: " + ind);
          break;
        case "drag-and-drop":
          ind = determine_drag_and_drop_result(sortQuizzes[index].options);
          console.log(ind);
          break;
        default:
          questionAnswer.answer = "Unsupported question type";
      }
      result += ind;
    });

    console.log("User result:", result); // Для перевірки результатів у консолі
    quizContainer.style.display = 'none';

    // Відображення результатів
    const resultContainer = document.getElementById("result");
    resultContainer.style.display = 'block';

    // Створення блоку для відображення імені, групи та результату
    const resultBlock = document.createElement("div");
    resultBlock.className = "result-block";

    const nameBlock = document.createElement("p");
    nameBlock.textContent = `Ім'я: ${name}`;

    const groupBlock = document.createElement("p");
    groupBlock.textContent = `Група: ${group}`;

    const resultBlockText = document.createElement("p");
    resultBlockText.textContent = `Результат: ${result} з ${sortQuizzes.length}`;

    // Додаємо елементи до блоку результатів
    resultBlock.appendChild(nameBlock);
    resultBlock.appendChild(groupBlock);
    resultBlock.appendChild(resultBlockText);

    // Додаємо блок до контейнера результатів
    resultContainer.innerHTML = ""; // Очистка попереднього вмісту
    resultContainer.appendChild(resultBlock);
  });
}