const API = '/api';
let token = localStorage.getItem('token');
let currentUser = null;
let myPlants = [];
let allShares = [];

// ---- UTILS ----
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
function showSuccess(msg) {
  const el = document.getElementById('success-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

function navigate(sectionId) {
  document.querySelectorAll('main section').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(sectionId);
  if (sec) sec.classList.add('active');
  // Auto-load
  if (sectionId === 'catalog') loadCatalog();
  if (sectionId === 'my-plants') loadMyPlants();
  if (sectionId === 'compatible') loadCompatible();
  if (sectionId === 'my-shares') loadShares();
  if (sectionId === 'history') loadHistory();
  if (sectionId === 'reports') loadReports();
}

document.querySelectorAll('[data-section]').forEach(a => {
  a.addEventListener('click', () => navigate(a.dataset.section));
});

function showTab(formId, btn) {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'none';
  document.getElementById(formId).style.display = 'block';
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

function showSharesTab(tab, btn) {
  document.getElementById('shares-outgoing').style.display = tab === 'outgoing' ? 'block' : 'none';
  document.getElementById('shares-incoming').style.display = tab === 'incoming' ? 'block' : 'none';
  document.querySelectorAll('#my-shares .tabs .tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

// ---- AUTH ----
async function handleLogin(e) {
  e.preventDefault();
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value,
      }),
    });
    token = data.token;
    localStorage.setItem('token', token);
    await initApp();
    navigate('catalog');
  } catch (err) {
    showError(err.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: document.getElementById('reg-username').value,
        email: document.getElementById('reg-email').value,
        password: document.getElementById('reg-password').value,
        region: document.getElementById('reg-region').value,
      }),
    });
    showSuccess('Регистрация успешна! Войдите.');
    showTab('login-form', document.querySelector('.tab'));
  } catch (err) {
    showError(err.message);
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  document.getElementById('nav-auth').style.display = '';
  document.getElementById('nav-app').style.display = 'none';
  document.getElementById('btn-logout').style.display = 'none';
  document.getElementById('user-info').textContent = '';
  navigate('auth');
}

async function initApp() {
  try {
    currentUser = await apiFetch('/auth/me');
    document.getElementById('user-info').textContent = `👤 ${currentUser.username}`;
    document.getElementById('nav-auth').style.display = 'none';
    document.getElementById('nav-app').style.display = '';
    document.getElementById('btn-logout').style.display = '';
  } catch {
    logout();
  }
}

// ---- CATALOG ----
async function loadCatalog() {
  try {
    const type = document.getElementById('filter-type').value;
    const region = document.getElementById('filter-region').value;
    const params = new URLSearchParams();
    if (type) params.set('type', type);
    if (region) params.set('region', region);
    const plants = await apiFetch('/plants?' + params.toString());
    const el = document.getElementById('catalog-list');
    if (!plants.length) { el.innerHTML = '<p style="color:#888">Растений не найдено</p>'; return; }
    el.innerHTML = plants.map(p => `
      <div class="card">
        <h3>${p.name} <span class="badge badge-available">Доступно</span></h3>
        <p><strong>Тип:</strong> ${p.type || '—'} | <strong>Регион:</strong> ${p.region || '—'}</p>
        <p>${p.description || ''}</p>
        ${token ? `<div class="actions"><button class="btn-primary btn-sm" onclick="openShareModal(${p.id}, '${escHtml(p.name)}')">Предложить обмен</button></div>` : ''}
      </div>
    `).join('');
  } catch (err) { showError(err.message); }
}

// ---- MY PLANTS ----
async function loadMyPlants() {
  try {
    myPlants = await apiFetch('/plants/my/list');
    const el = document.getElementById('my-plants-list');
    if (!myPlants.length) { el.innerHTML = '<p style="color:#888">У вас нет растений</p>'; return; }
    el.innerHTML = myPlants.map(p => `
      <div class="card">
        <h3>${p.name} <span class="badge ${p.is_available ? 'badge-available' : 'badge-unavailable'}">${p.is_available ? 'Доступно' : 'Недоступно'}</span></h3>
        <p><strong>Тип:</strong> ${p.type || '—'} | <strong>Регион:</strong> ${p.region || '—'}</p>
        <p>${p.description || ''}</p>
        <div class="actions">
          <button class="btn-secondary btn-sm" onclick="editPlant(${p.id})">Редактировать</button>
          <button class="btn-danger btn-sm" onclick="deletePlant(${p.id})">Удалить</button>
          <button class="btn-secondary btn-sm" onclick="toggleAvailability(${p.id}, ${p.is_available})">${p.is_available ? 'Снять с обмена' : 'Выставить на обмен'}</button>
        </div>
      </div>
    `).join('');
  } catch (err) { showError(err.message); }
}

function resetPlantForm() {
  document.getElementById('plant-id').value = '';
  document.getElementById('plant-name').value = '';
  document.getElementById('plant-type').value = '';
  document.getElementById('plant-desc').value = '';
  document.getElementById('plant-region').value = '';
  document.getElementById('plant-form-title').textContent = 'Добавить растение';
}

function editPlant(id) {
  const p = myPlants.find(pl => pl.id === id);
  if (!p) return;
  document.getElementById('plant-id').value = p.id;
  document.getElementById('plant-name').value = p.name;
  document.getElementById('plant-type').value = p.type || '';
  document.getElementById('plant-desc').value = p.description || '';
  document.getElementById('plant-region').value = p.region || '';
  document.getElementById('plant-form-title').textContent = 'Редактировать растение';
  document.getElementById('plant-form').scrollIntoView({ behavior: 'smooth' });
}

async function handleSavePlant(e) {
  e.preventDefault();
  const id = document.getElementById('plant-id').value;
  const body = {
    name: document.getElementById('plant-name').value,
    type: document.getElementById('plant-type').value,
    description: document.getElementById('plant-desc').value,
    region: document.getElementById('plant-region').value,
  };
  try {
    if (id) {
      await apiFetch(`/plants/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      showSuccess('Растение обновлено');
    } else {
      await apiFetch('/plants', { method: 'POST', body: JSON.stringify(body) });
      showSuccess('Растение добавлено');
    }
    resetPlantForm();
    loadMyPlants();
  } catch (err) { showError(err.message); }
}

async function deletePlant(id) {
  if (!confirm('Удалить растение?')) return;
  try {
    await apiFetch(`/plants/${id}`, { method: 'DELETE' });
    showSuccess('Растение удалено');
    loadMyPlants();
  } catch (err) { showError(err.message); }
}

async function toggleAvailability(id, current) {
  try {
    await apiFetch(`/plants/${id}`, { method: 'PUT', body: JSON.stringify({ is_available: !current }) });
    loadMyPlants();
  } catch (err) { showError(err.message); }
}

// ---- COMPATIBLE ----
async function loadCompatible() {
  try {
    const plants = await apiFetch('/plants/my/compatible');
    const el = document.getElementById('compatible-list');
    if (!plants.length) { el.innerHTML = '<p style="color:#888">Нет доступных растений для обмена</p>'; return; }
    el.innerHTML = plants.map(p => `
      <div class="card">
        <h3>${p.name}</h3>
        <p><strong>Тип:</strong> ${p.type || '—'} | <strong>Регион:</strong> ${p.region || '—'}</p>
        <p>${p.description || ''}</p>
        <div class="actions">
          <button class="btn-primary btn-sm" onclick="openShareModal(${p.id}, '${escHtml(p.name)}')">Предложить обмен</button>
        </div>
      </div>
    `).join('');
  } catch (err) { showError(err.message); }
}

// ---- SHARE MODAL ----
async function openShareModal(wantedId, wantedName) {
  if (!token) { navigate('auth'); return; }
  document.getElementById('share-wanted-id').value = wantedId;
  document.getElementById('share-wanted-name').textContent = wantedName;
  document.getElementById('share-message').value = '';
  try {
    const plants = await apiFetch('/plants/my/list');
    const available = plants.filter(p => p.is_available);
    const sel = document.getElementById('share-offered-id');
    sel.innerHTML = available.length
      ? available.map(p => `<option value="${p.id}">${p.name}</option>`).join('')
      : '<option value="">Нет доступных растений</option>';
  } catch {}
  const modal = document.getElementById('share-modal');
  modal.style.display = 'flex';
}
function closeShareModal() {
  document.getElementById('share-modal').style.display = 'none';
}

async function handleCreateShare(e) {
  e.preventDefault();
  const wanted_plant_id = document.getElementById('share-wanted-id').value;
  const offered_plant_id = document.getElementById('share-offered-id').value;
  const message = document.getElementById('share-message').value;
  if (!offered_plant_id) { showError('Нет доступных растений для обмена'); return; }
  try {
    await apiFetch('/shares', {
      method: 'POST',
      body: JSON.stringify({ offered_plant_id: parseInt(offered_plant_id), wanted_plant_id: parseInt(wanted_plant_id), message }),
    });
    closeShareModal();
    showSuccess('Запрос на обмен отправлен');
  } catch (err) { showError(err.message); }
}

// ---- SHARES ----
async function loadShares() {
  try {
    allShares = await apiFetch('/shares');
    const outgoing = allShares.filter(s => s.requester_id === currentUser.id);
    const incoming = allShares.filter(s => s.requester_id !== currentUser.id);
    renderShares(outgoing, 'shares-outgoing', 'outgoing');
    renderShares(incoming, 'shares-incoming', 'incoming');
  } catch (err) { showError(err.message); }
}

function renderShares(shares, containerId, type) {
  const el = document.getElementById(containerId);
  if (!shares.length) { el.innerHTML = '<p style="color:#888">Нет запросов</p>'; return; }
  el.innerHTML = shares.map(s => `
    <div class="card">
      <p><strong>Предложено:</strong> Plant #${s.offered_plant_id} → <strong>Желаемо:</strong> Plant #${s.wanted_plant_id}</p>
      <p>${s.message ? `<em>${s.message}</em>` : ''}</p>
      <p><span class="badge badge-${s.status}">${s.status}</span> <small style="color:#888">${new Date(s.created_at).toLocaleDateString('ru')}</small></p>
      <div class="actions">
        ${type === 'incoming' && s.status === 'pending' ? `
          <button class="btn-primary btn-sm" onclick="acceptShare(${s.id})">Принять</button>
          <button class="btn-danger btn-sm" onclick="rejectShare(${s.id})">Отклонить</button>
        ` : ''}
        ${type === 'outgoing' && s.status === 'pending' ? `
          <button class="btn-danger btn-sm" onclick="deleteShare(${s.id})">Отменить</button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

async function acceptShare(id) {
  try {
    await apiFetch(`/shares/${id}/accept`, { method: 'PATCH' });
    showSuccess('Обмен принят!');
    loadShares();
  } catch (err) { showError(err.message); }
}
async function rejectShare(id) {
  try {
    await apiFetch(`/shares/${id}/reject`, { method: 'PATCH' });
    showSuccess('Обмен отклонён');
    loadShares();
  } catch (err) { showError(err.message); }
}
async function deleteShare(id) {
  if (!confirm('Отменить запрос?')) return;
  try {
    await apiFetch(`/shares/${id}`, { method: 'DELETE' });
    showSuccess('Запрос отменён');
    loadShares();
  } catch (err) { showError(err.message); }
}

// ---- HISTORY ----
async function loadHistory() {
  try {
    const history = await apiFetch('/shares/history');
    const el = document.getElementById('history-list');
    if (!history.length) { el.innerHTML = '<p style="color:#888">История пуста</p>'; return; }
    el.innerHTML = history.map(h => `
      <div class="card">
        <h3>${h.plant1_name} ↔ ${h.plant2_name}</h3>
        <p><strong>Участники:</strong> ${h.user1_name} и ${h.user2_name}</p>
        <p><small style="color:#888">${new Date(h.completed_at).toLocaleDateString('ru')}</small></p>
      </div>
    `).join('');
  } catch (err) { showError(err.message); }
}

// ---- REPORTS ----
async function loadReports() {
  try {
    const [summary, users, plants] = await Promise.all([
      apiFetch('/reports/summary'),
      apiFetch('/reports/active-users'),
      apiFetch('/reports/popular-plants'),
    ]);
    document.getElementById('reports-summary').innerHTML = `
      <div class="stat-card"><div class="number">${summary.total_users}</div><div>Пользователей</div></div>
      <div class="stat-card"><div class="number">${summary.total_plants}</div><div>Растений</div></div>
      <div class="stat-card"><div class="number">${summary.total_exchanges}</div><div>Обменов</div></div>
    `;
    document.querySelector('#reports-users tbody').innerHTML = users.map((u, i) =>
      `<tr><td>${i+1}</td><td>${u.username}</td><td>${u.region || '—'}</td><td>${u.exchanges}</td></tr>`
    ).join('');
    document.querySelector('#reports-plants tbody').innerHTML = plants.map((p, i) =>
      `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.type || '—'}</td><td>${p.region || '—'}</td><td>${p.request_count}</td></tr>`
    ).join('');
  } catch (err) { showError(err.message); }
}

// ---- HELPERS ----
function escHtml(s) {
  return s.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// ---- INIT ----
(async () => {
  if (token) {
    await initApp();
    navigate('catalog');
  } else {
    navigate('auth');
  }
})();
