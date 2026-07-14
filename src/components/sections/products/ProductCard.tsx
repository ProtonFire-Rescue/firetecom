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
    <motion.a
      href={product.url}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-gray-200/80 cursor-pointer transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-900/[0.07]"
      style={{ willChange: 'transform' }}
      whileHover={{ y: -4 }}
    >
      {/* Arrow icon — aparece en hover */}
      <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-brand rounded-full flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 11L11 3M11 3H5M11 3v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Área de imagen */}
      <div className="relative aspect-[4/3] h-[450px] flex items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand/10 text-brand ring-1 ring-inset ring-brand/15 select-none pointer-events-none">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 border-t border-gray-100">
        <h3 className="text-gray-900 text-sm font-semibold leading-snug group-hover:text-brand transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
          {product.description}
        </p>
      </div>
    </motion.a>
  );
}
