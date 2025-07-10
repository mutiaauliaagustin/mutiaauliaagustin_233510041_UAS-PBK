import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useUserStore } from '../src/stores/user'

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia()) 
  })

  it('default state harus false', () => {
    const store = useUserStore()
    expect(store.isLoggedIn).toBe(false)
    expect(store.username).toBe('')
  })

  it('login harus set isLoggedIn = true dan simpan username', () => {
    const store = useUserStore()
    store.login('admin')
    expect(store.isLoggedIn).toBe(true)
    expect(store.username).toBe('admin')
  })

  it('logout harus reset semua', () => {
    const store = useUserStore()
    store.login('admin')
    store.logout()
    expect(store.isLoggedIn).toBe(false)
    expect(store.username).toBe('')
  })
})
