import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductInquiryActionsProps {
  productName: string
  productModel?: string
  /**
   * URL absoluta del producto, ya resuelta en el servidor.
   * Debe llegar formada para que servidor y cliente rendericen el mismo
   * href y no se produzca un mismatch de hidratación.
   */
  productUrl: string
  /** Número de WhatsApp en formato internacional, solo dígitos. */
  whatsappNumber: string
}

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(7, 'Ingresa un teléfono válido'),
})

type FormData = z.infer<typeof schema>

const inputClass =
  'w-full border border-gray-200 bg-white text-sm rounded-lg px-4 py-2.5 mt-1.5 outline-none transition-shadow duration-300 focus:ring-2 focus:ring-brand'

export default function ProductInquiryActions({
  productName,
  productModel,
  productUrl,
  whatsappNumber,
}: ProductInquiryActionsProps) {
  const [modalOpen, setModalOpen] = useState(false)

  // ── Mensaje de WhatsApp ────────────────────────────────────────
  const waMessage = `Hola, estoy interesado en el producto *${productName}*${
    productModel ? ` (modelo ${productModel})` : ''
  }. ¿Podrían darme más información y una cotización?\n\n${productUrl}`
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* ── WhatsApp ─────────────────────────────────────────── */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1fb457] hover:scale-105 hover:shadow-lg hover:shadow-[#25D366]/30"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
          </svg>
          Enviar por WhatsApp
        </a>

        {/* ── Correo (abre modal) ──────────────────────────────── */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand hover:scale-105 hover:shadow-lg hover:shadow-brand/25"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 6l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Solicitar por correo
        </button>
      </div>

      <QuoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={productName}
        productModel={productModel}
        productUrl={productUrl}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// Modal con formulario de cotización por correo
// ─────────────────────────────────────────────────────────────────
interface QuoteModalProps {
  open: boolean
  onClose: () => void
  productName: string
  productModel?: string
  productUrl: string
}

function QuoteModal({ open, onClose, productName, productModel, productUrl }: QuoteModalProps) {
  // Éxito controlado con estado propio: no dependemos de `isSubmitSuccessful`
  // de react-hook-form, que se marca true aunque el envío falle (el handler no lanza).
  const [succeeded, setSucceeded] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  // Cerrar con ESC + bloquear scroll de fondo
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Reset del formulario y del estado de éxito al cerrar
  useEffect(() => {
    if (!open) {
      reset()
      setSucceeded(false)
    }
  }, [open, reset])

  async function onSubmit(data: FormData) {
    clearErrors('root')
    try {
      const res = await fetch('/api/product-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, productName, productModel, productUrl }),
      })

      if (res.ok) {
        setSucceeded(true)
        return
      }

      // Fallo controlado: leemos el mensaje del servidor (y el detalle en desarrollo).
      const info = await res.json().catch(() => null)
      const message = info?.detail
        ? `${info.error ?? 'Error'} — ${info.detail}`
        : info?.error || 'No se pudo enviar la solicitud. Intenta de nuevo.'
      setError('root', { message })
    } catch {
      setError('root', { message: 'Error de conexión. Revisa tu internet e intenta de nuevo.' })
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cerrar */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {succeeded ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">¡Solicitud enviada!</h3>
                  <p className="text-sm text-gray-500">
                    Gracias por tu interés. Un miembro del equipo te contactará muy pronto.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="pr-8">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                      Cotización
                    </span>
                    <h3 className="mt-1 text-lg font-bold leading-tight text-gray-900">
                      {productName}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Déjanos tus datos y te enviaremos la información y el precio.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="q-name" className="text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input id="q-name" {...register('name')} className={inputClass} />
                    <FieldError message={errors.name?.message} />
                  </div>

                  <div>
                    <label htmlFor="q-phone" className="text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <input id="q-phone" type="tel" {...register('phone')} className={inputClass} />
                    <FieldError message={errors.phone?.message} />
                  </div>

                  <div>
                    <label htmlFor="q-email" className="text-sm font-medium text-gray-700">
                      Correo
                    </label>
                    <input id="q-email" type="email" {...register('email')} className={inputClass} />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-brand hover:shadow-lg hover:shadow-brand/25 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
                    {!isSubmitting && (
                      <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2.917 7h8.166M7.583 4.083 10.5 7l-2.917 2.917" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <AnimatePresence>
                    {errors.root && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-center text-sm text-brand"
                      >
                        {errors.root.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="mt-1 overflow-hidden text-xs text-brand"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
