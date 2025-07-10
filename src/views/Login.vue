<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)
const showForgotPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

const canSubmit = computed(() => {
  return username.value.trim() && password.value.trim()
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const validateForm = () => {
  if (!username.value.trim()) {
    error.value = 'Username tidak boleh kosong'
    return false
  }
  
  if (!password.value.trim()) {
    error.value = 'Password tidak boleh kosong'
    return false
  }
  
  if (password.value.length < 3) {
    error.value = 'Password minimal 3 karakter'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (username.value.toLowerCase() === 'admin' && password.value === '12345') {
      userStore.login(username.value)

      if (rememberMe.value) {
        // Utk fungsi ingat saya
      }

      router.push('/')
    } else {
      error.value = 'Username atau password yang Anda masukkan salah. Silakan coba lagi.'
    }
  } catch (err) {
    error.value = 'Terjadi kesalahan sistem. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Inisialisasi jika perlu
})
</script>

<template>
  <div class="login-card">
    <div class="login-header">
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"/>
          <path d="M4.5 19.5c.621-.621 1.125-1.375 1.5-2.25s.75-1.875.75-3c0-2.25-1.5-4.5-4.5-4.5s-4.5 2.25-4.5 4.5c0 1.125.375 2.125.75 3s.879 1.629 1.5 2.25"/>
          <path d="M19.5 4.5c-.621.621-1.125 1.375-1.5 2.25s-.75 1.875-.75 3c0 2.25 1.5 4.5 4.5 4.5s4.5-2.25 4.5-4.5c0-1.125-.375-2.125-.75-3s-.879-1.629-1.5-2.25"/>
        </svg>
      </div>
      <h2>Management System Apotacare</h2>
      <p class="subtitle">Masuk untuk mengakses dashboard Apotacare</p>
    </div>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <div class="input-container">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Masukkan username Anda"
            :class="{ 'error-input': error && !username }"
            :disabled="loading"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-container">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Masukkan password Anda"
            :class="{ 'error-input': error && !password }"
            :disabled="loading"
            required
          />
          <button
            type="button"
            class="password-toggle"
            @click="togglePassword"
            :disabled="loading"
          >
            <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.26A8.2 8.2 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.35"/>
              <path d="M1 1l22 22"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <div class="remember-forgot">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" :disabled="loading">
            <span class="checkmark"></span>
            Ingat saya
          </label>
          <a href="#" class="forgot-password" @click.prevent="showForgotPassword = true">
            Lupa password?
          </a>
        </div>
      </div>
      
      <button type="submit" class="login-btn" :disabled="loading || !canSubmit">
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else class="btn-content">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10,17 15,12 10,7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          {{ loading ? 'Memproses...' : 'Masuk ke Sistem' }}
        </span>
      </button>
    </form>
    
    <div v-if="error" class="error-message">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <div class="error-content">
        <strong>Login Gagal</strong>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
  
  <div v-if="showForgotPassword" class="forgot-modal">
    <div class="modal-content">
      <h3>Reset Password</h3>
      <p>Hubungi administrator untuk reset password</p>
      <button @click="showForgotPassword = false" class="close-btn">Tutup</button>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(43, 88, 118, 0.15);
  padding: 1.3rem;
  width: 1000%;
  max-width: 440px;
  margin: 40px auto;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: #4fd1c5;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #4fd1c5, #81e6d9);
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin: 0 auto 1.25rem;
  box-shadow: 0 10px 25px rgba(43, 88, 118, 0.3);
}

.logo-icon {
  width: 30px;
  height: 30px;
  color: white;
}

h2 {
  color: #4fd1c5;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1a202c;
  font-weight: 600;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #81e6d9;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e0e7ff;
  border-radius: 10px;
  background: #f8fafc;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  transition: border 0.3s ease;
}

input:focus {
  outline: none;
  background: #ffffff;
  border-color: #4fd1c5;
  box-shadow: 0 0 0 3px rgba(79, 209, 197, 0.25);
}

input.error-input {
  border-color: #ef4444;
  background: #fef2f2;
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
}

.password-toggle:hover:not(:disabled) {
  color: #4e4376;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
}

.remember-forgot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.remember-me {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
}

.remember-me input:checked + .checkmark {
  background: #4fd1c5;
  border-color: #4fd1c5;
}

.remember-me input:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 3px;
  height: 6px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-password {
  font-size: 0.85rem;
  color: #4fd1c5;
  font-weight: 500;
  text-decoration: none;
}

.forgot-password:hover {
  color: #81e6d9;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(to right, #4fd1c5, #81e6d9);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.login-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  opacity: 0.8;
}

.login-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(43, 88, 118, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  gap: 0.75rem;
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  border: 1px solid #fecaca;
  animation: slideIn 0.3s ease;
}

.error-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-content strong {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.forgot-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.modal-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4fd1c5;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.close-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  background: linear-gradient(to right, #4fd1c5, #81e6d9);
  color: white;
  cursor: pointer;
  transition: 0.3s ease;
}

.close-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(43, 88, 118, 0.3);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .remember-forgot {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .modal-content {
    padding: 1.5rem;
  }
}
</style>
