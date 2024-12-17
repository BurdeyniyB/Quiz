class Quiz {
  constructor(question, type, options, correctAnswer, extra = {}) {
    this.question = question;
    this.type = type;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

  createQuiz() {
    const form = document.createElement("form");
    form.className = "quizForm";

    // Add question text
    const questionElement = document.createElement("p");
    questionElement.textContent = this.question;
    form.appendChild(questionElement);

    // Generate input based on quiz type
    switch (this.type) {
      case "radio":
        this.options.forEach((option) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = "quiz";
          input.value = option;
          label.textContent = option;
          label.prepend(input);
          form.appendChild(label);
        });
        break;

      case "checkbox":
        this.options.forEach((option) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "checkbox";
          input.name = "quiz";
          input.value = option;
          label.textContent = option;
          label.prepend(input);
          form.appendChild(label);
        });
        break;

      case "dropdown":
        const select = document.createElement("select");
        select.name = "quiz";
        this.options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          select.appendChild(optionElement);
        });
        form.appendChild(select);
        break;

      case "drag-and-drop":
        this.createDragAndDropQuiz(form);
        break;

      case "text":
        const textInput = document.createElement("textarea");
        textInput.name = "quiz";
        form.appendChild(textInput);
        break;

      case "true/false":
        ["true", "false"].forEach((value) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = "quiz";
          input.value = value;
          label.textContent = value;
          label.prepend(input);
          form.appendChild(label);
        });
        break;

      case "rating":
        this.options.forEach((option) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = "quiz";
          input.value = option;
          label.textContent = option;
          label.prepend(input);
          form.appendChild(label);
        });
        break;

      default:
        console.error("Unknown quiz type:", this.type);
    }

    return form;
  }
  
  // Helper function to find the element to place the dragged item after
  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".sortable-item:not(.dragging)"),
    ];
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        const draggedItem = document.querySelector(".dragging");
        const draggedHeight = draggedItem.getBoundingClientRect().height;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else if (offset >= 0 && draggedHeight < box.height / 2) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }
  

  createDragAndDropQuiz(form) {
    // Створення контейнера для всього drag-and-drop
    const container = document.createElement("div");
    container.className = "drag-and-drop-container";

    // Ліва частина: зони для початкового розміщення properties
    const leftZone = document.createElement("div");
    leftZone.className = "left-zone";

    this.options.forEach((option) => {
      const propertyZone = document.createElement("div");
      propertyZone.className = "property-zone";

      const draggableItem = document.createElement("div");
      draggableItem.className = "draggable-item";
      draggableItem.draggable = true;
      draggableItem.textContent = option.property;
      draggableItem.dataset.property = option.property;

      // Обробники подій для перетягування
      draggableItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", option.property);
        e.dataTransfer.setData("element", draggableItem.outerHTML); // Зберігаємо сам елемент
        draggableItem.classList.add("dragging");
      });

      draggableItem.addEventListener("dragend", () => {
        draggableItem.classList.remove("dragging");
      });

      propertyZone.appendChild(draggableItem);
      leftZone.appendChild(propertyZone);
    });

    // Права частина: зони для описів (description)
    const rightZone = document.createElement("div");
    rightZone.className = "right-zone";

    this.options.forEach((option) => {
      const descriptionZone = document.createElement("div");
      descriptionZone.className = "description-zone";
      descriptionZone.textContent = option.description;
      descriptionZone.dataset.description = option.description;

      // Обробники подій для перетягування в ліву і праву зону
      leftZone.addEventListener("dragover", (e) => {
        e.preventDefault(); // Дозволяємо скидання
      });

      leftZone.addEventListener("dragleave", () => {});

      leftZone.addEventListener("drop", (e) => {
        e.preventDefault(); // Запобігаємо стандартному поводженню
        const property = e.dataTransfer.getData("text/plain"); // Отримуємо властивість, яку переносимо

        // Знаходимо перетягнутий елемент
        const draggedElement = document.querySelector(
          `[data-property='${property}']`
        );

        if (draggedElement) {
          // Видаляємо перетягнутий елемент з іншої property-zone, якщо він там
          if (draggedElement.closest(".property-zone")) {
            draggedElement.parentNode.removeChild(draggedElement);
          }

          // Знаходимо найближчу property-zone всередині leftZone, куди потрібно помістити елемент
          const targetZone = e.target.closest(".property-zone");

          if (targetZone) {
            // Якщо в зоні вже є елемент, очищаємо її
            if (targetZone.children.length > 0) {
              targetZone.innerHTML = ""; // Очищаємо старий елемент
            }
            // Переміщаємо елемент в targetZone
            targetZone.appendChild(draggedElement);
          }
        }

        leftZone.classList.remove("drag-over");
      });

      descriptionZone.addEventListener("dragover", (e) => {
        e.preventDefault(); // Дозволяємо скидання
        descriptionZone.classList.add("drag-over");
      });

      descriptionZone.addEventListener("dragleave", () => {
        descriptionZone.classList.remove("drag-over");
      });

      descriptionZone.addEventListener("drop", (e) => {
        e.preventDefault(); // Запобігаємо стандартному поводженню
        const property = e.dataTransfer.getData("text/plain"); // Отримуємо властивість, яку переносимо

        // Знаходимо перетягнутий елемент
        const draggedElement = document.querySelector(
          `[data-property='${property}']`
        );

        // Якщо елемент переноситься з лівої зони (left-zone)
        if (draggedElement && draggedElement.closest(".left-zone")) {
          // Видаляємо перетягнутий елемент з лівої зони
          draggedElement.parentNode.removeChild(draggedElement);

          // Знаходимо найближчу description-zone, куди потрібно помістити елемент
          if (descriptionZone.children.length > 0) {
            descriptionZone.innerHTML = ""; // Очищаємо старий елемент
          }

          // Додаємо елемент до правої зони
          descriptionZone.appendChild(draggedElement);
        } else if (draggedElement && draggedElement.closest(".right-zone")) {
          // Якщо елемент переноситься з правої зони (right-zone)
          draggedElement.parentNode.removeChild(draggedElement);

          // Додаємо елемент назад до лівої зони
          const leftZone = document.querySelector(".left-zone");
          leftZone.appendChild(draggedElement);
        }

        descriptionZone.classList.remove("drag-over");
      });

      rightZone.appendChild(descriptionZone);
    });

    // Додавання обох зон у контейнер
    container.appendChild(leftZone);
    container.appendChild(rightZone);

    // Додавання контейнера у форму
    form.appendChild(container);
  }
}

export const quizzes = [
  new Quiz(
    "Який із CSS-атрибутів використовується для зміни зовнішніх відступів?",
    "radio",
    ["padding", "margin", "border", "outline"],
    "margin"
  ),
  new Quiz(
    "Оберіть всі властивості, що впливають на блочну модель:",
    "checkbox",
    ["margin", "padding", "display", "z-index"],
    ["margin", "padding", "display"]
  ),
  new Quiz(
    "Яке значення властивості display перетворює елемент у блочний?",
    "dropdown",
    ["none", "inline", "block", "flex", "grid"],
    "block"
  ),
  new Quiz(
    "Встановіть відповідність між CSS-властивостями та їх функціями:",
    "drag-and-drop",
    [
      { property: "margin", description: "Зовнішні відступи" },
      { property: "padding", description: "Внутрішні відступи" },
      { property: "border", description: "Рамка" },
    ],
    {
      margin: "Зовнішні відступи",
      padding: "Внутрішні відступи",
      border: "Рамка",
    }
  ),
  new Quiz(
    "Опишіть, що таке блочна модель в CSS.",
    "text",
    null,
    "Блочна модель описує, як елементи HTML рендеряться як прямокутні блоки на веб-сторінці."
  ),
  new Quiz(
    "Властивість display: inline використовується для відображення елементів у рядок.",
    "true/false",
    ["true", "false"],
    "true"
  ),
  new Quiz(
    "Яке значення властивості box-sizing використовується за замовчуванням?",
    "dropdown",
    ["none", "content-box", "border-box", "margin-box", "padding-box"],
    "content-box"
  ),
  new Quiz(
    "Яке значення властивості position використовується для фіксації елемента на екрані, навіть при прокрутці сторінки?",
    "radio",
    ["static", "relative", "absolute", "fixed"],
    "fixed"
  ),
  new Quiz(
    "Оберіть всі можливі значення властивості position:",
    "checkbox",
    ["static", "relative", "absolute", "fixed", "sticky"],
    ["static", "relative", "absolute", "fixed", "sticky"]
  ),
  new Quiz(
    "Яка властивість визначає, чи накладаються елементи один на одного, і якщо так, який з них буде зверху?",
    "dropdown",
    ["none", "z-index", "position", "display", "visibility"],
    "z-index"
  )
];
