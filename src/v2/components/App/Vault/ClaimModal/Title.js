export default function Title({ children, text = null }) {
    return (
        <header className="px-8 mb-3 md:mb-1 flex w-full">
            <h3 className="text-xs md:text-base font-medium text-white">{text || children}</h3>
            {text ? children : null}
        </header>
    );
}
