import { useEffect, useState } from 'react';

/**
 * @typedef {Object} IntersectionObserverOptions
 * @property {number} [threshold=1] A value between 0 and 1 indicating the percentage of the target's visibility the observer's callback should trigger on. For example, 0.5 means the callback will be executed when 50% of the target is visible.
 * @property {Element|null} [root=null] The element that is used as the viewport for checking the visibility of the target. If null, it defaults to the browser viewport.
 * @property {string} [rootMargin="0px"] A margin around the root. This can be used to grow or shrink the area used for intersection. It follows the same syntax as the CSS margin property (e.g., "10px 20px 30px 40px").
 */
export const defaultIntersectionOptions = Object.freeze({
    threshold: 1,
    root: null,
    rootMargin: "0px",
});

/**
 * Custom hook to observe the intersection of an element with the viewport or a specified root.
 *
 * @param {React.RefObject<HTMLElement>} ref The reference to the element to be observed.
 * @param {IntersectionObserverOptions} [options=defaultIntersectionOptions] The options for the Intersection Observer.
 * @param {Function} [callback] A callback function that is executed when the element intersects with the viewport or root.
 * @returns {boolean} isIntersecting Whether the element is currently intersecting with the viewport or root.
 */
export default function useIntersectionObserver(ref, callback, options = defaultIntersectionOptions) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const observerCallback = ([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (callback) {
                callback(entry.isIntersecting);
            }
        };

        const observer = new IntersectionObserver(observerCallback, options);
    
        if (ref.current) {
            observer.observe(ref.current);
        }
    
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options, callback]);
    
    return isIntersecting;
};
