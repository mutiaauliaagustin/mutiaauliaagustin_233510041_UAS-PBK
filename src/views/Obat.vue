<script setup>
import { ref, onMounted } from 'vue'

const daftarObat = ref([])
const nama = ref('')
const stok = ref('')
const harga = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const clearMessages = () => {
  setTimeout(() => {
    error.value = ''
    success.value = ''
  }, 5000)
}

const fetchObat = async () => {
  try {
    loading.value = true
    const res = await fetch('https://jsonserver-production-430e.up.railway.app/obat')
    daftarObat.value = await res.json()
  } catch (err) {
    error.value = 'Gagal memuat data obat: ' + err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

const tambahObat = async () => {
  if (!nama.value.trim()) {
    error.value = 'Nama obat harus diisi'
    return clearMessages()
  }
  const stokNumber = parseInt(stok.value)
  const hargaNumber = parseInt(harga.value)
  if (isNaN(stokNumber) || stokNumber < 1) {
    error.value = 'Stok harus angka minimal 1'
    return clearMessages()
  }
  if (isNaN(hargaNumber) || hargaNumber < 1) {
    error.value = 'Harga harus angka minimal 1'
    return clearMessages()
  }

  try {
    loading.value = true
    const res = await fetch('https://jsonserver-production-430e.up.railway.app/obat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: nama.value.trim(),
        stok: stokNumber,
        harga: hargaNumber
      })
    })
    if (!res.ok) throw new Error('Gagal menambah')
    nama.value = ''
    stok.value = ''
    harga.value = ''
    success.value = 'Obat berhasil ditambahkan!'
    fetchObat()
    clearMessages()
  } catch (err) {
    error.value = 'Gagal menambah obat: ' + err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

const hapusObat = async (id) => {
  if (!confirm('Yakin mau hapus?')) return
  try {
    loading.value = true
    const res = await fetch(`https://jsonserver-production-430e.up.railway.app/obat${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Gagal hapus')
    success.value = 'Obat berhasil dihapus'
    fetchObat()
    clearMessages()
  } catch (err) {
    error.value = 'Gagal hapus: ' + err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

onMounted(fetchObat)
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Manajemen Obat</h2>
      <p class="subtitle">Kelola data obat dengan mudah</p>
    </div>

    <div v-if="error" class="message error-message">
      <i class="icon">⚠️</i> {{ error }}
    </div>
    <div v-if="success" class="message success-message">
      <i class="icon">✅</i> {{ success }}
    </div>
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Memuat data...</span>
    </div>

    <div class="form-section">
      <h3>Tambah Obat Baru</h3>
      <form @submit.prevent="tambahObat" class="form-tambah">
        <div class="form-row">
          <div class="form-group">
            <label for="nama">Nama Obat <span class="required">*</span></label>
            <input id="nama" v-model="nama" type="text" placeholder="Masukkan nama obat" required :disabled="loading" />
          </div>
          <div class="form-group">
            <label for="stok">Stok <span class="required">*</span></label>
            <input id="stok" v-model="stok" type="number" placeholder="Jumlah stok" required :disabled="loading" />
          </div>
          <div class="form-group">
            <label for="harga">Harga <span class="required">*</span></label>
            <input id="harga" v-model="harga" type="number" placeholder="Harga obat" required :disabled="loading" />
          </div>
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Menambah...</span>
          <span v-else>Tambah Obat</span>
        </button>
      </form>
    </div>

    <div class="list-section">
      <div class="list-header">
        <h3>Daftar Obat</h3>
      </div>

      <div v-if="daftarObat.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <h4>Belum ada obat</h4>
        <p>Tambahkan obat pertama Anda menggunakan form di atas</p>
      </div>

      <div v-else class="obat-grid">
        <div v-for="item in daftarObat" class="obat-card">
          <div class="obat-info">
            <h4 class="obat-nama">{{ item.nama }}</h4>
            <div class="obat-details">
              <span class="stok">📦 Stok: {{ item.stok }}</span>
              <span class="harga">💰 {{ formatCurrency(item.harga) }}</span>
            </div>
          </div>
          <button class="btn-hapus" @click="hapusObat(item.id)" :disabled="loading">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root[data-theme='light'] {
  --bg: #f0fdfa;
  --text: #1a202c;
  --card-bg: #ffffff;
  --card-shadow: rgba(0, 0, 0, 0.05);
  --border: #e2e8f0;
  --primary: #38b2ac;
  --primary-hover: #319795;
  --danger: #e53e3e;
  --danger-hover: #c53030;
}

:root[data-theme='dark'] {
  --bg: #1a202c;
  --text: #f0fdfc;
  --card-bg: #2d3748;
  --card-shadow: rgba(255, 255, 255, 0.05);
  --border: #4a5568;
  --primary: #38b2ac;
  --primary-hover: #319795;
  --danger: #e53e3e;
  --danger-hover: #c53030;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
}

.container {
  margin-left: 260px;
  padding: 80px 20px 40px;
  min-height: 100vh;
}

.header {
  background: var(--primary);
  color: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: center;
}

.message {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 500;
}

.error-message {
  background: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #3c763d;
  border: 1px solid #cfc;
}

.loading {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: var(--text);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #eee;
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}

.form-section,
.list-section {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--card-shadow);
  margin-bottom: 40px;
  border: 1px solid var(--border);
  color: var(--text);
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 600;
  color: var(--text);
}

.form-group input {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text);
}

.required {
  color: var(--danger);
}

.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.list-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.counter {
  background: var(--primary-hover);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.obat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.obat-card {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.3s ease;
}

.obat-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--card-shadow);
}

.obat-nama {
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}

.obat-details {
  font-size: 0.95rem;
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-hapus {
  background: var(--danger);
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-hapus:hover {
  background: var(--danger-hover);
}

.empty-state {
  text-align: center;
  color: var(--text);
  padding: 40px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .container {
    margin-left: 0;
    padding: 100px 15px 40px;
  }

  .form-row {
    flex-direction: column;
  }

  .obat-grid {
    grid-template-columns: 1fr;
  }

  .btn-hapus {
    align-self: flex-end;
  }
}
</style>