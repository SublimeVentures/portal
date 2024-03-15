export default function LayoutFullscreen({ children }) {
    return (
        <div className="flex min-h-screen w-full bg-app-bg justify-center items-center flex-col">
            {children}
        </div>
    );
}
