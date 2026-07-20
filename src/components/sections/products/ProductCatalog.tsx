import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  type: string;
  brand: string;
  badge: string;
  url: string;
}



const ITEMS_PER_PAGE = 6;

export default function ProductCatalog({ categories, types, brands, products }: { categories: string[], types: string[], brands: string[], products: Product[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  // Leer y aplicar parámetros de búsqueda y filtros desde la URL al cargar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      const qParam = params.get('q');
      if (qParam) {
        setSearch(qParam);
      }

      // Función helper para normalizar cadenas (quitar acentos, espacios, guiones y mayúsculas)
      const normalize = (str: string) =>
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

      // ?type=... o ?category=...
      const typeOrCatParam = params.get('type') || params.get('category');
      if (typeOrCatParam) {
        const normParam = normalize(typeOrCatParam);

        // 1. Intentar emparejar en CATEGORIES
        const matchedCategory = categories.find(c => normalize(c) === normParam);
        if (matchedCategory) {
          setSelectedCategories([matchedCategory]);
          setIsCategoriesOpen(true);
        } else {
          // 2. Intentar emparejar en TYPES
          const matchedType = types.find(t => normalize(t) === normParam);
          if (matchedType) {
            setSelectedTypes([matchedType]);
            setIsTypesOpen(true);
          }
        }
      }

      // ?brand=... o ?marca=...
      const brandParam = params.get('brand') || params.get('marca');
      if (brandParam) {
        const normParam = normalize(brandParam);
        const matchedBrand = brands.find(b => normalize(b) === normParam);
        if (matchedBrand) {
          setSelectedBrands([matchedBrand]);
          setIsBrandsOpen(true);
        }
      }
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.includes(product.type);

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.brand);

      return matchesSearch && matchesCategory && matchesType && matchesBrand;
    });
  }, [search, selectedCategories, selectedTypes, selectedBrands]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const activePage = currentPage > totalPages ? 1 : currentPage;

  const paginatedProducts = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, activePage]);

  const toggleFilter = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setCurrentPage(1);
    setList(prev =>
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const removeFilter = (setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setCurrentPage(1);
    setList(prev => prev.filter(x => x !== item));
  };

  const clearAllFilters = () => {
    setCurrentPage(1);
    setSearch('');
    setSelectedCategories([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
  };

  return (
    <div className="w-full max-w-[1535px] mx-auto px-6 py-12">
      <div className="flex flex-col gap-6 w-full mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <label htmlFor="search-input" className="block font-title text-sm text-black mb-2">
              Buscar Producto
            </label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Escribe el nombre del producto..."
                className="w-full bg-[#f8f9fa] border-none rounded-full px-6 py-3.5 pr-12 text-sm text-black outline-none transition-all duration-300 focus:ring-2 focus:ring-zinc-400"
              />
              <img
                src="/components/search.svg"
                alt=""
                className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-60 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-black hover:bg-[#1a1a1a] text-white rounded-full text-sm font-text font-medium cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Filtrar</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <AnimatePresence>
              {selectedCategories.map(category => (
                <motion.span
                  key={`cat-${category}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 bg-[#f8f9fa] border border-zinc-200 rounded-full px-4 py-1.5 text-xs text-zinc-700 font-text"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => removeFilter(setSelectedCategories, category)}
                    className="hover:text-brand cursor-pointer text-[10px] font-bold"
                    aria-label={`Eliminar filtro ${category}`}
                  >
                    ✕
                  </button>
                </motion.span>
              ))}

              {selectedTypes.map(type => (
                <motion.span
                  key={`type-${type}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 bg-[#f8f9fa] border border-zinc-200 rounded-full px-4 py-1.5 text-xs text-zinc-700 font-text"
                >
                  <span>{type}</span>
                  <button
                    onClick={() => removeFilter(setSelectedTypes, type)}
                    className="hover:text-brand cursor-pointer text-[10px] font-bold"
                    aria-label={`Eliminar filtro ${type}`}
                  >
                    ✕
                  </button>
                </motion.span>
              ))}

              {selectedBrands.map(brand => (
                <motion.span
                  key={`brand-${brand}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 bg-[#f8f9fa] border border-zinc-200 rounded-full px-4 py-1.5 text-xs text-zinc-700 font-text"
                >
                  <span>{brand}</span>
                  <button
                    onClick={() => removeFilter(setSelectedBrands, brand)}
                    className="hover:text-brand cursor-pointer text-[10px] font-bold"
                    aria-label={`Eliminar filtro ${brand}`}
                  >
                    ✕
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            {(selectedCategories.length > 0 || selectedTypes.length > 0 || selectedBrands.length > 0 || search) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-brand hover:underline cursor-pointer font-text font-semibold ml-2"
              >
                Limpiar Filtros
              </button>
            )}
          </div>

          <div className="text-sm font-text text-zinc-500 font-medium">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Producto encontrado' : 'Productos encontrados'}
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {paginatedProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-title text-xl text-black">No se encontraron productos</h3>
            <p className="font-text text-sm text-zinc-500 mt-2 max-w-sm">
              Prueba cambiando las palabras clave de búsqueda o limpiando las categorías y marcas activas.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-16 font-text">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={activePage === 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 transition-all ${activePage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-50 cursor-pointer text-black'
              }`}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all font-semibold ${activePage === page ? 'bg-zinc-100 text-black font-bold' : 'text-zinc-600 hover:bg-zinc-50 cursor-pointer'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={activePage === totalPages}
            className={`w-10 h-10 rounded-full flex items-center justify-center border border-zinc-200 transition-all ${activePage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-50 cursor-pointer text-black'
              }`}
          >
            ›
          </button>
        </div>
      )}

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center pb-6 border-b border-zinc-100">
                  <h3 className="font-title text-2xl text-black">Personalizar búsqueda</h3>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-zinc-400 hover:text-black transition-colors p-2 text-2xl font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col mt-4">
                  <div className="border-b border-zinc-100 py-4">
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="w-full flex justify-between items-center font-title text-lg text-black text-left cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      <span>Categorías</span>
                      <span className="text-xl font-normal w-5 text-center">{isCategoriesOpen ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isCategoriesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden mt-3 flex flex-col gap-2.5 pl-1"
                        >
                          {categories.map(category => (
                            <label key={category} className="flex items-center gap-3 py-1 cursor-pointer text-sm text-zinc-600 hover:text-black font-text select-none">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleFilter(selectedCategories, setSelectedCategories, category)}
                                className="w-4.5 h-4.5 rounded border-zinc-300 bg-white text-black focus:ring-black accent-black cursor-pointer"
                              />
                              <span>{category}</span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="border-b border-zinc-100 py-4">
                    <button
                      onClick={() => setIsTypesOpen(!isTypesOpen)}
                      className="w-full flex justify-between items-center font-title text-lg text-black text-left cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      <span>Tipo</span>
                      <span className="text-xl font-normal w-5 text-center">{isTypesOpen ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isTypesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden mt-3 flex flex-col gap-2.5 pl-1"
                        >
                          {types.map(type => (
                            <label key={type} className="flex items-center gap-3 py-1 cursor-pointer text-sm text-zinc-600 hover:text-black font-text select-none">
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                                className="w-4.5 h-4.5 rounded border-zinc-300 bg-white text-black focus:ring-black accent-black cursor-pointer"
                              />
                              <span>{type}</span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="border-b border-zinc-100 py-4">
                    <button
                      onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                      className="w-full flex justify-between items-center font-title text-lg text-black text-left cursor-pointer hover:opacity-85 transition-opacity"
                    >
                      <span>Marca</span>
                      <span className="text-xl font-normal w-5 text-center">{isBrandsOpen ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isBrandsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden mt-3 flex flex-col gap-2.5 pl-1"
                        >
                          {brands.map(brand => (
                            <label key={brand} className="flex items-center gap-3 py-1 cursor-pointer text-sm text-zinc-600 hover:text-black font-text select-none">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleFilter(selectedBrands, setSelectedBrands, brand)}
                                className="w-4.5 h-4.5 rounded border-zinc-300 bg-white text-black focus:ring-black accent-black cursor-pointer"
                              />
                              <span>{brand}</span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-4 bg-black hover:bg-[#1a1a1a] text-white font-title text-md rounded-full cursor-pointer transition-colors duration-300 shadow-md hover:shadow-lg text-center"
                >
                  Ver {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
