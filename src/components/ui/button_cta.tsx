export function ButtonCTA({label, url}: {label: string, url: string}) {
    return (
        <a
            className="group py-3 px-5 bg-black text-white rounded-full inline-flex gap-2 items-center transition-all duration-300 hover:bg-[#1a1a1a] hover:scale-105 hover:shadow-lg hover:shadow-black/30"
            href={url}
        >
            {label}
            <img src="/components/arrow_up.svg" alt="" className="transition-transform duration-300 group-hover:translate-x-1" />
        </a>
    )
}