import { motion } from 'framer-motion';
import { ButtonCTA } from '../../ui/button_cta';

interface Product {
  name: string;
  url: string;
  image: string;
}

export default function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <div className="flex flex-col">
      {products.map((product, index) => (
        <motion.section
          key={product.name}
          className="group relative w-full h-[90vh] overflow-hidden border-b-2 border-gray-200"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {/* Imagen de fondo con zoom lento tipo Ken Burns */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url('${product.image}')` }}
            initial={{ scale: 1.15 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />

          {/* Overlay degradado para legibilidad y profundidad premium */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Glow rojo sutil, consistente con el resto del sitio */}
          <div className="absolute -bottom-24 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Contenido */}
          <div className="absolute bottom-10 left-6 md:left-10 flex flex-col gap-4 max-w-[90%]">
            <motion.span
              className="font-text text-white/70 text-xs md:text-sm uppercase tracking-[0.3em]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {String(index + 1).padStart(2, '0')} — Línea de productos
            </motion.span>

            <motion.h2
              className="font-title text-white text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {product.name}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <ButtonCTA label="Ver más" url={product.url} />
            </motion.div>
          </div>
        </motion.section>
      ))}
    </div>
  );
}
