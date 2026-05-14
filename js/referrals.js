// ─────────────────────────────────────
//   ORM Flooring — Referrals System
// ─────────────────────────────────────

const ADMIN_USER = 'ricardo';
const ADMIN_PASS = 'ORM2026!flooring';
const CODES_KEY  = 'orm_referral_codes';
const LOGS_KEY   = 'orm_referral_logs';

let currentCodeId = null;

// ─── AUTH ───
function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('orm_ref_admin', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    render();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('orm_ref_admin');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

window.addEventListener('load', () => {
  if (sessionStorage.getItem('orm_ref_admin')) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    render();
  }
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});

// ─── STORAGE ───
function getCodes() {
  try { return JSON.parse(localStorage.getItem(CODES_KEY)) || []; }
  catch { return []; }
}

function saveCodes(codes) {
  localStorage.setItem(CODES_KEY, JSON.stringify(codes));
}

function getLogs() {
  try { return JSON.parse(localStorage.getItem(LOGS_KEY)) || []; }
  catch { return []; }
}

function saveLogs(logs) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

// ─── CREATE CODE ───
function createCode() {
  const name       = document.getElementById('refName').value.trim();
  const code       = document.getElementById('refCode').value.trim().toUpperCase();
  const type       = document.getElementById('refType').value;
  const value      = parseFloat(document.getElementById('refValue').value);

  if (!name || !code || isNaN(value) || value <= 0) {
    showAlert('error', 'Please fill in all fields.');
    return;
  }

  const codes = getCodes();
  if (codes.find(c => c.code === code)) {
    showAlert('error', `Code "${code}" already exists.`);
    return;
  }

  codes.push({
    id: Date.now(),
    name,
    code,
    type,        // 'percent' | 'fixed'
    value,
    active: true,
    uses: 0,
    totalPaid: 0,
    createdAt: new Date().toLocaleDateString()
  });

  saveCodes(codes);
  document.getElementById('refName').value = '';
  document.getElementById('refCode').value = '';
  document.getElementById('refValue').value = '';
  render();
  showAlert('success', `Code "${code}" created for ${name}!`);
}

// Auto-generate code from name
document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('refName');
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      const code = this.value.trim().toUpperCase().replace(/\s+/g, '').substring(0, 8);
      document.getElementById('refCode').value = code;
    });
  }
});

// ─── TOGGLE ACTIVE ───
function toggleCode(id) {
  const codes = getCodes();
  const code = codes.find(c => c.id === id);
  if (code) {
    code.active = !code.active;
    saveCodes(codes);
    render();
  }
}

// ─── DELETE CODE ───
function deleteCode(id) {
  if (!confirm('Delete this referral code? This will also delete its history.')) return;
  saveCodes(getCodes().filter(c => c.id !== id));
  const logs = getLogs().filter(l => l.codeId !== id);
  saveLogs(logs);
  render();
  showAlert('success', 'Code deleted.');
}

// ─── COPY CODE ───
function copyCode(code) {
  const text = `Use code ${code} when filling out your estimate at ormflooring.com/estimate.html — mention it in the Additional Details field!`;
  navigator.clipboard.writeText(text).then(() => {
    showAlert('success', `WhatsApp message copied! Paste and send to your contact.`);
  });
}

// ─── LOG MODAL ───
function openLog(id) {
  currentCodeId = id;
  const codes = getCodes();
  const code = codes.find(c => c.id === id);
  if (!code) return;

  document.getElementById('modalTitle').textContent = `${code.name} — ${code.code}`;
  document.getElementById('logClient').value = '';
  document.getElementById('logProject').value = '';
  document.getElementById('logNotes').value = '';

  renderLogs(id, code);
  document.getElementById('logModal').classList.add('open');
}

function closeModal() {
  document.getElementById('logModal').classList.remove('open');
  currentCodeId = null;
}

function renderLogs(codeId, code) {
  const logs = getLogs().filter(l => l.codeId === codeId);
  const container = document.getElementById('logEntries');

  if (logs.length === 0) {
    container.innerHTML = '<div class="no-logs">No referrals logged yet for this code.</div>';
    return;
  }

  container.innerHTML = logs.slice().reverse().map(l => {
    const commission = code.type === 'percent'
      ? `$${((l.projectAmount * code.value) / 100).toFixed(2)} commission (${code.value}%)`
      : `$${code.value.toFixed(2)} flat commission`;
    return `
      <div class="log-entry">
        <div class="log-entry-header">
          <div>
            <div class="log-entry-client">${l.clientName}</div>
            <div class="log-entry-date">${l.date}</div>
          </div>
          <div style="text-align:right">
            <div class="log-entry-amount">$${l.projectAmount.toLocaleString()}</div>
            <div class="log-entry-commission">${commission}</div>
          </div>
        </div>
        ${l.notes ? `<div style="font-size:0.75rem;color:var(--gray);margin-top:0.3rem">${l.notes}</div>` : ''}
        <button class="log-entry-delete" onclick="deleteLog(${l.id})">✕ Remove</button>
      </div>
    `;
  }).join('');
}

function addLog() {
  const clientName    = document.getElementById('logClient').value.trim();
  const projectAmount = parseFloat(document.getElementById('logProject').value);
  const notes         = document.getElementById('logNotes').value.trim();

  if (!clientName || isNaN(projectAmount) || projectAmount <= 0) {
    showAlert('error', 'Please enter client name and project amount.');
    return;
  }

  const codes = getCodes();
  const code  = codes.find(c => c.id === currentCodeId);
  if (!code) return;

  const commission = code.type === 'percent'
    ? (projectAmount * code.value) / 100
    : code.value;

  const logs = getLogs();
  logs.push({
    id: Date.now(),
    codeId: currentCodeId,
    clientName,
    projectAmount,
    commission,
    notes,
    date: new Date().toLocaleDateString()
  });
  saveLogs(logs);

  // Update code stats
  code.uses += 1;
  code.totalPaid += commission;
  saveCodes(codes);

  document.getElementById('logClient').value = '';
  document.getElementById('logProject').value = '';
  document.getElementById('logNotes').value = '';

  renderLogs(currentCodeId, code);
  render();
  showAlert('success', `Referral logged! Commission: $${commission.toFixed(2)}`);
}

function deleteLog(logId) {
  if (!confirm('Remove this log entry?')) return;
  const logs = getLogs();
  const log = logs.find(l => l.id === logId);
  if (!log) return;

  // Subtract from code stats
  const codes = getCodes();
  const code = codes.find(c => c.id === log.codeId);
  if (code) {
    code.uses = Math.max(0, code.uses - 1);
    code.totalPaid = Math.max(0, code.totalPaid - log.commission);
    saveCodes(codes);
  }

  saveLogs(logs.filter(l => l.id !== logId));
  if (currentCodeId) renderLogs(currentCodeId, code);
  render();
}

// ─── RENDER ───
function render() {
  const codes = getCodes();
  const logs  = getLogs();

  const totalCodes    = codes.length;
  const activeCodes   = codes.filter(c => c.active).length;
  const totalUses     = codes.reduce((s, c) => s + c.uses, 0);
  const totalPaid     = codes.reduce((s, c) => s + c.totalPaid, 0);

  document.getElementById('statTotal').textContent  = totalCodes;
  document.getElementById('statActive').textContent = activeCodes;
  document.getElementById('statUses').textContent   = totalUses;
  document.getElementById('statPaid').textContent   = '$' + totalPaid.toFixed(2);

  const tbody = document.getElementById('codesBody');

  if (codes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state">No referral codes yet — create your first one above</div></td></tr>`;
    return;
  }

  tbody.innerHTML = codes.map(c => {
    const commissionLabel = c.type === 'percent'
      ? `<span class="commission-badge percent">${c.value}%</span>`
      : `<span class="commission-badge fixed">$${c.value.toFixed(2)}</span>`;

    const statusLabel = c.active
      ? '<span class="status-badge active">Active</span>'
      : '<span class="status-badge inactive">Inactive</span>';

    return `
      <tr>
        <td><span class="code-badge">${c.code}</span></td>
        <td>${c.name}</td>
        <td>${commissionLabel}</td>
        <td>${statusLabel}</td>
        <td>${c.uses}</td>
        <td>$${c.totalPaid.toFixed(2)}</td>
        <td>${c.createdAt}</td>
        <td>
          <div class="action-btns">
            <button class="btn-sm btn-copy"   onclick="copyCode('${c.code}')">📋 Copy</button>
            <button class="btn-sm btn-log"    onclick="openLog(${c.id})">📝 Log</button>
            <button class="btn-sm btn-toggle" onclick="toggleCode(${c.id})">${c.active ? 'Pause' : 'Activate'}</button>
            <button class="btn-sm btn-delete" onclick="deleteCode(${c.id})">🗑</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// ─── ALERT ───
function showAlert(type, msg) {
  const box = document.getElementById('alertBox');
  box.className = `alert ${type}`;
  box.textContent = msg;
  setTimeout(() => {
    box.className = 'alert';
    box.style.display = 'none';
  }, 4000);
}
