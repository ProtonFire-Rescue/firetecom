import { motion } from 'framer-motion';


// TODO: reemplazar por los logos y nombres reales de las marcas aliadas de Firetecom


export default function OurBrands({ brands }: { brands: any[] }) {
    return (
        <section className="w-full px-6 py-12 md:px-16 lg:px-35 lg:py-15 flex flex-col items-start gap-3">
            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-[clamp(2rem,5vw,60px)] tracking-tight font-title">Nuestros Aliados</h2>
                <div className="p-[1px] w-full bg-gradient-to-r from-red-500 via-red-500 to-gray-500 rounded-lg shadow-lg shadow-red-500/20"></div>
            </motion.div>
            <motion.p
                className="max-w-[800px] font-text"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                Estas son las principales marcas de las que exportamos nuestros equipos, cada una respaldada de entidades responsables y de confianza,
            </motion.p>
            <div className="flex flex-wrap justify-start gap-6 lg:gap-10 mt-5 w-full">
                {brands.map((brand, index) => (
                    <motion.div
                        key={brand.name}
                        className="flex flex-col items-center gap-2 w-[160px] h-[160px] sm:w-[150px] sm:h-[150px] bg-white rounded-[20px] border border-black/5 shadow-sm ring-1 ring-black/[0.02] hover:shadow-md hover:border-brand/15 transition-all duration-300"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                    >
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-4" />
                    </motion.div>
                ))}
            </div>
        </section>
    )
}