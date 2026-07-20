import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchProduct {
    id: string | number;
    name: string;
    image: string;
    category: string;
    url: string;
}

const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

export default function ScreenSearch({
    categories = [],
    products = [],
}: {
    categories?: string[];
    products?: SearchProduct[];
}) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Cerrar con Escape y bloquear el scroll del body mientras el modal está abierto
    useEffect(() => {
        if (!searchOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [searchOpen]);

    function closeModal() {
        setSearchOpen(false);
        setSearch("");
        setActiveCategory(null);
    }

    const filteredProducts = useMemo(() => {
        const q = normalize(search.trim());
        return products.filter((product) => {
            const matchesCategory =
                !activeCategory || product.category === activeCategory;
            const matchesSearch =
                !q ||
                normalize(product.name).includes(q) ||
                normalize(product.category).includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [products, search, activeCategory]);

    // Enter en el input → ir al catálogo completo con la búsqueda aplicada
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        if (activeCategory) params.set("category", activeCategory);
        window.location.href = `/catalogo${params.toString() ? `?${params.toString()}` : ""}`;
    }

    return (
        <div className="relative z-1">
            <button
                type="button"
                className="cursor-pointer rounded-full p-2 transition-colors hover:bg-white/10"
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
            </button>

            <AnimatePresence>
                {searchOpen && (
                    <div className="fixed inset-0 z-50 flex flex-col">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Panel superior desplegable */}
                        <motion.div
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
                            className="relative z-10 w-full bg-white shadow-2xl max-h-[85vh] flex flex-col"
                        >
                            <div className="w-full max-w-[1535px] mx-auto px-6 py-8 flex flex-col gap-6 overflow-hidden">
                                {/* Cabecera con input de búsqueda */}
                                <div className="flex items-center gap-4">
                                    <form onSubmit={handleSubmit} className="relative flex-1">
                                        <img
                                            src="/components/search.svg"
                                            alt=""
                                            className="absolute left-4 top-1/2 -translate-y-1/2 size-5 opacity-60 pointer-events-none"
                                        />
                                        <input
                                            type="text"
                                            autoFocus
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Buscar producto..."
                                            className="w-full bg-[#f8f9fa] border border-zinc-200 rounded-full py-3.5 pl-12 pr-4 text-sm text-black outline-none transition-all duration-300 focus:ring-2 focus:ring-zinc-400"
                                        />
                                    </form>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        aria-label="Cerrar"
                                        className="shrink-0 rounded-full p-2.5 text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer text-lg leading-none"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 overflow-hidden">
                                    {/* Columna categorías */}
                                    <div className="flex flex-col gap-3 md:border-r md:border-zinc-100 md:pr-6 overflow-y-auto">
                                        <h3 className="font-title text-md text-black">Categorías</h3>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setActiveCategory(null)}
                                                className={`text-left px-4 py-2.5 rounded-xl text-sm font-text transition-colors cursor-pointer ${activeCategory === null
                                                    ? "bg-black text-white"
                                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                                                    }`}
                                            >
                                                Todas
                                            </button>
                                            {categories.map((category) => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => setActiveCategory(category)}
                                                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-text transition-colors cursor-pointer ${activeCategory === category
                                                        ? "bg-black text-white"
                                                        : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                                                        }`}
                                                >
                                                    {category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Columna resultados */}
                                    <div className="flex flex-col gap-4 overflow-y-auto">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-title text-md text-black">
                                                {activeCategory ?? "Productos"}
                                            </h3>
                                            <span className="text-xs font-text text-zinc-400">
                                                {filteredProducts.length}{" "}
                                                {filteredProducts.length === 1 ? "resultado" : "resultados"}
                                            </span>
                                        </div>

                                        {filteredProducts.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {filteredProducts.slice(0, 12).map((product) => (
                                                    <a
                                                        key={product.id}
                                                        href={product.url}
                                                        onClick={closeModal}
                                                        className="group flex items-center gap-3 p-2.5 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:bg-[#f8f9fa] transition-colors"
                                                    >
                                                        <div className="size-14 shrink-0 rounded-xl bg-[#f8f9fa] overflow-hidden flex items-center justify-center">
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : null}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-text text-sm text-black truncate group-hover:text-brand transition-colors">
                                                                {product.name}
                                                            </p>
                                                            <p className="font-text text-xs text-zinc-400 truncate">
                                                                {product.category}
                                                            </p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center py-12">
                                                <p className="font-title text-md text-black">
                                                    No se encontraron productos
                                                </p>
                                                <p className="font-text text-sm text-zinc-500 mt-1">
                                                    Prueba con otra palabra o categoría.
                                                </p>
                                            </div>
                                        )}

                                        {filteredProducts.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                className="self-start mt-1 text-sm font-text font-semibold text-brand hover:underline cursor-pointer"
                                            >
                                                Ver todos los resultados en el catálogo →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
