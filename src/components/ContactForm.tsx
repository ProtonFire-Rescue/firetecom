import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 caracteres'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

// Entrada escalonada consistente con SolucionesOperacion / AnimatedAccordion
const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
}

const inputClass =
  'w-full border border-muted bg-surface text-md rounded-lg px-4 py-2 mt-2 outline-none transition-shadow duration-300 focus:ring-2 focus:ring-brand'

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        reset()
        return
      }
      // Leemos el mensaje del servidor (y el detalle en desarrollo) para poder diagnosticar.
      const info = await res.json().catch(() => null)
      const message = info?.detail
        ? `${info.error ?? 'Error'} — ${info.detail}`
        : info?.error || 'No se pudo enviar el mensaje. Intenta de nuevo.'
      setError('root', { message })
    } catch {
      setError('root', { message: 'Error de conexión. Revisa tu internet e intenta de nuevo.' })
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="w-full max-w-lg flex flex-col gap-3"
    >
      <motion.div variants={item} className="space-y-2">
        <h2 className="text-4xl font-title w-full">¿Quieres resolver algún tema en especifico?</h2>
        <p className="font-text text-md">
          Rellena y haz uso del siguiente formulario con el tema que quieras tratar, un miembro del
          equipo no durará en contestarte lo más pronto posible.
        </p>
      </motion.div>

      <motion.div variants={item} className="space-y-2">
        <label htmlFor="name" className="font-title text-sm">Nombres</label>
        <input id="name" {...register('name')} className={inputClass} />
        <FieldError message={errors.name?.message} />
      </motion.div>

      <motion.div variants={item} className="space-y-2">
        <label htmlFor="email" className="font-title text-sm">Email</label>
        <input id="email" type="email" {...register('email')} className={inputClass} />
        <FieldError message={errors.email?.message} />
      </motion.div>

      <motion.div variants={item} className="space-y-2">
        <label htmlFor="phone" className="font-title text-sm">Teléfono</label>
        <input id="phone" type="tel" {...register('phone')} className={inputClass} />
        <FieldError message={errors.phone?.message} />
      </motion.div>

      <motion.div variants={item} className="space-y-2">
        <label htmlFor="message" className="font-title text-sm">Mensaje</label>
        <textarea id="message" rows={4} {...register('message')} className={`${inputClass} resize-none`} />
        <FieldError message={errors.message?.message} />
      </motion.div>

      <motion.button
        variants={item}
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group py-3 px-4 bg-black text-white rounded-full inline-flex gap-2 items-center justify-center transition-all duration-300 hover:bg-[#1a1a1a] hover:shadow-lg hover:shadow-black/30 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="font-text text-md">{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
        <img
          src="/components/send.svg"
          alt=""
          className="size-5 transition-transform duration-300 group-hover:translate-x-1"
        />
      </motion.button>

      <AnimatePresence mode="wait">
        {isSubmitSuccessful && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-green-600 text-center text-sm"
          >
            Mensaje enviado correctamente
          </motion.p>
        )}
        {errors.root && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-brand text-center text-sm"
          >
            {errors.root.message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.form>
  )
}

// Mensaje de error de campo con entrada/salida animada (patrón AnimatePresence del sitio)
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
          className="text-brand text-sm overflow-hidden"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
