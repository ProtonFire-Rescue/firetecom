import { useState, useRef, useId } from 'react';

interface AccordionItem {
  label: string;
  /** Un string = un párrafo. Un array de strings = viñetas o párrafos. */
  content: string | string[];
  /** Cuando content es array, define si se renderiza como lista con viñetas o como párrafos. */
  variant?: 'list' | 'paragraphs';
  defaultOpen?: boolean;
}

interface ProductDetailAccordionProps {
  items: AccordionItem[];
}

function AccordionSection({ item, index }: { item: AccordionItem; index: number }) {
  const [open, setOpen] = useState(item.defaultOpen ?? false);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelId = `${useId()}-panel`;
  const btnId = `${useId()}-btn`;

  const isList = Array.isArray(item.content) && item.variant !== 'paragraphs';
  const paragraphs = Array.isArray(item.content) ? item.content : [item.content];

  return (
    <div className="border-t border-gray-200">
      <button
        id={btnId}
        onClick={() => setOpen((o) => !o)}
        className="group flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        style={{ animation: `accItemIn 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.06}s both` }}
      >
        <span className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-brand">
          {item.label}
        </span>
        <span
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-all duration-300 group-hover:bg-brand/10 group-hover:text-brand"
          style={{ transform: open ? 'rotate(135deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          maxHeight: open ? `${contentRef.current?.scrollHeight ?? 9999}px` : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pb-5">
          {isList ? (
            <ul className="space-y-2.5">
              {(item.content as string[]).map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-600"
                  style={open ? { animation: `accLineIn 0.4s ease-out ${i * 0.05}s both` } : undefined}
                >
                  <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-600">
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes accItemIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes accLineIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="accItemIn"], [style*="accLineIn"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function ProductDetailAccordion({ items }: ProductDetailAccordionProps) {
  return (
    <div className="divide-y divide-gray-200 border-b border-gray-200">
      {items.map((item, i) => (
        <AccordionSection key={i} item={item} index={i} />
      ))}
    </div>
  );
}
