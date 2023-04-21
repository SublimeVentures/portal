
export default function LayoutFullscreen({ children }) {
    return (
        <div className="flex min-h-screen w-full bg-navy2 justify-center items-center flex-col">
            {children}
        </div>
    );
}
