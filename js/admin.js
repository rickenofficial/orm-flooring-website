// ─────────────────────────────────────
//   ORM Flooring — Admin Panel Logic
// ─────────────────────────────────────

const ADMIN_USER = 'ricardo';
const ADMIN_PASS = 'ORM2026!flooring';
const STORAGE_KEY = 'orm_gallery_photos';

// ─── AUTH ───
function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value.trim();
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem('orm_admin', '1');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadGallery();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('orm_admin');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}

window.addEventListener('load', () => {
  if (sessionStorage.getItem('orm_admin')) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadGallery();
  }

  // Enter key on password field
  document.getElementById('loginPass').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });

  // File input change
  document.getElementById('fileInput').addEventListener('change', function () {
    addToQueue(Array.from(this.files));
    this.value = '';
  });

  // Drag and drop
  const area = document.getElementById('uploadArea');
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('dragover'); });
  area.addEventListener('dragleave', () => area.classList.remove('dragover'));
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.classList.remove('dragover');
    addToQueue(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  });
});

// ─── PHOTO QUEUE ───
let photoQueue = [];

function addToQueue(files) {
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      photoQueue.push({
        file,
        dataUrl: e.target.result,
        label: document.getElementById('uploadLabel').value || '',
        cat: document.getElementById('uploadCat').value
      });
      renderQueue();
    };
    reader.readAsDataURL(file);
  });
}

function renderQueue() {
  const q = document.getElementById('previewQueue');
  q.innerHTML = photoQueue.map((p, i) => `
    <div class="preview-item">
      <img src="${p.dataUrl}" alt="${p.label}">
      <button class="remove" onclick="removeFromQueue(${i})">✕</button>
      <div class="cat-badge">${p.cat}</div>
    </div>
  `).join('');
  document.getElementById('uploadBtn').disabled = photoQueue.length === 0;
  document.getElementById('queueCount').textContent = photoQueue.length > 0
    ? `${photoQueue.length} photo${photoQueue.length > 1 ? 's' : ''} ready`
    : '';
}

function removeFromQueue(i) {
  photoQueue.splice(i, 1);
  renderQueue();
}

// ─── UPLOAD ───
function uploadPhotos() {
  if (photoQueue.length === 0) return;

  const btn = document.getElementById('uploadBtn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';

  const progressWrap = document.getElementById('progressWrap');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  progressWrap.classList.add('show');

  const photos = getPhotos();
  let done = 0;

  photoQueue.forEach((item, i) => {
    setTimeout(() => {
      const cat = item.cat;
      const defaultLabel = cat === 'lvp' ? 'LVP Installation — Utah'
        : cat === 'hardwood' ? 'Hardwood Installation — Utah'
        : cat === 'laminate' ? 'Laminate Installation — Utah'
        : 'Carpet Installation — Utah';

      photos.push({
        id: Date.now() + i,
        src: item.dataUrl,
        cat,
        label: item.label || defaultLabel,
        date: new Date().toLocaleDateString()
      });

      done++;
      progressFill.style.width = (done / photoQueue.length * 100) + '%';
      progressText.textContent = `Uploading ${done} of ${photoQueue.length}...`;

      if (done === photoQueue.length) {
        savePhotos(photos);
        photoQueue = [];
        renderQueue();
        loadGallery();
        progressWrap.classList.remove('show');
        progressFill.style.width = '0%';
        btn.disabled = false;
        btn.textContent = 'Upload to Gallery';
        document.getElementById('uploadLabel').value = '';
        showAlert('success', `${done} photo${done > 1 ? 's' : ''} uploaded! Click "Export gallery.html" to apply to your live site.`);
      }
    }, i * 50);
  });
}

// ─── STORAGE ───
function getPhotos() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function savePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

function deletePhoto(id) {
  if (!confirm('Delete this photo?')) return;
  savePhotos(getPhotos().filter(p => p.id !== id));
  loadGallery();
  showAlert('success', 'Photo deleted.');
}

function clearAll() {
  if (!confirm('Delete ALL photos? This cannot be undone.')) return;
  savePhotos([]);
  loadGallery();
  showAlert('success', 'All photos cleared.');
}

// ─── GALLERY ───
function loadGallery() {
  const photos = getPhotos();
  const lvp = photos.filter(p => p.cat === 'lvp').length;
  const hw = photos.filter(p => p.cat === 'hardwood').length;

  document.getElementById('totalCount').textContent = photos.length;
  document.getElementById('lvpCount').textContent = lvp;
  document.getElementById('hwCount').textContent = hw;
  document.getElementById('galleryCount').textContent = photos.length;

  const grid = document.getElementById('galleryGrid');

  if (photos.length === 0) {
    grid.innerHTML = '<div class="empty-state">No photos yet — upload your first photo above</div>';
    return;
  }

  grid.innerHTML = photos.map(p => `
    <div class="gallery-admin-item">
      <img src="${p.src}" alt="${p.label}">
      <div class="item-overlay">
        <div class="cat-label">${
          p.cat === 'lvp' ? 'LVP / Vinyl'
          : p.cat === 'hardwood' ? 'Hardwood'
          : p.cat === 'laminate' ? 'Laminate'
          : 'Carpet'
        }</div>
        <div class="item-lbl">${p.label}</div>
        <button class="delete-btn" onclick="deletePhoto(${p.id})">🗑 Delete</button>
      </div>
    </div>
  `).join('');
}

// ─── EXPORT ───
function exportGallery() {
  const photos = getPhotos();
  if (photos.length === 0) {
    showAlert('error', 'No photos to export.');
    return;
  }

  showAlert('success', 'Generating export file... download will start shortly.');

  setTimeout(() => {
    const items = photos.map(p =>
      `  {src:"${p.src}",cat:"${p.cat}",label:"${p.label}"}`
    ).join(',\n');

    const content = `// ORM Flooring — Gallery Photos Export
// Generated: ${new Date().toLocaleString()}
// 
// INSTRUCTIONS:
// 1. Open gallery.html in VS Code
// 2. Find the line: const PHOTOS=[
// 3. Replace everything from "const PHOTOS=[" to the closing "];"
// 4. Paste this entire block instead
// 5. Save, commit and push to GitHub

const PHOTOS=[
${items}
];`;

    const blob = new Blob([content], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gallery-photos-export.js';
    a.click();
  }, 300);
}

// ─── ALERT ───
function showAlert(type, msg) {
  const box = document.getElementById('alertBox');
  box.className = `alert ${type}`;
  box.textContent = msg;
  setTimeout(() => {
    box.className = 'alert';
    box.style.display = 'none';
  }, 5000);
}
