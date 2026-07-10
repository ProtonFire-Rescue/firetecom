import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) reset()
  }

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md flex flex-col gap-4"
    >
      <div>
        <input
          {...register('name')}
          placeholder="Name"
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Message"
          rows={4}
          className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-blue-600 text-white font-semibold py-2 rounded-lg disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </motion.button>

      {isSubmitSuccessful && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-center text-sm"
        >
          Message sent successfully!
        </motion.p>
      )}
    </motion.form>
  )
}
