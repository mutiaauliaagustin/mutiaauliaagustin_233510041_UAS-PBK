<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const totalObat = ref(0)
const totalPersediaan = ref(0)
const totalTransaksi = ref(0)
const loading = ref(true)
const error = ref('')
const success = ref('')

const clearMessages = () => {
  setTimeout(() => {
    error.value = ''
    success.value = ''
  }, 5000)
}

const checkServerStatus = async () => {
  try {
    const response = await fetch('https://jsonserver-production-430e.up.railway.app/')
    if (response.ok) {
      success.value = 'Server aktif! Memuat ulang data...'
      clearMessages()
      setTimeout(() => fetchData(), 2000)
    } else {
      error.value = 'Server merespons tapi ada masalah: ' + response.status
      clearMessages()
    }
  } catch (err) {
    error.value = 'Server tidak dapat diakses. Pastikan server berjalan di https://jsonserver-production-430e.up.railway.app/'
    console.error(err)
    clearMessages()
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const [resObat, resPersediaan, resTransaksi] = await Promise.all([
      fetch('https://jsonserver-production-430e.up.railway.app/obat'),
      fetch('https://jsonserver-production-430e.up.railway.app/persediaan'),
      fetch('https://jsonserver-production-430e.up.railway.app/transaksi')
    ])
    if (!resObat.ok || !resPersediaan.ok || !resTransaksi.ok) throw new Error('Gagal memuat beberapa data')

    const [dataObat, dataPersediaan, dataTransaksi] = await Promise.all([
      resObat.json(),
      resPersediaan.json(),
      resTransaksi.json()
    ])
    totalObat.value = dataObat.length
    totalPersediaan.value = dataPersediaan.length
    totalTransaksi.value = dataTransaksi.length
    success.value = 'Data berhasil dimuat!'
    clearMessages()
  } catch (err) {
    error.value = 'Gagal memuat data: ' + err.message
    console.error(err)
    clearMessages()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const savedTheme = document.documentElement.getAttribute('data-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
  fetchData()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Dashboard Apotek</h2>
      <p class="subtitle">Ringkasan statistik apotek</p>
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

    <div class="cards-container">
      <div class="card">
        <div class="card-icon">💊</div>
        <div class="card-content">
          <h3>Total Obat</h3>
          <p class="card-number">{{ totalObat }}</p>
          <p class="card-label">Jenis obat tersedia</p>
        </div>
        <div class="card-footer">🔄 Update terakhir: Hari ini</div>
      </div>

      <div class="card">
        <div class="card-icon">📦</div>
        <div class="card-content">
          <h3>Total Persediaan</h3>
          <p class="card-number">{{ totalPersediaan }}</p>
          <p class="card-label">Stok obat tersimpan</p>
        </div>
        <div class="card-footer">🔄 Update terakhir: Hari ini</div>
      </div>

      <div class="card">
        <div class="card-icon">🛒</div>
        <div class="card-content">
          <h3>Total Transaksi</h3>
          <p class="card-number">{{ totalTransaksi }}</p>
          <p class="card-label">Transaksi tercatat</p>
        </div>
        <div class="card-footer">🔄 Update terakhir: Hari ini</div>
      </div>

      <RouterLink to="/transaksi" class="card add-report">
        <div class="card-icon">📝</div>
        <div class="card-content">
          <h3>Tambah Transaksi</h3>
        </div>
        <div class="card-footer"> ➕ Klik untuk menambahkan transaksi</div>
      </RouterLink>
    </div>

    <div class="quick-actions">
      <h3>⚡ Aksi Cepat</h3>
      <div class="action-buttons">
        <RouterLink to="/obat" class="btn-primary">
          <span>➕ Tambah Obat Baru</span>
        </RouterLink>
        <RouterLink to="/laporan" class="btn-primary">
          <span>📊 Lihat Laporan</span>
        </RouterLink>
        <RouterLink to="/persediaan" class="btn-primary">
          <span>📦 Kelola Persediaan</span>
        </RouterLink>
      </div>
    </div>

    <div class="server-check">
      <p>Jika data tidak muncul, pastikan server berjalan:</p>
      <button @click="checkServerStatus" class="btn-debug">🔌 Periksa Koneksi Server</button>
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
  --primary: #4fd1c5;
  --secondary: #81e6d9;
}

:root[data-theme='dark'] {
  --bg: #1a202c;
  --text: #f0fdfc;
  --card-bg: #2d3748;
  --card-shadow: rgba(255, 255, 255, 0.05);
  --border: #4a5568;
  --primary: #38b2ac;
  --secondary: #319795;
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

.header h2 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.subtitle {
  opacity: 0.9;
  font-size: 1.1rem;
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

.icon {
  margin-right: 10px;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px;
  font-size: 1.1rem;
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

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.card.add-report {
  background: var(--card-bg);
  color: var(--text);
  border: 2px dashed var(--primary);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
}

.card.add-report:hover {
  background-color: var(--primary);
  color: white;
  transform: scale(1.02);
}

.card {
  background: var(--card-bg);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px var(--card-shadow);
  padding: 25px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.card-number {
  font-size: 2.4rem;
  font-weight: 700;
  margin: 10px 0;
}

.card-label {
  font-size: 0.95rem;
  opacity: 0.7;
}

.card-footer {
  border-top: 1px solid var(--border);
  padding-top: 10px;
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 15px;
}

.quick-actions {
  background: var(--card-bg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px var(--card-shadow);
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-tertiary,
.btn-debug {
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
  color: white;
}

.btn-primary {
  background: var(--primary);
}
.btn-secondary {
  background: var(--secondary);
}
.btn-tertiary {
  background: #f6ad55;
}
.btn-debug {
  background: #edf2f7;
  color: #1a202c;
}

.btn-primary:hover,
.btn-secondary:hover,
.btn-tertiary:hover,
.btn-debug:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.server-check {
  background: var(--card-bg);
  border: 1px solid var(--border);
  box-shadow: 0 2px 10px var(--card-shadow);
  padding: 20px;
  text-align: center;
  border-radius: 12px;
  color: var(--text);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .container {
    margin-left: 0;
    padding: 100px 15px 40px;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary, .btn-secondary, .btn-tertiary {
    width: 100%;
    justify-content: center;
  }
}
</style>