/* ============================================================
   GRC-Nexus Application JS — app.js
   Version 2.1
   ============================================================ */

// --- Sidebar active state -----------------------------------
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// --- Tab switching ------------------------------------------
function initTabs(containerSelector) {
  const container = document.querySelector(containerSelector || '.tabs-container');
  if (!container) return;
  const allContainers = document.querySelectorAll(containerSelector || '.tabs-container');
  allContainers.forEach(c => {
    const buttons = c.querySelectorAll('.tab-btn');
    const contents = c.querySelectorAll('.tab-content');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(ct => ct.classList.remove('active'));
        btn.classList.add('active');
        if (contents[i]) contents[i].classList.add('active');
      });
    });
    // Activate first tab by default
    if (buttons[0]) buttons[0].classList.add('active');
    if (contents[0]) contents[0].classList.add('active');
  });
}

// --- Side panel open/close ----------------------------------
function openPanel(panelId) {
  const overlay = document.getElementById(panelId);
  if (overlay) overlay.classList.add('open');
}
function closePanel(panelId) {
  const overlay = document.getElementById(panelId);
  if (overlay) overlay.classList.remove('open');
}

// Close panel on overlay click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('panel-overlay')) {
    e.target.classList.remove('open');
  }
});

// Close panel on close button
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('panel-close') || e.target.closest('.panel-close')) {
    const overlay = e.target.closest('.panel-overlay');
    if (overlay) overlay.classList.remove('open');
  }
});

// --- Sortable tables ----------------------------------------
function initSortableTable(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const headers = table.querySelectorAll('th.sortable');
  headers.forEach((th, colIndex) => {
    let asc = true;
    th.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const aCell = a.querySelectorAll('td')[colIndex];
        const bCell = b.querySelectorAll('td')[colIndex];
        const aText = aCell ? aCell.textContent.trim() : '';
        const bText = bCell ? bCell.textContent.trim() : '';
        const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return asc ? aNum - bNum : bNum - aNum;
        }
        return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });
      rows.forEach(r => tbody.appendChild(r));
      headers.forEach(h => h.querySelector('.sort-icon') && (h.querySelector('.sort-icon').textContent = '↕'));
      if (th.querySelector('.sort-icon')) th.querySelector('.sort-icon').textContent = asc ? '↑' : '↓';
      asc = !asc;
    });
  });
}

// --- Filter table rows by select ----------------------------
function filterTable(tableBodyId, filterValues) {
  // filterValues: array of {colIndex, value}
  const tbody = document.getElementById(tableBodyId);
  if (!tbody) return;
  const rows = tbody.querySelectorAll('tr');
  rows.forEach(row => {
    let show = true;
    filterValues.forEach(({colIndex, value}) => {
      if (value === '' || value === 'all') return;
      const cell = row.querySelectorAll('td')[colIndex];
      if (cell && !cell.textContent.toLowerCase().includes(value.toLowerCase())) {
        show = false;
      }
    });
    row.style.display = show ? '' : 'none';
  });
}

// --- Toggle report preview ----------------------------------
function toggleReportPreview() {
  const preview = document.getElementById('report-preview');
  if (preview) preview.classList.toggle('visible');
}

// --- Sidebar collapse toggle --------------------------------
function toggleSidebar() {
  document.body.classList.toggle('sidebar-collapsed');
  localStorage.setItem('grc-sidebar', document.body.classList.contains('sidebar-collapsed') ? '1' : '0');
}

// --- Dark mode toggle ----------------------------------------
function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('grc-theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('theme-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

// --- Console form submit ------------------------------------
function handleFormSubmit(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {};
    new FormData(form).forEach((v, k) => data[k] = v);
    console.log('[GRC-Nexus] Form submitted:', JSON.stringify(data, null, 2));
    form.reset();
    alert('Report submitted successfully. (Demo only — logged to console)');
  });
}

// --- DOMContentLoaded init ----------------------------------
document.addEventListener('DOMContentLoaded', function() {
  // Restore sidebar collapsed state
  if (localStorage.getItem('grc-sidebar') === '1') {
    document.body.classList.add('sidebar-collapsed');
  }
  // Sync theme button icon
  const btn = document.getElementById('theme-btn');
  if (btn) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
  }

  // Init all tab containers
  document.querySelectorAll('.tabs-container').forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const contents = container.querySelectorAll('.tab-content');
    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(ct => ct.classList.remove('active'));
        btn.classList.add('active');
        if (contents[i]) contents[i].classList.add('active');
      });
    });
    if (buttons[0]) buttons[0].classList.add('active');
    if (contents[0]) contents[0].classList.add('active');
  });

  // Init all sortable tables
  document.querySelectorAll('table[id]').forEach(t => initSortableTable(t.id));

  // Init any forms for console-only submit
  document.querySelectorAll('form.grc-form').forEach(f => {
    f.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = {};
      new FormData(f).forEach((v, k) => data[k] = v);
      console.log('[GRC-Nexus] Form submitted:', JSON.stringify(data, null, 2));
      f.reset();
      const msg = f.querySelector('.form-success-msg');
      if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
    });
  });
});
