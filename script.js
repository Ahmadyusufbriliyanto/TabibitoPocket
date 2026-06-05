const API_URL = 'https://dummyjson.com/products';

let inventory = [];
let editingId = null;

// Mengambil Elemen DOM
const form = document.getElementById('device-form');
const nameInput = document.getElementById('device-name');
const priceInput = document.getElementById('device-price');
const categoryInput = document.getElementById('device-category');
const idInput = document.getElementById('device-id');
const listContainer = document.getElementById('inventory-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

const statTotalDevices = document.getElementById('total-devices');
const statTotalValue = document.getElementById('total-value');

// Elemen Error UI
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const toastEl = document.getElementById('toast');

// --- HELPER FUNCTIONS ---
function showUIError(msg) {
    errorMessage.textContent = msg;
    errorContainer.style.display = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideUIError() {
    errorContainer.style.display = 'none';
}

function showToast(msg, isError = false) {
    toastEl.textContent = msg;
    toastEl.className = `toast show ${isError ? 'error' : ''}`;
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// --- 1. GET DATA AWAL ---
async function fetchDevices() {
    try {
        // Limit diubah menjadi 15 untuk mensimulasikan penarikan data yang lebih banyak
        const response = await fetch(`${API_URL}?limit=15`);
        if (!response.ok) throw new Error("Gagal mengambil data dari API DummyJSON.");
        
        // 15 Mock data khusus untuk inventaris mahasiswa IT
        inventory = [
            { id: 1, title: 'MacBook Pro M3 Max 14"', price: 65000000, category: 'Laptop' },
            { id: 2, title: 'Keychron Q1 Pro Wireless', price: 3200000, category: 'Keyboard' },
            { id: 3, title: 'LG UltraGear 27" 144Hz', price: 4500000, category: 'Monitor' },
            { id: 4, title: 'Logitech MX Master 3S', price: 1650000, category: 'Mouse' },
            { id: 5, title: 'Raspberry Pi 4 Model B 8GB', price: 1250000, category: 'IoT Lab' },
            { id: 6, title: 'Synology NAS DS220+', price: 5400000, category: 'Server & Storage' },
            { id: 7, title: 'SSD Samsung 990 PRO 2TB', price: 3100000, category: 'Komponen PC' },
            { id: 8, title: 'MikroTik RB750Gr3 hEX', price: 950000, category: 'Networking Lab' },
            { id: 9, title: 'Arduino Mega 2560 Kit', price: 450000, category: 'Mikrokontroler' },
            { id: 10, title: 'Sony WH-1000XM5 ANC', price: 5200000, category: 'Audio' },
            { id: 11, title: 'APC Back-UPS Pro 1500VA', price: 3800000, category: 'Power & Infra' },
            { id: 12, title: 'Elgato Stream Deck MK.2', price: 2500000, category: 'Productivity' },
            { id: 13, title: 'Wacom Intuos Pro Medium', price: 5800000, category: 'Design & HCI' },
            { id: 14, title: 'Cisco Catalyst 2960 Switch', price: 4200000, category: 'Networking Lab' },
            { id: 15, title: 'NVIDIA RTX 4070 Ti Super', price: 15500000, category: 'Komponen PC' }
        ];
        renderDOM();
    } catch (error) {
        showUIError(error.message);
        listContainer.innerHTML = `<div class="empty-state"><p>Gagal memuat data inventaris.</p></div>`;
    }
}

// --- 2. POST (TAMBAH) & PUT (EDIT) DATA ---
async function handleFormSubmit(e) {
    e.preventDefault();
    hideUIError();

    const payload = {
        title: nameInput.value.trim(),
        price: parseInt(priceInput.value, 10),
        category: categoryInput.value.trim() || 'Aksesoris IT'
    };

    try {
        if (editingId) {
            // Logika PUT
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Gagal menyimpan perubahan ke server.");

            inventory = inventory.map(item => item.id === editingId ? { ...item, ...payload } : item);
            showToast("Perubahan parameter hardware berhasil disimpan.");
            resetForm();
        } else {
            // Logika POST
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Gagal mendaftarkan device baru ke sistem.");

            const newDevice = {
                id: Date.now(), 
                title: payload.title,
                price: payload.price,
                category: payload.category
            };

            inventory.unshift(newDevice); 
            showToast("Gear baru berhasil ditambahkan ke inventaris!");
            resetForm();
        }
        renderDOM();
    } catch (error) {
        showUIError(error.message);
    }
}

// --- 3. DELETE DATA ---
async function deleteDevice(id, title) {
    if (!confirm(`Yakin ingin menghapus perangkat [ ${title} ] dari sistem?`)) return;
    hideUIError();

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Gagal menghapus data ID: ${id} dari server.`);

        inventory = inventory.filter(item => item.id !== id);
        renderDOM();
        showToast("Device berhasil dihapus secara permanen.");
    } catch (error) {
        showUIError(error.message);
    }
}

// --- 4. RENDER DOM (MENGHINDARI RELOAD) ---
function renderDOM() {
    // Update Kalkulasi Statistik
    statTotalDevices.textContent = inventory.length;
    const total = inventory.reduce((sum, item) => sum + item.price, 0);
    statTotalValue.textContent = formatRupiah(total);

    // Update Daftar Inventaris
    if (inventory.length === 0) {
        listContainer.innerHTML = `<div class="empty-state"><p>Inventaris laboratorium kosong.</p></div>`;
        return;
    }

    listContainer.innerHTML = inventory.map(item => `
        <div class="device-item">
            <div class="device-info">
                <h4>${escapeHtml(item.title)}</h4>
                <div class="device-meta">
                    <span class="badge-cat">${escapeHtml(item.category)}</span>
                    <span class="device-price">${formatRupiah(item.price)}</span>
                </div>
            </div>
            <div class="action-btns">
                <button class="btn-icon edit" onclick="prepareEdit(${item.id})" title="Edit Parameter">✏️</button>
                <button class="btn-icon delete" onclick="deleteDevice(${item.id}, '${escapeHtml(item.title).replace(/'/g, "\\'")}')" title="Hapus Perangkat">🗑️</button>
            </div>
        </div>
    `).join('');
}

// --- HELPER FORM & SECURITY ---
function prepareEdit(id) {
    hideUIError();
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    editingId = id;
    nameInput.value = item.title;
    priceInput.value = item.price;
    categoryInput.value = item.category;

    formTitle.textContent = "⚙️ Modifikasi Log Perangkat";
    submitBtn.textContent = "Simpan Pembaruan";
    cancelBtn.style.display = "block";
    
    // Scroll otomatis ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    form.reset();
    editingId = null;
    formTitle.textContent = "Tambahkan Gear Baru";
    submitBtn.textContent = "Simpan Data";
    cancelBtn.style.display = "none";
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, match => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[match]);
}

// Event Listeners
form.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', () => { resetForm(); hideUIError(); });
document.addEventListener('DOMContentLoaded', fetchDevices);