import { motion } from 'framer-motion';
import { ButtonCTA } from "../../ui/button_cta";

interface HeroCardProductProps {
  img: string;
  title: string;
  description: string;
  url: string;
}

export default function HeroCardProduct({ img, title, description, url }: HeroCardProductProps) {
  return (
    <section className="bg-surface px-4 py-16">
      <div className="max-w-[1535px] mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row">
          {/* Left Image */}
          <motion.div
            className="group relative w-full max-w-[600px] aspect-square shrink-0 lg:w-[600px] lg:h-[600px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <img src={img} alt={title} className="w-full h-full object-cover rounded-2xl ring-1 ring-black/5 shadow-2xl shadow-black/10 transition-transform duration-500 group-hover:scale-105" />
          </motion.div>

          {/* Right Content */}
          <div className="flex-1 space-y-10 max-w-[645px]">
            <motion.h2
              className="text-[clamp(2rem,4vw,50px)] leading-[1.1] tracking-tight text-black font-normal font-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-[18px] leading-[30px] text-black max-w-[645px] font-text"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <ButtonCTA label="Saber más" url={url} />
            </motion.div>
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="w-[13px] h-[13px] bg-brand rounded-full absolute -top-[0.35rem] shadow-lg shadow-red-500/50"></div>
              <hr className="w-full text-brand" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
