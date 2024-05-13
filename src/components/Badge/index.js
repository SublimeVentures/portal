import PropTypes from "prop-types";

export default function Badge({ children }) {
    return <span className="inline-block border border-gray rounded-full py-0.5 px-2">{children}</span>;
}

Badge.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};
