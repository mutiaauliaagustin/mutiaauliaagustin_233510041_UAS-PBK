<script setup>
import { ref, computed, onMounted } from 'vue'

const daftarObat = ref([])
const obatDipilih = ref('')
const jumlah = ref(1)

const fetchObat = async () => {
  const res = await fetch('http://localhost:3001/obat')
  daftarObat.value = await res.json()
}

const total = computed(() => {
  return obatDipilih.value ? obatDipilih.value.harga * jumlah.value : 0
})

const buatTransaksi = async () => {
  if (!obatDipilih.value || jumlah.value < 1) return

  const transaksiBaru = {
    tanggal: new Date().toISOString().split('T')[0],
    obat: obatDipilih.value.nama,
    jumlah: jumlah.value,
    total: total.value
  }

  await fetch('http://localhost:3001/transaksi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaksiBaru)
  })

  obatDipilih.value = ''
  jumlah.value = 1
  alert('Transaksi berhasil disimpan!')
}

onMounted(() => {
  fetchObat()
})
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Transaksi Pembelian</h2>
      <p class="subtitle">Catat transaksi pembelian obat</p>
    </div>

    <div class="form-section">
      <form @submit.prevent="buatTransaksi" class="form-tambah">
        <div class="form-row">
          <div class="form-group">
            <label for="obat">Pilih Obat <span class="required">*</span></label>
            <select id="obat" v-model="obatDipilih" required>
              <option disabled value="">-- Pilih Obat --</option>
              <option v-for="item in daftarObat" :key="item.id" :value="item">
                {{ item.nama }} - Rp{{ item.harga }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="jumlah">Jumlah <span class="required">*</span></label>
            <input id="jumlah" type="number" v-model.number="jumlah" min="1" />
          </div>
        </div>

        <p class="total">Total Harga: <strong>Rp{{ total }}</strong></p>

        <button type="submit" class="btn-primary">💾 Simpan Transaksi</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-left: 260px;
  padding: 80px 40px 20px;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
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

.subtitle {
  opacity: 0.9;
  font-size: 1rem;
}

.form-section {
  max-width: 1000px;
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

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text);
}

.total {
  text-align: right;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 10px;
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

@media (max-width: 768px) {
  .container {
    margin-left: 0;
    padding: 100px 15px 40px;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>
