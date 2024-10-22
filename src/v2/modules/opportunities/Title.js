export default function Title({ subtitle, children, count }) {
    return (
        <div className="sm:flex sm:gap-4 sm:items-center lg:block select-none">
            <h3 className="text-lg sm:text-base lg:text-lg font-semibold sm:font-medium lg:font-normal text-white font-heading">
                <span className="text-nowrap">{children}</span>
                {count !== null && (
                    <small className="text-xs sm:text-2xs font-light align-super ml-1 inline-block sm:min-w-5">
                        {count > 0 ? <>({count})</> : null}
                    </small>
                )}
            </h3>
            {subtitle && (
                <p className="hidden sm:block text-sm lg:text-base sm:font-light lg:font-normal text-white/50">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
