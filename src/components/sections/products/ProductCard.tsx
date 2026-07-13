import { motion } from 'framer-motion';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  brand: string;
  type: string;
  badge?: string;
  url: string;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -8 }}
      className="group flex flex-col w-full bg-white rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Contenedor de Imagen con Fondo Gris Claro */}
      <div className="relative w-full aspect-[4/3] bg-zinc-100/80 rounded-3xl flex items-center justify-center overflow-hidden p-8 ring-1 ring-black/[0.04] shadow-sm transition-all duration-500 group-hover:bg-zinc-100 group-hover:shadow-xl group-hover:shadow-black/10 group-hover:ring-brand/15">
        {/* Sheen premium: brillo diagonal sutil que aparece al hover */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 -translate-x-full transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />

        {/* Enlace circular de flecha superior derecha */}
        <a 
          href={product.url}
          target="_self"
          className="absolute top-4 right-4 z-10 w-11 h-11 bg-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-[#1a1a1a] shadow-md group-hover:shadow-lg"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <img 
            src="/components/arrow_up.svg" 
            alt="" 
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
          />
        </a>

        {/* Imagen del Producto */}
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge de especificaciones (por ejemplo, IP68) */}
        {product.badge && (
          <span className="absolute bottom-4 right-4 rounded-full px-4 py-1 text-xs font-title font-bold bg-red-100/90 text-brand select-none">
            {product.badge}
          </span>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col mt-5 px-1 space-y-2">
        <h3 className="font-title text-xl text-black transition-colors duration-300 group-hover:text-brand">
          {product.name}
        </h3>
        <p className="font-text text-sm text-zinc-500 leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>
    </motion.div>
  );
}
