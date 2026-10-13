document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME TOGGLE (DARK / LIGHT MODE) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️ Light Mode';
  } else {
    document.body.classList.remove('dark-mode');
    themeToggleBtn.textContent = '🌙 Dark Mode';
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  });

  // --- 2. GREETING & CLOCK (WAKTU INDONESIA: PAGI, SIANG, SORE, MALAM) ---
  const greetingText = document.getElementById('greeting-text');
  const clockText = document.getElementById('clock-text');
  const dateText = document.getElementById('date-text');
  const usernameInput = document.getElementById('username-input');

  const savedName = localStorage.getItem('username') || 'Hagius';
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
    
    // Penyesuaian Waktu Indonesia
    let timeGreeting = 'Selamat Pagi';
    if (hours >= 12 && hours < 15) {
      timeGreeting = 'Selamat Siang';
    } else if (hours >= 15 && hours < 18) {
      timeGreeting = 'Selamat Sore';
    } else if (hours >= 18 || hours < 5) {
      timeGreeting = 'Selamat Malam';
    }

    greetingText.textContent = `${timeGreeting}${nameSuffix}!`;

    // Clock format HH.MM.SS
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minutesStr = String(now.getMinutes()).padStart(2, '0');
    const secondsStr = String(now.getSeconds()).padStart(2, '0');
    clockText.textContent = `${hoursStr}.${minutesStr}.${secondsStr}`;
    
    // Date format Indonesia
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateText.textContent = now.toLocaleDateString('id-ID', options);
  }

  setInterval(updateGreeting, 1000);
  updateGreeting();

  // --- 3. INTERNATIONAL COMPANY LINKS MANAGEMENT ---
  const addIntlForm = document.getElementById('add-intl-form');
  const intlTitleInput = document.getElementById('intl-title-input');
  const intlUrlInput = document.getElementById('intl-url-input');
  const intlLinksList = document.getElementById('intl-links-list');

  let intlLinks = JSON.parse(localStorage.getItem('intlLinks')) || [
    { title: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs' }
  ];

  function renderIntlLinks() {
    localStorage.setItem('intlLinks', JSON.stringify(intlLinks));
    intlLinksList.innerHTML = '';

    intlLinks.forEach((link, index) => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.textContent = link.title;

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Hapus';
      delBtn.className = 'btn-red';
      delBtn.addEventListener('click', () => {
        intlLinks.splice(index, 1);
        renderIntlLinks();
      });

      li.appendChild(a);
      li.appendChild(delBtn);
      intlLinksList.appendChild(li);
    });
  }

  addIntlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = intlTitleInput.value.trim();
    const url = intlUrlInput.value.trim();

    if (title && url) {
      intlLinks.push({ title, url });
      intlTitleInput.value = '';
      intlUrlInput.value = '';
      renderIntlLinks();
    }
  });

  renderIntlLinks();

  // --- 4. NATIONAL COMPANY LINKS MANAGEMENT ---
  const addNatForm = document.getElementById('add-nat-form');
  const natTitleInput = document.getElementById('nat-title-input');
  const natUrlInput = document.getElementById('nat-url-input');
  const natLinksList = document.getElementById('nat-links-list');

  let natLinks = JSON.parse(localStorage.getItem('natLinks')) || [
    { title: 'JobStreet Indonesia', url: 'https://www.jobstreet.co.id' }
  ];

  function renderNatLinks() {
    localStorage.setItem('natLinks', JSON.stringify(natLinks));
    natLinksList.innerHTML = '';

    natLinks.forEach((link, index) => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.textContent = link.title;

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Hapus';
      delBtn.className = 'btn-red';
      delBtn.addEventListener('click', () => {
        natLinks.splice(index, 1);
        renderNatLinks();
      });

      li.appendChild(a);
      li.appendChild(delBtn);
      natLinksList.appendChild(li);
    });
  }

  addNatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = natTitleInput.value.trim();
    const url = natUrlInput.value.trim();

    if (title && url) {
      natLinks.push({ title, url });
      natTitleInput.value = '';
      natUrlInput.value = '';
      renderNatLinks();
    }
  });

  renderNatLinks();

});