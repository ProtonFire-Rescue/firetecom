import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

const accordionItemsMaintenance: AccordionItem[] = [
  {
    id: 1,
    title: 'Importación de equipos',
    content: 'Traemos lo mejor de marcas internacionales para equipar a los bomberos con tecnología de punta. Como representantes en Ecuador, garantizamos acceso a las últimas innovaciones en sistemas de protección, comunicación y herramientas especializadas.'
  },
  {
    id: 2,
    title: 'Asesoría técnica',
    content: 'Brindamos acompañamiento personalizado para asegurar que cada institución cuente con la tecnología adecuada a sus necesidades. Nuestros especialistas colaboran estrechamente con los equipos en campo para optimizar el uso de los recursos y garantizar una respuesta efectiva en cada emergencia.'
  },
  {
    id: 3,
    title: 'Soporte y mantenimiento',
    content: 'Brindamos soporte técnico especializado para asegurar que los equipos funcionen correctamente. Nuestros técnicos están capacitados para brindar asistencia técnica en todo el territorio nacional, garantizando que los equipos estén en óptimas condiciones de funcionamiento.'
  }
];

const accordionItemsAbout: AccordionItem[] = [
  {
    id: 1,
    title: "Equipos certificados",
    content: "Importamos y trabajamos únicamente con tecnología que cumple los mejores estándares del sector. Esto nos permite brindar a nuestros clientes equipos de alta calidad y confiabilidad, garantizando una mayor eficiencia en sus operaciones."
  },
  {
    id: 2,
    title: "Respaldo técnico local",
    content: "Contamos con un equipo de ingenieros capacitados para brindar asistencia técnica en todo el territorio nacional. Esto nos permite garantizar que los equipos que reciben nuestros clientes estén en condiciones óptimas de funcionamiento y estar preparados para cualquier eventualidad."
  },
  {
    id: 3,
    title: "Experiencia Institucional",
    content: "Firetecom ha trabajado con diversas instituciones que confían en nuestros servicios, de esta forma hemos adquirido la experiencia necesaria para la integración de TICs que cubra con las diferentes áreas del sector."
  }
];

// TODO: reemplazar por una foto propia de Firetecom en public/resources — actualmente hotlinkeada de un sitio externo
const SHOWCASE_IMAGE = "/resources/banner_services.jpg";
const SHOWCASE_IMAGE_2 = "/resources/banner_about.jpg";


function AccordionItemRow({ item, isActive, isExpanded, onMouseEnter, onMouseLeave }: { item: AccordionItem; isActive: boolean; isExpanded: boolean; onMouseEnter: () => void; onMouseLeave: () => void }) {
  return (
    <motion.div
      className="overflow-hidden px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div>
        <h3 className="text-[24px] leading-[32px] text-black font-normal mb-3 font-title">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 mb-4 relative">
          <div className="flex-1 h-0 relative">
            {/* Red fluorescent line indicator */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-200/50 rounded-full"></div>
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  className="absolute top-0 left-0 h-[3px] bg-brand rounded-full"
                  initial={{ width: '0%' }}
                  animate={{
                    width: isActive && isExpanded ? '100%' : '0%',
                    opacity: isActive && isExpanded ? 1 : 0
                  }}
                  transition={{
                    width: { duration: 15, ease: 'linear' },
                    opacity: { duration: 0.8 }
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isActive && (
            <motion.p
              key={item.id}
              className="text-[16px] leading-[24px] text-black font-text mb-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isExpanded ? 1 : 0, height: isExpanded ? 'auto' : 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.8 }}
            >
              {item.content}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function AccordionShowcase({ heading, items, reverse = false, img = SHOWCASE_IMAGE }: { heading: string; items: AccordionItem[]; reverse?: boolean; img?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsExpanded(true);

    timeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        setIsExpanded(false);

        timeoutRef.current = setTimeout(() => {
          if (!isPaused) {
            setActiveIndex((prev) => (prev + 1) % items.length);
            startCycle();
          }
        }, 500);
      }
    }, 15000);
  };

  useEffect(() => {
    startCycle();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = (index: number) => {
    setIsPaused(true);
    setActiveIndex(index);
    setIsExpanded(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setIsExpanded(false);

    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
      startCycle();
    }, 500);
  };

  return (
    <section className="bg-surface py-16">
      <div className="max-w-[1535px] mx-auto px-4">
        <motion.div
          className={`flex flex-col gap-10 lg:gap-0 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className={`relative w-full lg:w-1/2 h-[50vh] lg:h-[80vh] ${reverse ? 'flex justify-end' : ''}`}>
            <motion.div
              className={`bg-brand w-2/3 h-full shadow-2xl ${reverse ? 'rounded-[30px_0_0_30px]' : 'rounded-[0_30px_30px_0]'}`}
              initial={{ opacity: 0, x: reverse ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            ></motion.div>
            <motion.img
              src={img}
              alt=""
              className="absolute top-1/2 left-6 lg:left-20 w-[70%] h-[70%] object-cover -translate-y-1/2 rounded-[30px] shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>

          <div className="w-full lg:max-w-[645px] flex flex-col gap-0 justify-center">
            <motion.h2
              className="text-[clamp(2rem,5vw,65px)] leading-[1.1] text-black font-normal mx-4 mb-10 font-title"
              initial={{ opacity: 0, x: reverse ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {heading}
            </motion.h2>
            {items.map((item, index) => (
              <AccordionItemRow
                key={item.id}
                item={item}
                isActive={index === activeIndex}
                isExpanded={isExpanded}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ScreenMaintenance() {
  return <AccordionShowcase heading="Más que equipos, un respaldo completo" items={accordionItemsMaintenance} />;
}

export function ScreenAbout() {
  return <AccordionShowcase heading="Por qué confiar en Fire Tecom" items={accordionItemsAbout} reverse img={SHOWCASE_IMAGE_2} />;
}
