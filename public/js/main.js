import { quizzes } from "/js/quiz.js";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function compareArrays(arr1, arr2) {
  let isEqual = true;

  if (arr1.length === arr2.length) {
    for (let index = 0; index < arr1.length; index++) {
      if (arr1[index] !== arr2[index]) {
        isEqual = false;
      }
    }
  } else {
    isEqual = false;
  }

  return isEqual;
}

function determineDragAndDropResult(referenceArray) {
  const rightZone = document.querySelector(".right-zone");

  // Array to store results
  const result = [];

  // Iterate over all elements with the "description-zone" class inside "right-zone"
  const descriptionZones = rightZone.querySelectorAll(".description-zone");
  descriptionZones.forEach((zone) => {
    // Get the description from the data-description attribute
    const description = zone.getAttribute("data-description");

    // Find the draggable item inside the description-zone
    const draggableItem = zone.querySelector(".draggable-item");

    if (draggableItem) {
      // Get the value of the "data-property" attribute
      const property = draggableItem.getAttribute("data-property");

      // Add an object to the results array
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
  const shuffledQuizzes = shuffleArray(quizzes);
  const quizContainer = document.getElementById("quizContainer");
  const quiz = document.createElement("form");
  const submitButton = document.createElement("button");
  let result = 0;

  console.log(shuffledQuizzes);
  quiz.id = "quiz";
  quizContainer.innerHTML = "";
  for (let index = 0; index < shuffledQuizzes.length; index++) {
    const element = shuffledQuizzes[index];
    const form = element.createQuiz();
    quiz.appendChild(form);
  }

  submitButton.type = "submit";
  submitButton.textContent = "Submit";
  submitButton.className = "sendAnswer";
  quiz.appendChild(submitButton);
  quizContainer.appendChild(quiz);

  quiz.addEventListener("submit", function (event) {
    event.preventDefault();
    const allForms = Array.from(document.getElementsByClassName("quizForm")); // Find all quiz forms
    const userAnswers = [];
    let score;

    console.log(allForms);
    allForms.forEach((form, index) => {
      const formData = new FormData(form);

      console.log(shuffledQuizzes[index].question);
      switch (shuffledQuizzes[index].type) {
        case "radio":
          score = shuffledQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("radio: " + score);
          break;
        case "dropdown":
          score = shuffledQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("dropdown: " + score);
          break;
        case "true/false":
          score = shuffledQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("true/false: " + score);
          break;
        case "rating":
          score = shuffledQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("rating: " + score);
          break;
        case "checkbox":
          score = compareArrays(shuffledQuizzes[index].correctAnswer, formData.getAll("quiz"));
          console.log("checkbox: " + formData.getAll("quiz"));
          break;
        case "text":
          score = shuffledQuizzes[index].correctAnswer == formData.get("quiz") ? 1 : 0;
          console.log("text: " + score);
          break;
        case "drag-and-drop":
          score = determineDragAndDropResult(shuffledQuizzes[index].options);
          console.log(score);
          break;
        default:
          questionAnswer.answer = "Unsupported question type";
      }
      result += score;
    });

    console.log("User result:", result); // Check results in console
    quizContainer.style.display = 'none';

    // Display results
    const resultContainer = document.getElementById("result");
    resultContainer.style.display = 'block';

    // Create a block to display name, group, and result
    const resultBlock = document.createElement("div");
    resultBlock.className = "result-block";

    const nameBlock = document.createElement("p");
    nameBlock.textContent = `Name: ${name}`;

    const groupBlock = document.createElement("p");
    groupBlock.textContent = `Group: ${group}`;

    const resultBlockText = document.createElement("p");
    resultBlockText.textContent = `Result: ${result} out of ${shuffledQuizzes.length}`;

    // Add elements to the result block
    resultBlock.appendChild(nameBlock);
    resultBlock.appendChild(groupBlock);
    resultBlock.appendChild(resultBlockText);

    // Add the block to the result container
    resultContainer.innerHTML = ""; // Clear previous content
    resultContainer.appendChild(resultBlock);
  });
}
