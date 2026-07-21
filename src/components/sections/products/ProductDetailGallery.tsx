import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ProductDetailGalleryProps {
  images: string[];
  title: string;
  badge?: string;
}

export default function ProductDetailGallery({ images, title, badge }: ProductDetailGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ── Zoom on hover ──────────────────────────────────────────────
  const [isZoomed, setIsZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const canZoom = useRef(true);

  useEffect(() => {
    // Desactiva zoom/animaciones intensivas si el usuario prefiere menos movimiento
    // o en dispositivos táctiles (donde el hover no aplica).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const touch = window.matchMedia('(hover: none)').matches;
    canZoom.current = !reduce && !touch;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canZoom.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) });
  }, []);

  // ── Lightbox ───────────────────────────────────────────────────
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, goPrev, goNext]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  return (
    <>
      {/* ── Gallery ─────────────────────────────────────────────── */}
      <div className="flex w-full flex-col gap-3">

        {/* Main image with zoom-on-hover */}
        <div
          className="group relative flex aspect-square w-full select-none items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-50 to-zinc-100 ring-1 ring-inset ring-zinc-200/70 md:aspect-[5/4]"
          style={{ cursor: 'zoom-in' }}
          onMouseEnter={() => canZoom.current && setIsZoomed(true)}
          onMouseLeave={() => { setIsZoomed(false); setOrigin({ x: 50, y: 50 }); }}
          onMouseMove={handleMouseMove}
          onClick={() => openLightbox(selectedIndex)}
          role="button"
          aria-label="Ampliar imagen"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(selectedIndex)}
        >
          {/* Halo radial sutil */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.04),transparent_70%)]" />

          <img
            key={selectedIndex}
            src={images[selectedIndex]}
            alt={`${title} — Vista ${selectedIndex + 1}`}
            draggable={false}
            className="pointer-events-none h-full w-full object-contain p-8 md:p-10"
            style={{
              transform: isZoomed ? 'scale(2.4)' : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
              transition: isZoomed
                ? 'transform 0.08s linear'
                : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
              willChange: 'transform',
              animation: 'imgFadeIn 0.4s ease-out',
            }}
          />

          {/* Zoom hint */}
          <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-80">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 8l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M5 3.5v3M3.5 5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Ampliar
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-4 sm:overflow-visible">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 transition-all duration-300 sm:w-auto ${selectedIndex === i
                  ? 'ring-2 ring-brand ring-offset-2'
                  : 'opacity-55 ring-1 ring-inset ring-zinc-200 hover:opacity-100 hover:ring-zinc-300'
                  }`}
                aria-label={`Ver imagen ${i + 1}`}
                aria-current={selectedIndex === i}
              >
                <img
                  src={img}
                  alt={`${title} vista ${i + 1}`}
                  className="pointer-events-none h-full w-full object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox — montado en document.body vía portal ───────
          Columna flex: cabecera, imagen y miniaturas se reparten el alto sin
          solaparse. La imagen se limita a su contenedor (max-h/max-w-full),
          no a unidades de viewport, así nunca desborda. */}
      {lightboxOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)', animation: 'lbBackdropIn 0.25s ease-out' }}
          onClick={closeLightbox}
        >
          {/* Cabecera: contador + cerrar */}
          <div className="relative z-10 flex shrink-0 items-center justify-between px-4 py-4 sm:px-5">
            <span className="text-sm font-medium tabular-nums text-white/60">
              {lightboxIndex + 1} / {images.length}
            </span>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              onClick={closeLightbox}
              aria-label="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Área de imagen: ocupa el alto restante (min-h-0 permite encoger) */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-20">
            {/* Prev arrow */}
            {images.length > 1 && (
              <button
                className="absolute left-1.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 sm:left-8 sm:h-11 sm:w-11"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Imagen anterior"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <img
              key={lightboxIndex}
              src={images[lightboxIndex]}
              alt={`${title} — Vista ${lightboxIndex + 1}`}
              draggable={false}
              onClick={(e) => e.stopPropagation()}
              className="select-none rounded-xl object-contain max-h-full max-w-full"
              style={{ animation: 'lbFadeIn 0.25s ease-out' }}
            />

            {/* Next arrow */}
            {images.length > 1 && (
              <button
                className="absolute right-1.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 sm:right-8 sm:h-11 sm:w-11"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Imagen siguiente"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Miniaturas: scroll horizontal si no caben, centradas si sí */}
          {images.length > 1 && (
            <div
              className="shrink-0 overflow-x-auto px-4 pb-5 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto flex w-max gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${lightboxIndex === i
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-40 hover:opacity-70'
                      }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full bg-white/10 object-contain p-1" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <style>{`
            @keyframes lbFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            @keyframes lbBackdropIn { from { opacity: 0; } to { opacity: 1; } }
            @media (prefers-reduced-motion: reduce) {
              [style*="lbFadeIn"], [style*="lbBackdropIn"] { animation: none !important; }
            }
          `}</style>
        </div>,
        document.body
      )}

      <style>{`
        @keyframes imgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          [style*="imgFadeIn"] { animation: none !important; }
        }
      `}</style>
    </>
  );
}
