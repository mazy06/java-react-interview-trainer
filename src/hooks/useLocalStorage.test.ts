import { describe, expect, it, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('initialise avec la valeur par défaut quand rien n’est stocké', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }))
    expect(result.current[0]).toEqual({ count: 0 })
  })

  it('persiste la valeur dans localStorage après une mise à jour', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }))

    act(() => {
      result.current[1]({ count: 5 })
    })

    expect(result.current[0]).toEqual({ count: 5 })
    expect(JSON.parse(window.localStorage.getItem('test-key')!)).toEqual({ count: 5 })
  })

  it('relit la valeur persistée lors d’un nouveau montage du hook', () => {
    window.localStorage.setItem('test-key', JSON.stringify({ count: 42 }))
    const { result } = renderHook(() => useLocalStorage('test-key', { count: 0 }))
    expect(result.current[0]).toEqual({ count: 42 })
  })

  it('accepte un updater fonctionnel', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 1))
    act(() => {
      result.current[1]((prev) => prev + 1)
    })
    expect(result.current[0]).toBe(2)
  })
})
