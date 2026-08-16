import { create } from 'zustand'

export type ToastVariant = 'info' | 'success' | 'warning' | 'error'

export interface ToastOptions {
  variant?: ToastVariant
  title?: string
  description?: string
  /** ms before auto-dismiss. `0` = persistent until manually dismissed. Default `5000`. */
  duration?: number
}

export interface ToastRecord {
  id: string
  variant: ToastVariant
  title?: string
  description?: string
  duration: number
}

interface ToastStoreState {
  toasts: ToastRecord[]
  show: (options: ToastOptions) => string
  dismiss: (id: string) => void
}

const DEFAULT_DURATION = 5000

let idCounter = 0
function generateId(): string {
  idCounter += 1
  return `toast-${idCounter}`
}

/**
 * Pending auto-dismiss timers, keyed by toast id. Kept outside the store
 * (not UI state) so `dismiss()` has exactly one place to clear a pending
 * timer regardless of *why* a toast is being removed — auto-expiry, manual
 * dismissal, or otherwise — which is what prevents a stale timer from
 * later firing against an already-removed toast.
 */
const timers = new Map<string, ReturnType<typeof setTimeout>>()

function clearTimer(id: string) {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

export const useToastStore = create<ToastStoreState>((set, get) => ({
  toasts: [],
  show: (options) => {
    const id = generateId()
    const duration = options.duration ?? DEFAULT_DURATION
    const toast: ToastRecord = {
      id,
      variant: options.variant ?? 'info',
      title: options.title,
      description: options.description,
      duration,
    }

    set((state) => ({ toasts: [...state.toasts, toast] }))

    if (duration > 0) {
      timers.set(
        id,
        setTimeout(() => {
          get().dismiss(id)
        }, duration),
      )
    }

    return id
  },
  dismiss: (id) => {
    clearTimer(id)
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))

/** Public hook — `toast(options)` shows a toast and returns its id; `dismiss(id)` removes it. */
export function useToast() {
  const toast = useToastStore((state) => state.show)
  const dismiss = useToastStore((state) => state.dismiss)
  return { toast, dismiss }
}
