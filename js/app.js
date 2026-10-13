document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME TOGGLE (DARK / LIGHT MODE) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Light Mode';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  });

  // --- 2. BACKGROUND CHANGER ---
  const bgSelector = document.getElementById('bg-selector');
  const bgUrlInput = document.getElementById('bg-url-input');
  const savedBg = localStorage.getItem('bgPreference') || 'bg-default';
  const savedCustomUrl = localStorage.getItem('bgCustomUrl') || '';

  function applyBackground(bgType, customUrl = '') {
    document.body.classList.remove('bg-default', 'bg-gradient', 'bg-industrial', 'bg-custom');
    document.body.style.backgroundImage = '';

    if (bgType === 'bg-custom' && customUrl) {
      document.body.classList.add('bg-custom');
      document.body.style.backgroundImage = `url('${customUrl}')`;
      bgUrlInput.style.display = 'inline-block';
      bgUrlInput.value = customUrl;
    } else {
      document.body.classList.add(bgType);
      if (bgType === 'bg-custom') {
        bgUrlInput.style.display = 'inline-block';
      } else {
        bgUrlInput.style.display = 'none';
      }
    }
  }

  applyBackground(savedBg, savedCustomUrl);
  bgSelector.value = savedBg;

  bgSelector.addEventListener('change', (e) => {
    const selectedBg = e.target.value;
    localStorage.setItem('bgPreference', selectedBg);
    if (selectedBg === 'bg-custom') {
      bgUrlInput.style.display = 'inline-block';
    } else {
      bgUrlInput.style.display = 'none';
      applyBackground(selectedBg);
    }
  });

  bgUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    localStorage.setItem('bgCustomUrl', url);
    if (url) {
      applyBackground('bg-custom', url);
    }
  });

  // --- 3. GREETING & CLOCK ---
  const greetingText = document.getElementById('greeting-text');
  const clockText = document.getElementById('clock-text');
  const dateText = document.getElementById('date-text');
  const usernameInput = document.getElementById('username-input');

  const savedName = localStorage.getItem('username') || '';
  usernameInput.value = savedName;

  usernameInput.addEventListener('input', (e) => {
    localStorage.setItem('username', e.target.value);
    updateGreeting();
  });

  function updateGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let name = localStorage.getItem('username');
    let nameSuffix = name ? `, ${name}` : '';
    
    let timeGreeting = 'Selamat Pagi';
    if (hours >= 12 && hours < 15) timeGreeting = 'Selamat Siang';
    else if (hours >= 15 && hours < 18) timeGreeting = 'Selamat Sore';
    else if (hours >= 18 || hours < 5) timeGreeting = 'Selamat Malam';

    greetingText.textContent = `${timeGreeting}${nameSuffix}!`;

    // Clock
    clockText.textContent = now.toLocaleTimeString('id-ID');
    
    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateText.textContent = now.toLocaleDateString('id-ID', options);
  }

  setInterval(updateGreeting, 1000);
  updateGreeting();

  // --- 4. FOCUS TIMER (POMODORO 25 MIN) ---
  let timerInterval = null;
  let timeRemaining = 25 * 60;
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer-btn');
  const stopBtn = document.getElementById('stop-timer-btn');
  const resetBtn = document.getElementById('reset-timer-btn');

  function renderTimer() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startBtn.addEventListener('click', () => {
    if (timerInterval) return;
    timerInterval = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        renderTimer();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        alert('Waktu Fokus Selesai!');
      }
    }, 1000);
  });

  stopBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
  });

  resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeRemaining = 25 * 60;
    renderTimer();
  });

  renderTimer();

  // --- 5. TO-DO LIST (WITH PREVENT DUPLICATES) ---
  const addTodoForm = document.getElementById('add-todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const todoErrorMsg = document.getElementById('todo-error-msg');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];

  function saveAndRenderTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    todoList.innerHTML = '';

    todos.forEach((todo, index) => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      
      const span = document.createElement('span');
      span.textContent = todo.text;
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => {
        todos[index].completed = !todos[index].completed;
        saveAndRenderTodos();
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '❌';
      delBtn.className = 'btn-danger';
      delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveAndRenderTodos();
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      todoList.appendChild(li);
    });
  }

  addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    todoErrorMsg.textContent = '';

    const isDuplicate = todos.some(t => t.text.toLowerCase() === taskText.toLowerCase());
    if (isDuplicate) {
      todoErrorMsg.textContent = 'Tugas ini sudah ada di dalam daftar!';
      return;
    }

    if (taskText) {
      todos.push({ text: taskText, completed: false });
      todoInput.value = '';
      saveAndRenderTodos();
    }
  });

  saveAndRenderTodos();

  // --- 6. QUICK LINKS (DEFAULT: International & National Company Career) ---
  const addLinkForm = document.getElementById('add-link-form');
  const linkTitleInput = document.getElementById('link-title-input');
  const linkUrlInput = document.getElementById('link-url-input');
  const quickLinksList = document.getElementById('quick-links-list');

  let quickLinks = JSON.parse(localStorage.getItem('quickLinks')) || [
    { title: 'International Company Career', url: 'https://www.linkedin.com/jobs' },
    { title: 'National Company Career', url: 'https://www.jobstreet.co.id' }
  ];

  function saveAndRenderLinks() {
    localStorage.setItem('quickLinks', JSON.stringify(quickLinks));
    quickLinksList.innerHTML = '';

    quickLinks.forEach((link, index) => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.textContent = link.title;
      a.style.color = 'var(--primary-color)';
      a.style.textDecoration = 'none';

      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.className = 'btn-danger';
      delBtn.addEventListener('click', () => {
        quickLinks.splice(index, 1);
        saveAndRenderLinks();
      });

      li.appendChild(a);
      li.appendChild(delBtn);
      quickLinksList.appendChild(li);
    });
  }

  addLinkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = linkTitleInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (title && url) {
      quickLinks.push({ title, url });
      linkTitleInput.value = '';
      linkUrlInput.value = '';
      saveAndRenderLinks();
    }
  });

  saveAndRenderLinks();
});