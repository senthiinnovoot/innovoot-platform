import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToast, useToastStore } from './useToast'

function resetStore() {
  useToastStore.setState({ toasts: [] })
}

describe('useToastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetStore()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds a toast on show()', () => {
    const { result } = renderHook(() => useToastStore())
    act(() => {
      result.current.show({ title: 'Saved' })
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Saved')
  })

  it('defaults duration to 5000ms and auto-dismisses once it elapses', () => {
    const { result } = renderHook(() => useToastStore())
    act(() => {
      result.current.show({ title: 'Saved' })
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].duration).toBe(5000)

    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('does not auto-dismiss when duration is 0 (persistent)', () => {
    const { result } = renderHook(() => useToastStore())
    act(() => {
      result.current.show({ title: 'Persistent', duration: 0 })
    })
    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current.toasts).toHaveLength(1)
  })

  it('removes a toast immediately on manual dismiss, before its timer fires', () => {
    const { result } = renderHook(() => useToastStore())
    let id = ''
    act(() => {
      id = result.current.show({ title: 'Saved' })
    })
    act(() => {
      result.current.dismiss(id)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('does not resurrect or error when a timer fires after the toast was already manually dismissed', () => {
    const { result } = renderHook(() => useToastStore())
    let id = ''
    act(() => {
      id = result.current.show({ title: 'Saved' })
    })
    act(() => {
      result.current.dismiss(id)
    })
    expect(() => {
      act(() => {
        vi.runAllTimers()
      })
    }).not.toThrow()
    expect(result.current.toasts).toHaveLength(0)
  })

  it('tracks independent timers for multiple simultaneous toasts', () => {
    const { result } = renderHook(() => useToastStore())
    act(() => {
      result.current.show({ title: 'Short', duration: 1000 })
      result.current.show({ title: 'Long', duration: 5000 })
    })
    expect(result.current.toasts).toHaveLength(2)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('Long')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(result.current.toasts).toHaveLength(0)
  })

  it('dismissing one toast does not affect another toast created around the same time', () => {
    const { result } = renderHook(() => useToastStore())
    let idA = ''
    act(() => {
      idA = result.current.show({ title: 'A', duration: 1000 })
      result.current.show({ title: 'B', duration: 1000 })
    })
    act(() => {
      result.current.dismiss(idA)
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe('B')

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.toasts).toHaveLength(0)
  })
})

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    resetStore()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exposes toast() and dismiss() bound to the shared store', () => {
    const { result } = renderHook(() => useToast())
    let id = ''
    act(() => {
      id = result.current.toast({ title: 'Saved', duration: 0 })
    })
    expect(useToastStore.getState().toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(id)
    })
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
