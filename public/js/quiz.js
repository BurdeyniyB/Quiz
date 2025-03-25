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
    // Create container for the drag-and-drop quiz
    const container = document.createElement("div");
    container.className = "drag-and-drop-container";

    // Left zone: initial placement of properties
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

      // Drag event handlers
      draggableItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", option.property);
        e.dataTransfer.setData("element", draggableItem.outerHTML);
        draggableItem.classList.add("dragging");
      });

      draggableItem.addEventListener("dragend", () => {
        draggableItem.classList.remove("dragging");
      });

      propertyZone.appendChild(draggableItem);
      leftZone.appendChild(propertyZone);
    });

    // Right zone: description areas
    const rightZone = document.createElement("div");
    rightZone.className = "right-zone";

    this.options.forEach((option) => {
      const descriptionZone = document.createElement("div");
      descriptionZone.className = "description-zone";
      descriptionZone.textContent = option.description;
      descriptionZone.dataset.description = option.description;

      leftZone.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      leftZone.addEventListener("drop", (e) => {
        e.preventDefault();
        const property = e.dataTransfer.getData("text/plain");

        const draggedElement = document.querySelector(
          `[data-property='${property}']`
        );

        if (draggedElement) {
          if (draggedElement.closest(".property-zone")) {
            draggedElement.parentNode.removeChild(draggedElement);
          }

          const targetZone = e.target.closest(".property-zone");

          if (targetZone) {
            if (targetZone.children.length > 0) {
              targetZone.innerHTML = "";
            }
            targetZone.appendChild(draggedElement);
          }
        }

        leftZone.classList.remove("drag-over");
      });

      descriptionZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        descriptionZone.classList.add("drag-over");
      });

      descriptionZone.addEventListener("dragleave", () => {
        descriptionZone.classList.remove("drag-over");
      });

      descriptionZone.addEventListener("drop", (e) => {
        e.preventDefault();
        const property = e.dataTransfer.getData("text/plain");

        const draggedElement = document.querySelector(
          `[data-property='${property}']`
        );

        if (draggedElement && draggedElement.closest(".left-zone")) {
          draggedElement.parentNode.removeChild(draggedElement);

          if (descriptionZone.children.length > 0) {
            descriptionZone.innerHTML = "";
          }

          descriptionZone.appendChild(draggedElement);
        } else if (draggedElement && draggedElement.closest(".right-zone")) {
          draggedElement.parentNode.removeChild(draggedElement);

          const leftZone = document.querySelector(".left-zone");
          leftZone.appendChild(draggedElement);
        }

        descriptionZone.classList.remove("drag-over");
      });

      rightZone.appendChild(descriptionZone);
    });

    // Append both zones to the container
    container.appendChild(leftZone);
    container.appendChild(rightZone);

    // Append the container to the form
    form.appendChild(container);
  }
}

// Quiz data examples
export const quizzes = [
  new Quiz(
    "Which CSS attribute is used to change the outer margins?",
    "radio",
    ["padding", "margin", "border", "outline"],
    "margin"
  ),
  new Quiz(
    "Select all properties that affect the box model:",
    "checkbox",
    ["margin", "padding", "display", "z-index"],
    ["margin", "padding", "display"]
  ),
  new Quiz(
    "Which display property value turns an element into a block element?",
    "dropdown",
    ["none", "inline", "block", "flex", "grid"],
    "block"
  ),
  new Quiz(
    "Match the CSS properties with their functions:",
    "drag-and-drop",
    [
      { property: "margin", description: "Outer margins" },
      { property: "padding", description: "Inner margins" },
      { property: "border", description: "Border" },
    ],
    {
      margin: "Outer margins",
      padding: "Inner margins",
      border: "Border",
    }
  ),
  new Quiz(
    "Describe what the box model in CSS is.",
    "text",
    null,
    "The box model describes how HTML elements are rendered as rectangular boxes on a web page."
  ),
  new Quiz(
    "The display: inline property is used to display elements in a row.",
    "true/false",
    ["true", "false"],
    "true"
  ),
  new Quiz(
    "Which box-sizing property value is used by default?",
    "dropdown",
    ["none", "content-box", "border-box", "margin-box", "padding-box"],
    "content-box"
  ),
  new Quiz(
    "Which position property value is used to fix an element on the screen, even when scrolling?",
    "radio",
    ["static", "relative", "absolute", "fixed"],
    "fixed"
  ),
  new Quiz(
    "Select all possible values of the position property:",
    "checkbox",
    ["static", "relative", "absolute", "fixed", "sticky"],
    ["static", "relative", "absolute", "fixed", "sticky"]
  ),
  new Quiz(
    "Which property determines whether elements overlap each other, and if so, which one appears on top?",
    "dropdown",
    ["none", "z-index", "position", "display", "visibility"],
    "z-index"
  )
];
