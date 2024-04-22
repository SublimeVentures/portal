/**
 * @param {import("react").ReactNode} children
 * @returns {import("react").ReactNode}
 */
export default function Badge({ children }) {
    return <div className="inline-block border py-0.5 px-1">{children}</div>;
}
