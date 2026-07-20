import { motion } from 'framer-motion';

interface SolutionCard {
  id: number;
  title: string;
  description: string;
}

const solutions: SolutionCard[] = [
  {
    id: 1,
    title: 'Rescate',
    description: 'Equipos especializados para operaciones de rescate en condiciones extremas. Dispositivos robustos diseñados para soportar altas temperaturas, impactos y ambientes hostiles, garantizando comunicación vital en momentos críticos.'
  },
  {
    id: 2,
    title: 'Incendios',
    description: 'Sistemas de comunicación resistentes al calor para combate de incendios. Equipos certificados con materiales ignífugos que mantienen su funcionalidad incluso en condiciones de temperatura extrema, asegurando la coordinación del equipo.'
  },
  {
    id: 3,
    title: 'Seguridad',
    description: 'Equipos de comunicación para fuerzas de seguridad y protección civil. Sistemas integrados que permiten coordinación efectiva en operaciones de seguridad pública, con encriptación y rangos extendidos para cobertura completa.'
  },
  {
    id: 4,
    title: 'Emergencias',
    description: 'Soluciones integrales para situaciones de emergencia y desastres. Equipos portátiles y sistemas de comunicación redundantes que aseguran conectividad cuando más se necesita, con baterías de larga duración.'
  }
];

function SolutionCard({ solution, index }: { solution: SolutionCard; index: number }) {
  return (
    <motion.div
      className="group relative overflow-hidden border border-muted bg-white rounded-[20px] p-8 shadow-lg"
      whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Barra de acento que crece al hover */}
      <div className="absolute top-0 left-0 h-1 w-0 bg-brand transition-all duration-500 ease-out group-hover:w-full" />
      <div className="flex flex-col gap-4">
        <h3 className="text-[24px] leading-[32px] text-black font-normal font-title">
          {solution.title}
        </h3>
        <p className="text-[16px] leading-[24px] text-black font-text">
          {solution.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function SolucionesOperacion() {
  return (
    <section className="relative overflow-hidden bg-black py-16 px-4 text-white">
      {/* Glows rojos ambientales para dar profundidad, consistente con el resto del sitio */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-[1535px] mx-auto relative">
        <motion.div 
          className="flex flex-col gap-2 pb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-[clamp(2rem,4vw,50px)] leading-[1.15] font-normal font-title">
            Soluciones para cada operación
          </h2>

          <span className="text-[20px] leading-[28px] font-text">
            Tecnología seleccionada para responder a las exigencias del trabajo en campo.
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {solutions.map((solution, index) => (
            <SolutionCard key={solution.id} solution={solution} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
