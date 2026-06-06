const API_URL = 'https://dummyjson.com/products';

let products = [];
let editingId = null;

// Mengambil Elemen DOM
const form = document.getElementById('product-form');
const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const categoryInput = document.getElementById('product-category');
const idInput = document.getElementById('product-id');
const listContainer = document.getElementById('product-list');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');

// Elemen Error UI (Sesuai Ketentuan C)
const errorContainer = document.getElementById('error-container');
const errorMessage = document.getElementById('error-message');
const toastEl = document.getElementById('toast');

// --- FUNGSI BANTUAN UI ---
function showUIError(msg) {
    errorMessage.textContent = msg;
    errorContainer.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideUIError() {
    errorContainer.style.display = 'none';
}

function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

// --- 1. GET DATA (READ) ---
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}?limit=10`);
        if (!response.ok) throw new Error("Gagal mengambil data dari API DummyJSON.");
        
        const data = await response.json();
        // Menggunakan data asli dari server DummyJSON
        products = data.products; 
        renderDOM();
    } catch (error) {
        showUIError(error.message);
        listContainer.innerHTML = `<div class="empty-state"><p>Gagal memuat data produk.</p></div>`;
    }
}

// --- 2. POST (TAMBAH) & PUT (EDIT) DATA ---
async function handleFormSubmit(e) {
    e.preventDefault();
    hideUIError();

    const payload = {
        title: nameInput.value.trim(),
        price: parseFloat(priceInput.value),
        category: categoryInput.value.trim() || 'General'
    };

    try {
        if (editingId) {
            // METODE: PUT (Sesuai Ketentuan A)
            const response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Gagal menyimpan perubahan ke server.");
            
            const updatedProduct = await response.json();

            // Manipulasi DOM (Sesuai Ketentuan B: Tanpa Reload)
            products = products.map(item => item.id === editingId ? { ...item, ...payload } : item);
            showToast("Produk berhasil diperbarui!");
            resetForm();
        } else {
            // METODE: POST (Sesuai Ketentuan A)
            const response = await fetch(`${API_URL}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Gagal menambahkan produk baru ke sistem.");

            const newProduct = await response.json();

            // Penyesuaian karena DummyJSON mock API sering mengembalikan ID yang sama untuk POST baru
            newProduct.id = Date.now(); 

            // Manipulasi DOM (Sesuai Ketentuan B: Tanpa Reload)
            products.unshift(newProduct); 
            showToast("Produk baru berhasil ditambahkan!");
            resetForm();
        }
        renderDOM();
    } catch (error) {
        // Sesuai Ketentuan C: Tampil di layar web
        showUIError(error.message);
    }
}

// --- 3. DELETE DATA ---
async function deleteProduct(id, title) {
    if (!confirm(`Yakin ingin menghapus produk "${title}"?`)) return;
    hideUIError();

    try {
        // METODE: DELETE (Sesuai Ketentuan A)
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE' 
        });
        if (!response.ok) throw new Error(`Gagal menghapus data ID: ${id} dari server.`);

        // Manipulasi DOM (Sesuai Ketentuan B: Tanpa Reload)
        products = products.filter(item => item.id !== id);
        renderDOM();
        showToast("Produk berhasil dihapus.");
    } catch (error) {
        // Sesuai Ketentuan C: Tampil di layar web
        showUIError(error.message);
    }
}

// --- 4. RENDER DOM DINAMIS ---
function renderDOM() {
    if (products.length === 0) {
        listContainer.innerHTML = `<div class="empty-state"><p>Tidak ada produk yang tersedia.</p></div>`;
        return;
    }

    listContainer.innerHTML = products.map(item => `
        <div class="product-card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 5px 0;">${escapeHtml(item.title)}</h4>
                    <span style="font-size: 0.85em; background: #eee; padding: 2px 6px; border-radius: 4px;">${escapeHtml(item.category)}</span>
                    <span style="font-weight: bold; color: #2563eb; margin-left: 10px;">$${item.price}</span>
                </div>
                <div>
                    <button onclick="prepareEdit(${item.id})" style="padding: 5px 10px; background: #f59e0b; border: none; border-radius: 4px; cursor: pointer;">Edit</button>
                    <button onclick="deleteProduct(${item.id}, '${escapeHtml(item.title).replace(/'/g, "\\'")}')" style="padding: 5px 10px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">Hapus</button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- HELPER FORM & SECURITY ---
function prepareEdit(id) {
    hideUIError();
    const item = products.find(i => i.id === id);
    if (!item) return;

    editingId = id;
    nameInput.value = item.title;
    priceInput.value = item.price;
    categoryInput.value = item.category || '';

    formTitle.textContent = "Edit Data Produk";
    submitBtn.textContent = "Simpan Perubahan";
    cancelBtn.style.display = "inline-block";
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    form.reset();
    editingId = null;
    formTitle.textContent = "Tambah Produk Baru";
    submitBtn.textContent = "Tambah Produk";
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
if (cancelBtn) cancelBtn.addEventListener('click', () => { resetForm(); hideUIError(); });

// Inisialisasi Aplikasi Sesuai Ketentuan D (async/await)
document.addEventListener('DOMContentLoaded', fetchProducts);
