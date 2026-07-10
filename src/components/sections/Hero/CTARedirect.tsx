import { motion } from 'framer-motion';
import {ButtonCTA} from "../../ui/button_cta";
export default function CTARedirect() {
    return (
        <motion.div
            className="w-full min-h-[60vh] px-6 py-20 md:px-16 lg:px-35 flex flex-col gap-5 justify-center items-center relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-black/5 pointer-events-none"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <motion.h2
                className="text-[clamp(2rem,5vw,60px)] font-title max-w-[700px] text-center leading-[1.1] relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                ¿Listo para equipar a tu institución?
            </motion.h2>
            <motion.span
                className="leading-[28px] font-text max-w-[600px] text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Cuéntanos qué necesitas y te preparamos una cotización a la medida.
            </motion.span>
            <motion.div
                className="flex flex-wrap justify-center gap-2 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <ButtonCTA label="Contactar" url="/contacto" />
                <ButtonCTA label="Ver productos" url="/productos" />
            </motion.div>
        </motion.div>
    )
}