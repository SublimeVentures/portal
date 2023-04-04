export default function Layout({ children }) {
    return (
        <>
            <header>Website</header>
            <main>{children}</main>
            <aside>Sidebar</aside>
            <footer>&copy; Website</footer>
        </>
    );
}
