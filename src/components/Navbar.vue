<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const isDarkMode = ref(true)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="sidebar">
    <div class="sidebar-header">
      <h2 class="logo">Manajemen Apotacare</h2>
    </div>

    <div class="sidebar-menu">
      <ul class="menu-list">
        <li class="menu-item">
          <RouterLink to="/" class="menu-link">
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span>Dashboard</span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/obat" class="menu-link">
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span>Obat</span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/persediaan" class="menu-link">
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Persediaan</span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/transaksi" class="menu-link">
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
              <polyline points="9,11 9,4 15,4 15,11"/>
              <line x1="9" y1="7" x2="15" y2="7"/>
            </svg>
            <span>Transaksi</span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink to="/laporan" class="menu-link">
            <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
            <span>Laporan</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-details">
          <span class="user-name">Admin</span>
          <span class="user-role">Administrator</span>
        </div>
      </div>
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDarkMode ? '☀️ Light' : '🌙 Dark' }}
      </button>
      <button @click="logout" class="logout-btn">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

:root[data-theme='light'] {
  --sidebar-bg: #e6fffa;
  --text: #1a202c;
  --highlight: #319795;
  --hover: #b2f5ea;
}

:root[data-theme='dark'] {
  --sidebar-bg: linear-gradient(90deg, #2c7a7b, #285e61);
  --text: #ffffff;
  --highlight: #81e6d9;
  --hover: rgba(255, 255, 255, 0.1);
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 260px;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  color: var(--text);
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  color: var(--text);
}

.menu-list {
  list-style: none;
  padding: 1.5rem 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 0.25rem;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--text);
  text-decoration: none;
  transition: 0.3s ease;
  border-radius: 0 6px 6px 0;
}

.menu-link:hover {
  background-color: var(--hover);
  transform: translateX(5px);
}

.menu-link.router-link-active {
  background-color: var(--hover);
  font-weight: 600;
  box-shadow: inset 3px 0 0 var(--highlight);
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.user-info {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.08);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--text);
}

.user-role {
  font-size: 0.75rem;
  opacity: 0.7;
}

.logout-btn, .theme-toggle {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.6rem;
  background-color: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 6px;
  color: var(--text);
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s ease;
}

.logout-btn:hover,
.theme-toggle:hover {
  background-color: var(--hover);
}

.logout-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.5rem;
}
</style>
