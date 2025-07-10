<script setup>
import { ref, onMounted, computed } from 'vue'

const transaksi = ref([])

const fetchTransaksi = async () => {
  const res = await fetch('http://localhost:3001/transaksi')
  transaksi.value = await res.json()
}

onMounted(fetchTransaksi)

const totalTransaksi = computed(() => transaksi.value.length)
const totalItem = computed(() =>
  transaksi.value.reduce((sum, trx) => sum + trx.jumlah, 0)
)
const totalPendapatan = computed(() =>
  transaksi.value.reduce((sum, trx) => sum + trx.total, 0)
)
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Laporan Penjualan</h2>
      <p class="subtitle">Data transaksi yang telah dilakukan</p>
    </div>

    <div class="summary">
      <div class="summary-box">
        <h3>{{ totalTransaksi }}</h3>
        <p>Total Transaksi</p>
      </div>
      <div class="summary-box">
        <h3>{{ totalItem }}</h3>
        <p>Total Item Terjual</p>
      </div>
      <div class="summary-box">
        <h3>Rp{{ totalPendapatan }}</h3>
        <p>Total Pendapatan</p>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="laporan-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Tanggal</th>
            <th>Nama Obat</th>
            <th>Jumlah</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(trx, index) in transaksi" :key="trx.id">
            <td>{{ index + 1 }}</td>
            <td>{{ trx.tanggal }}</td>
            <td>{{ trx.obat }}</td>
            <td>{{ trx.jumlah }}</td>
            <td>Rp{{ trx.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-left: 260px;
  padding: 80px 30px 40px;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Poppins', sans-serif;
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

.summary {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.summary-box {
  background: var(--card-bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 2px 8px var(--card-shadow);
}

.summary-box h3 {
  font-size: 1.8rem;
  margin-bottom: 5px;
  color: var(--primary);
}

.summary-box p {
  font-size: 0.95rem;
  color: var(--text);
}

.table-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  background: var(--card-bg);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px var(--card-shadow);
  border: 1px solid var(--border);
  overflow-x: auto;
}

.laporan-table {
  width: 100%;
  border-collapse: collapse;
}

.laporan-table th,
.laporan-table td {
  text-align: left;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.laporan-table th {
  background: var(--secondary);
  color: white;
  font-weight: 600;
}

.laporan-table tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.02);
}

.laporan-table tr:hover {
  background: rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .container {
    margin-left: 0;
    padding: 100px 15px 40px;
  }

  .header h2 {
    font-size: 1.5rem;
  }

  .summary {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
