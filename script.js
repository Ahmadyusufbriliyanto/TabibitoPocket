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

// --- 1. GET DATA AWAL (DARI API ASLI) ---
async function fetchDevices() {
    try {
        const response = await fetch(`${API_URL}?limit=30`);
        if (!response.ok) throw new Error("Gagal mengambil data dari API DummyJSON.");
        
        const data = await response.json();
        
        // Memetakan data asli dari API masuk ke dalam array inventory
        // Dikalikan 16000 untuk konversi USD ke perkiraan Rupiah
        inventory = data.products.map(product => ({
            id: product.id,
            title: product.title,
            price: Math.round(product.price * 16000), 
            category: product.category
        }));

        renderDOM();
    } catch (error) {
        showUIError(error.message);
        listContainer.innerHTML = `<div class="empty-state"><p>Gagal memuat data inventaris dari API.</p></div>`;
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
            // Pengaman: Hanya kirim PUT ke server jika ID milik API asli (ID <= 100)
            if (editingId <= 100) {
                const response = await fetch(`${API_URL}/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) throw new Error("Gagal menyimpan perubahan ke server.");
                await response.json(); 
            }

            // Selalu perbarui state lokal agar UI berubah secara real-time
            inventory = inventory.map(item => item.id === editingId ? { ...item, ...payload } : item);
            showToast("Perubahan parameter hardware berhasil disimpan.");
            resetForm();
        } else {
            // Logika POST ke API untuk simulasi penambahan data baru
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Gagal mendaftarkan device baru ke sistem.");
            await response.json();

            // ID menggunakan berbasis waktu (Date.now()) untuk entri data lokal baru
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
        // Pengaman: Hanya kirim DELETE ke server jika ID berasal dari API asli (ID <= 100)
        if (id <= 100) {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Gagal menghapus data ID: ${id} dari server.`);
            await response.json();
        }

        // Hapus item dari array lokal (berlaku untuk ID bawaan maupun ID baru berbasis waktu)
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

    // Update Daftar Inventaris di UI
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

// --- EVENT LISTENERS ---
form.addEventListener('submit', handleFormSubmit);
cancelBtn.addEventListener('click', () => { resetForm(); hideUIError(); });
document.addEventListener('DOMContentLoaded', fetchDevices);
