<script setup>
import { ref, onMounted } from 'vue'

const daftarPersediaan = ref([])
const nama = ref('')
const jumlah = ref('')
const satuan = ref('')
const lokasi = ref('')
const kadaluarsa = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const clearMessages = () => {
  setTimeout(() => {
    error.value = ''
    success.value = ''
  }, 5000)
}

const fetchPersediaan = async () => {
  try {
    loading.value = true
    const res = await fetch('https://jsonserver-production-430e.up.railway.app/persediaan')
    daftarPersediaan.value = await res.json()
  } catch (err) {
    error.value = 'Gagal memuat data: ' + err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

const tambahPersediaan = async () => {
  if (!nama.value || !jumlah.value || !satuan.value || !lokasi.value || !kadaluarsa.value) {
    error.value = 'Semua kolom wajib diisi!'
    return clearMessages()
  }

  try {
    loading.value = true
    const res = await fetch('https://jsonserver-production-430e.up.railway.app/persediaan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nama: nama.value.trim(),
        jumlah: parseInt(jumlah.value),
        satuan: satuan.value,
        lokasi: lokasi.value,
        kadaluarsa: kadaluarsa.value
      })
    })
    if (!res.ok) throw new Error('Gagal menambahkan data')
    success.value = 'Persediaan berhasil ditambahkan!'
    nama.value = ''
    jumlah.value = ''
    satuan.value = ''
    lokasi.value = ''
    kadaluarsa.value = ''
    fetchPersediaan()
    clearMessages()
  } catch (err) {
    error.value = err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

const hapusPersediaan = async (id) => {
  if (!confirm('Yakin ingin menghapus item ini?')) return
  try {
    loading.value = true
    const res = await fetch(`https://jsonserver-production-430e.up.railway.app/persediaan${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Gagal menghapus data')
    success.value = 'Data berhasil dihapus!'
    fetchPersediaan()
    clearMessages()
  } catch (err) {
    error.value = err.message
    clearMessages()
  } finally {
    loading.value = false
  }
}

onMounted(fetchPersediaan)
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Manajemen Persediaan</h2>
      <p class="subtitle">Kelola stok lengkap obat di apotek</p>
    </div>

    <div v-if="error" class="message error-message">⚠️ {{ error }}</div>
    <div v-if="success" class="message success-message">✅ {{ success }}</div>
    <div v-if="loading" class="loading"><div class="spinner"></div> Memuat data...</div>

    <div class="form-section">
      <h3>Tambah Persediaan</h3>
      <form @submit.prevent="tambahPersediaan" class="form-tambah">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Obat</label>
            <input v-model="nama" type="text" required />
          </div>
          <div class="form-group">
            <label>Jumlah</label>
            <input v-model="jumlah" type="number" required />
          </div>
          <div class="form-group">
            <label>Satuan</label>
            <input v-model="satuan" type="text" required />
          </div>
          <div class="form-group">
            <label>Lokasi</label>
            <input v-model="lokasi" type="text" required />
          </div>
          <div class="form-group">
            <label>Kadaluarsa</label>
            <input v-model="kadaluarsa" type="date" required />
          </div>
        </div>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading">Menambah...</span>
          <span v-else>Tambah Persediaan</span>
        </button>
      </form>
    </div>

    <div class="list-section">
      <div class="list-header">
        <h3>Daftar Persediaan</h3>
      </div>

      <div v-if="daftarPersediaan.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <h4>Belum ada data</h4>
        <p>Tambahkan data pertama Anda menggunakan form di atas</p>
      </div>

      <div v-else class="obat-grid">
        <div v-for="item in daftarPersediaan" :key="item.id" class="obat-card">
          <div class="obat-info">
            <h4 class="obat-nama">{{ item.nama }}</h4>
            <div class="obat-details">
              <span>📦 {{ item.jumlah }} {{ item.satuan }}</span>
              <span>📍 {{ item.lokasi }}</span>
              <span>⏳ {{ item.kadaluarsa }}</span>
            </div>
          </div>
          <button class="btn-hapus" @click="hapusPersediaan(item.id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap');

.container {
  margin-left: 260px;
  padding: 80px 20px 40px;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
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
  margin: 20px 0;
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
}

.error-message {
  background: #fee;
  color: #c00;
  border: 1px solid #fcc;
}

.success-message {
  background: #efe;
  color: #090;
  border: 1px solid #cfc;
}

.loading {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #ccc;
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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