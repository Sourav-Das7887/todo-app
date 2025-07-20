let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  // Sort tasks by deadline (earliest first)
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    // Calculate days left
    const deadlineDate = new Date(task.deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Expired or due today warning
    let deadlineClass = "deadline";
    let warningText = "";
    if (diffDays < 0) {
      deadlineClass += " expired";
      warningText = " (Expired)";
    } else if (diffDays === 0) {
      deadlineClass += " due-today";
      warningText = " (Due today)";
    } else if (diffDays === 1) {
      warningText = " (Due in 1 day)";
    } else {
      warningText = ` (Due in ${diffDays} days)`;
    }

    li.innerHTML = `
      <span onclick="toggleTask(${index})">${task.text}</span>
      <span class="${deadlineClass}">Due: ${task.deadline}${warningText}</span>
      <button class="delete-btn" onclick="deleteTask(${index})">X</button>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("taskDeadline");

  const text = input.value.trim();
  const deadline = deadlineInput.value;

  if (text && deadline) {
    tasks.push({ text, completed: false, deadline });
    input.value = "";
    deadlineInput.value = "";
    saveTasks();
    renderTasks();
  } else {
    // Optionally, show a message or highlight missing fields
    input.reportValidity();
    deadlineInput.reportValidity();
  }
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

renderTasks();
