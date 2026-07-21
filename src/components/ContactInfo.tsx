import { motion, type Variants } from 'framer-motion'
import { ButtonCTA } from './ui/button_cta'

// Mismo patrón de entrada escalonada que ContactForm
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

interface ContactChannel {
  icon: string
  title: string
  value: string
}

const channels: ContactChannel[] = [
  { icon: '/components/support.svg', title: 'Soporte Técnico', value: 'firetecom.ftc@gmail.com' },
  { icon: '/components/seller.svg', title: 'Ventas', value: '+56 9 8525 9991' },
]

export default function ContactInfo() {
  return (
    <motion.div
      className="flex flex-col w-full max-w-lg gap-6 relative z-10 lg:w-4/5 lg:max-w-none"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.h2
        variants={item}
        className="font-title text-3xl sm:text-4xl lg:text-5xl text-white"
      >
        ¿Dudas o consultas?
      </motion.h2>

      <motion.p variants={item} className="font-text text-md text-white">
        Si tienes consultas o necesitas ayuda para cotizar alguno de nuestros productos, nuestro
        equipo de profesionales esta dispuesto a brindarte atención y asesoria personalizada.
      </motion.p>

      <motion.div
        variants={item}
        className="flex flex-wrap justify-start gap-x-10 gap-y-5 sm:gap-x-15"
      >
        {channels.map((channel) => (
          <motion.div
            key={channel.title}
            className="flex gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src={channel.icon} alt="" className="w-10 h-10 shrink-0" loading='lazy' />
            <div className="flex flex-col text-white">
              <h3 className="font-title text-xl">{channel.title}</h3>
              <p className="font-text text-sm">{channel.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={item} className="w-full max-w-md">
        <ButtonCTA
          label="Enviar mensaje directo"
          isTarget={true}
          url="https://wa.me/56985259991?text=Hola%20me%20gustaria%20obtener%20mas%20informacion%20sobre%20sus%20productos%20o%20servicios."
        />
      </motion.div>
    </motion.div>
  )
}
