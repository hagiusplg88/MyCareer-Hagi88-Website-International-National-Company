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

});