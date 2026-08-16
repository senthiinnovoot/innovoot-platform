import { Toast } from './Toast'
import { useToastStore } from './useToast'

/**
 * Toast viewport — reads the shared store and renders the active stack.
 * One `role="region"` + `aria-live="polite"` for the whole stack (not
 * per-toast) so multiple simultaneous toasts are announced without
 * duplicate live regions. Not mounted anywhere yet — that's an
 * application-shell decision for a later phase, not this one.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
      className="z-toast fixed right-4 bottom-4 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  )
}
