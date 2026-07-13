import { motion } from 'framer-motion';
import { ButtonCTA } from '../../ui/button_cta';

interface Norma {
  name: string;
  image: string;
}

export default function NormasSection({ normas }: { normas: Norma[] }) {
  return (
    <section className="relative w-full overflow-hidden px-6 py-24 md:px-16 lg:px-24 lg:min-h-[80vh] lg:flex lg:items-center">
      {/* Glow decorativo consistente con el resto del sitio */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-16 lg:flex-row lg:items-center lg:justify-center lg:gap-20">
        {/* Certificados */}
        <div className="mx-auto flex w-auto max-w-[280px] flex-col gap-4 lg:mx-0">
          {normas.map((norma, index) => (
            <motion.div
              key={norma.name}
              className="flex items-center justify-center rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <img src={norma.image} alt={norma.name} className="h-12 w-auto object-contain" />
            </motion.div>
          ))}
        </div>

        {/* Texto */}
        <div className="flex max-w-[800px] flex-col gap-8">
          <motion.h2
            className="font-title text-[clamp(2rem,4vw,50px)] leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            Cada producto de esta línea cumple con <span className="text-red-600">estándares</span> y normas{' '}
            <span className="text-red-600">internacionales</span>
          </motion.h2>

          <motion.p
            className="font-text max-w-[640px] text-[18px] leading-[30px] text-black/90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Si tienes consultas, quieres realizar una cotización o si quieres saber más información acerca de los
            productos de nuestra línea no dudes en contactarnos o comunicarte con nosotros.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <ButtonCTA label="Cotizar" url="#" />
            <ButtonCTA label="Contactar" url="#" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
