const taskList = document.getElementById('taskList');
const progressBar = document.getElementById('progressBar');
const taskStats = document.getElementById('taskStats');
const quoteEl = document.getElementById('quote');

const motivationalQuotes = [
  "“Stay focused and never give up.”",
  "“You are capable of amazing things.”",
  "“Progress, not perfection.”",
  "“Push yourself, because no one else will.”",
  "“Dream it. Wish it. Do it.”",
    "“Success is not for the lazy.”",
    "“The harder you work for something, the greater you’ll feel when you achieve it.”",
    "“Dream bigger. Do bigger.”",
    "“Don’t stop when you’re tired. Stop when you’re done.”",
    "“Wake up with determination. Go to bed with satisfaction.”",
    "“Do something today that your future self will thank you for.”",
    "“Little things make big days.”",
    "“It’s going to be hard, but hard does not mean impossible.”",
    "“Don’t wait for opportunity. Create it.”",
    "“Sometimes we’re tested not to show our weaknesses, but to discover our strengths.”",
    "“The key to success is to focus on goals, not obstacles.”",
    "“Dream it. Believe it. Build it.”",
];

function loadQuote() {
  const random = Math.floor(Math.random() * motivationalQuotes.length);
  quoteEl.textContent = motivationalQuotes[random];
}

function addTask() {
  const text = document.getElementById('taskText').value.trim();
  const date = document.getElementById('taskDate').value;
  const priority = document.getElementById('taskPriority').value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    date,
    priority,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
  renderTasks();
  document.getElementById('soundEffect').play();
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleComplete(id) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}

function renderTasks() {
  const tasks = getTasks();
  tasks.sort((a, b) => {
    const priorities = { High: 1, Medium: 2, Low: 3 };
    return priorities[a.priority] - priorities[b.priority];
  });

  taskList.innerHTML = '';
  let completed = 0;

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.priority.toLowerCase();
    if (task.completed) li.style.textDecoration = 'line-through';

    const dateBadge = getDateBadge(task.date);

    li.innerHTML = `
      <span>${task.text} ${dateBadge}</span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">🗑</button>
      </div>
    `;
    taskList.appendChild(li);
    if (task.completed) completed++;
  });

  const percent = tasks.length ? (completed / tasks.length) * 100 : 0;
  progressBar.style.width = percent + '%';
  taskStats.textContent = `${completed} of ${tasks.length} tasks completed`;
}

function getDateBadge(date) {
  const today = new Date();
  const dueDate = new Date(date);
  const diff = (dueDate - today) / (1000 * 60 * 60 * 24);
  if (isNaN(diff)) return '';
  if (diff < 0) return '<span style="color:red;">[Overdue]</span>';
  if (diff < 1) return '<span style="color:orange;">[Today]</span>';
  if (diff < 2) return '<span style="color:green;">[Tomorrow]</span>';
  return '';
}

function startVoiceInput() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  recognition.onresult = event => {
    document.getElementById('taskText').value = event.results[0][0].transcript;
  };
}

document.getElementById('themeToggle').onclick = () => {
  document.body.classList.toggle('theme-dark');
};

window.onload = () => {
  loadQuote();
  renderTasks();
};
