export default function Title({ subtitle, children, count }) {
    return (
        <>
            <h3 className="text-lg font-semibold lg:font-normal 3xl:font-normal text-foreground">
                {children}
                {count && <small className="text-xs font-light align-super ml-1">({count})</small>}
            </h3>
            {subtitle && <p className="hidden md:block text-sm md:text-base text-white/50">{subtitle}</p>}
        </>
    );
}
