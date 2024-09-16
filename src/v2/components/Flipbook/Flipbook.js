import React, { useState, useEffect, useMemo, useRef } from "react";
import Matrix from "./Matrix";
import DynamicIcon from "@/components/Icon";
import { cn } from "@/lib/cn";

const Flipbook = ({
    pages,
    pagesHiRes = [],
    flipDuration = 1000,
    zoomDuration = 500,
    zooms = [1, 2, 4],
    perspective = 2400,
    nPolygons = 10,
    ambient = 0.4,
    gloss = 0.6,
    swipeMin = 3,
    singlePage = false,
    forwardDirection = "right",
    centering = true,
    startPage = null,
    loadingImage = <DynamicIcon name={"spinner"} />,
    clickToZoom = true,
    dragToFlip = true,
    wheel = "scroll",
    onFlipLeftStart,
    onFlipRightStart,
    onFlipLeftEnd,
    onFlipRightEnd,
    onZoomStart,
    onZoomEnd,
}) => {
    const [viewWidth, setViewWidth] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(600);
    const [imageHeight, setImageHeight] = useState(900);
    const [displayedPages, setDisplayedPages] = useState(1);
    const [nImageLoad, setNImageLoad] = useState(0);
    const [nImageLoadTrigger, setNImageLoadTrigger] = useState(0);
    const [imageLoadCallback, setImageLoadCallback] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [firstPage, setFirstPage] = useState(0);
    const [secondPage, setSecondPage] = useState(1);
    const [zoomIndex, setZoomIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [zooming, setZooming] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchStartY, setTouchStartY] = useState(null);
    const [maxMove, setMaxMove] = useState(0);
    const [activeCursor, setActiveCursor] = useState(null);
    const [hasTouchEvents, setHasTouchEvents] = useState(false);
    const [hasPointerEvents, setHasPointerEvents] = useState(false);
    const [minX, setMinX] = useState(Infinity);
    const [maxX, setMaxX] = useState(-Infinity);
    const [preloadedImages, setPreloadedImages] = useState({});
    const [flip, setFlip] = useState({
        progress: 0,
        direction: null,
        frontImage: null,
        backImage: null,
        auto: false,
        opacity: 1,
    });
    const [currentCenterOffset, setCurrentCenterOffset] = useState(null);
    const [animatingCenter, setAnimatingCenter] = useState(false);
    const [startScrollLeft, setStartScrollLeft] = useState(0);
    const [startScrollTop, setStartScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [loadedImages, setLoadedImages] = useState({});

    const viewportRef = useRef(null);

    const pageUrl = (page, hiRes = false) => {
        // console.log("FLIP page url", page, hiRes, pagesHiRes[page], pages[page])
        if (hiRes && zoom > 1 && !zooming) {
            const url = pagesHiRes[page];
            if (url) return url;
        }
        return pages[page] || null;
    };

    const computeLighting = (rot, dRotate) => {
        const gradients = [];
        const lightingPoints = [-0.5, -0.25, 0, 0.25, 0.5];

        if (ambient < 1) {
            const blackness = 1 - ambient;
            const diffuse = lightingPoints.map(
                (d) => (1 - Math.cos(((rot - dRotate * d) / 180) * Math.PI)) * blackness,
            );
            gradients.push(
                `linear-gradient(to right, rgba(0, 0, 0, ${diffuse[0]}), rgba(0, 0, 0, ${diffuse[1]}) 25%, rgba(0, 0, 0, ${diffuse[2]}) 50%, rgba(0, 0, 0, ${diffuse[3]}) 75%, rgba(0, 0, 0, ${diffuse[4]}))`,
            );
        }

        if (gloss > 0 && !IE) {
            const DEG = 30;
            const POW = 200;
            const specular = lightingPoints.map((d) =>
                Math.max(
                    Math.pow(Math.cos(((rot + DEG - dRotate * d) / 180) * Math.PI), POW),
                    Math.pow(Math.cos(((rot - DEG - dRotate * d) / 180) * Math.PI), POW),
                ),
            );
            gradients.push(
                `linear-gradient(to right, rgba(255, 255, 255, ${specular[0] * gloss}), rgba(255, 255, 255, ${specular[1] * gloss}) 25%, rgba(255, 255, 255, ${specular[2] * gloss}) 50%, rgba(255, 255, 255, ${specular[3] * gloss}) 75%, rgba(255, 255, 255, ${specular[4] * gloss}))`,
            );
        }

        return gradients.join(",");
    };

    const makePolygonArray = (face) => {
        if (!flip.direction) {
            return [];
        }

        let progress = flip.progress;
        let direction = flip.direction;

        if (displayedPages === 1 && direction !== forwardDirection) {
            progress = 1 - progress;
            direction = forwardDirection;
        }

        setFlip((currentFlip) => ({
            ...currentFlip,
            opacity: displayedPages === 1 && progress > 0.7 ? 1 - (progress - 0.7) / 0.3 : 1,
        }));

        let image = face === "front" ? flip.frontImage : flip.backImage;

        let polygonWidth = pageWidth / nPolygons;

        let pageX = xMargin;
        let originRight = false;

        if (displayedPages === 1) {
            if (forwardDirection === "right") {
                if (face === "back") {
                    originRight = true;
                    pageX = xMargin - pageWidth;
                }
            } else {
                if (direction === "left") {
                    if (face === "back") {
                        pageX = pageWidth - xMargin;
                    } else {
                        originRight = true;
                    }
                } else {
                    if (face === "front") {
                        pageX = pageWidth - xMargin;
                    } else {
                        originRight = true;
                    }
                }
            }
        } else {
            if (direction === "left") {
                if (face === "back") {
                    pageX = viewWidth / 2;
                } else {
                    originRight = true;
                }
            } else {
                if (face === "front") {
                    pageX = viewWidth / 2;
                } else {
                    originRight = true;
                }
            }
        }

        let pageMatrix = new Matrix();
        pageMatrix.translate(viewWidth / 2);
        pageMatrix.perspective(perspective);
        pageMatrix.translate(-viewWidth / 2);
        pageMatrix.translate(pageX, yMargin);

        let pageRotation = 0;
        if (progress > 0.5) {
            pageRotation = -(progress - 0.5) * 2 * 180;
        }
        if (direction === "left") {
            pageRotation = -pageRotation;
        }
        if (face == "back") {
            pageRotation += 180;
        }

        if (pageRotation) {
            if (originRight) {
                pageMatrix.translate(pageWidth);
            }
            pageMatrix.rotateY(pageRotation);
            if (originRight) {
                pageMatrix.translate(-pageWidth);
            }
        }

        let theta;
        if (progress < 0.5) {
            theta = progress * 2 * Math.PI;
        } else {
            theta = (1 - (progress - 0.5) * 2) * Math.PI;
        }
        if (theta === 0) {
            theta = 1e-9;
        }
        let radius = pageWidth / theta;

        let radian = 0;
        let dRadian = theta / nPolygons;
        let rotate = (dRadian / 2 / Math.PI) * 180;
        let dRotate = (dRadian / Math.PI) * 180;

        if (originRight) {
            rotate = (-theta / Math.PI) * 180 + dRotate / 2;
        }

        if (face === "back") {
            rotate = -rotate;
            dRotate = -dRotate;
        }

        setMinX(Infinity);
        setMaxX(-Infinity);
        let polygons = [];
        for (let i = 0; i < nPolygons; i++) {
            const bgPos = `${(i / (nPolygons - 1)) * 100}% 0px`;

            const m = pageMatrix.clone();
            const rad = originRight ? theta - radian : radian;
            let x = Math.sin(rad) * radius;
            if (originRight) {
                x = pageWidth - x;
            }
            let z = (1 - Math.cos(rad)) * radius;
            if (face === "back") {
                z = -z;
            }

            m.translate3d(x, 0, z);
            m.rotateY(-rotate);

            const x0 = m.transformX(0);
            const x1 = m.transformX(polygonWidth);

            setMaxX((curMaxX) => Math.max(x0, x1, curMaxX));
            setMinX((curMinX) => Math.min(x0, x1, curMinX));

            const lighting = computeLighting(pageRotation - rotate, dRotate);

            radian += dRadian;
            rotate += dRotate;
            polygons.push([`${face}${i}`, image, lighting, bgPos, m.toString(), Math.abs(Math.round(z))]);
        }

        return polygons;
    };

    const IE = useMemo(() => {
        return typeof navigator !== "undefined" && /Trident/.test(navigator.userAgent);
    }, []);

    const zooms_ = useMemo(() => {
        return zooms || [1];
    }, [zooms]);

    const canGoForward = useMemo(() => {
        return !flip.direction && currentPage < pages.length - displayedPages;
    }, [flip, currentPage, pages, displayedPages]);

    const canGoBack = useMemo(() => {
        return !flip.direction && currentPage >= displayedPages && !(displayedPages === 1 && !pageUrl(firstPage - 1));
    }, [flip, currentPage, displayedPages, firstPage]);

    const canFlipLeft = useMemo(() => {
        return forwardDirection === "left" ? canGoForward : canGoBack;
    }, [forwardDirection, canGoForward, canGoBack]);

    const canFlipRight = useMemo(() => {
        return forwardDirection === "right" ? canGoForward : canGoBack;
    }, [forwardDirection, canGoForward, canGoBack]);

    // Idk why I reverted this but it works
    const canZoomOut = useMemo(() => {
        return !zooming && zoomIndex < zooms_.length - 1;
    }, [zooming, zoomIndex]);

    const canZoomIn = useMemo(() => {
        return !zooming && zoomIndex > 0;
    }, [zooming, zoomIndex]);

    const numPages = useMemo(() => {
        return pages[0] == null ? pages.length - 1 : pages.length;
    }, [pages]);

    const page = useMemo(() => {
        if (pages[0] != null) {
            return currentPage + 1;
        } else {
            return Math.max(1, currentPage);
        }
    }, [pages, currentPage]);

    const leftPage = useMemo(() => {
        if (forwardDirection === "right" || displayedPages === 1) {
            return firstPage;
        } else {
            return secondPage;
        }
    }, [forwardDirection, displayedPages, firstPage, secondPage]);

    const rightPage = useMemo(() => {
        return forwardDirection === "left" ? firstPage : secondPage;
    }, [forwardDirection, firstPage, secondPage]);

    const showLeftPage = useMemo(() => {
        return pageUrl(leftPage);
    }, [leftPage]);

    const showRightPage = useMemo(() => {
        return pageUrl(rightPage) && displayedPages === 2;
    }, [rightPage, displayedPages]);

    const cursor = useMemo(() => {
        if (activeCursor) {
            return activeCursor;
        } else if (IE) {
            return "auto";
        } else if (clickToZoom && canZoomIn) {
            return "zoom-in";
        } else if (clickToZoom && canZoomOut) {
            return "zoom-out";
        } else if (dragToFlip) {
            return "grab";
        } else {
            return "auto";
        }
    }, [activeCursor, IE, clickToZoom, canZoomIn, canZoomOut, dragToFlip]);

    const pageScale = useMemo(() => {
        const vw = viewWidth / displayedPages;
        const xScale = vw / imageWidth;
        const yScale = viewHeight / imageHeight;
        const scale = xScale < yScale ? xScale : yScale;
        return scale < 1 ? scale : 1;
    }, [viewWidth, displayedPages, imageWidth, viewHeight, imageHeight]);

    const padding = 24 * 2;

    const pageWidth = useMemo(
        () => Math.round((imageWidth - padding * pageScale) * pageScale),
        [imageWidth, pageScale],
    );
    const pageHeight = useMemo(
        () => Math.round((imageHeight - padding * pageScale) * pageScale),
        [imageHeight, pageScale],
    );

    const xMargin = useMemo(() => (viewWidth - pageWidth * displayedPages) / 2, [viewWidth, pageWidth, displayedPages]);
    const yMargin = useMemo(() => (viewHeight - pageHeight) / 2, [viewHeight, pageHeight]);

    const polygonWidth = useMemo(() => {
        let w = pageWidth / nPolygons;
        w = Math.ceil(w + 1 / zoom);
        return w + "px";
    }, [pageWidth, nPolygons, zoom]);

    const polygonHeight = useMemo(() => `${pageHeight}px`, [pageHeight]);
    const polygonBgSize = useMemo(() => `${pageWidth}px ${pageHeight}px`, [pageWidth, pageHeight]);

    const polygonArray = useMemo(() => makePolygonArray("front").concat(makePolygonArray("back")), [flip.progress]);

    const boundingLeft = useMemo(() => {
        if (displayedPages === 1) {
            return xMargin;
        } else {
            let x = pageUrl(leftPage) ? xMargin : viewWidth / 2;
            return x < minX ? x : minX;
        }
    }, [displayedPages, xMargin, minX, leftPage, viewWidth]);

    const boundingRight = useMemo(() => {
        if (displayedPages === 1) {
            return viewWidth - xMargin;
        } else {
            let x = pageUrl(rightPage) ? viewWidth - xMargin : viewWidth / 2;
            return x > maxX ? x : maxX;
        }
    }, [displayedPages, xMargin, maxX, rightPage, viewWidth]);

    const centerOffset = useMemo(() => {
        let retval = centering ? Math.round(viewWidth / 2 - (boundingLeft + boundingRight) / 2) : 0;
        if (currentCenterOffset === null && imageWidth !== null) {
            setCurrentCenterOffset(retval);
        }
        return retval;
    }, [centering, currentCenterOffset, boundingLeft, boundingRight, imageWidth, viewWidth]);

    const centerOffsetSmoothed = useMemo(() => {
        Math.round(currentCenterOffset);
    }, [currentCenterOffset]);

    const dragToScroll = useMemo(() => !hasTouchEvents, [hasTouchEvents]);

    const calculateScroll = (isMax) => {
        const w = (boundingRight - boundingLeft) * zoom;
        if (w < viewWidth) {
            return (boundingLeft + centerOffsetSmoothed) * zoom - (viewWidth - w) / 2;
        } else {
            return isMax
                ? (boundingRight + centerOffsetSmoothed) * zoom - viewWidth
                : (boundingLeft + centerOffsetSmoothed) * zoom;
        }
    };

    const scrollLeftMin = useMemo(() => {
        calculateScroll(false);
    }, [boundingLeft, boundingRight, zoom, centerOffsetSmoothed, viewWidth]);
    const scrollLeftMax = useMemo(() => {
        calculateScroll(true);
    }, [boundingLeft, boundingRight, zoom, centerOffsetSmoothed, viewWidth]);

    const scrollTopMin = useMemo(() => {
        const h = pageHeight * zoom;
        if (h < viewHeight) {
            return yMargin * zoom - (viewHeight - h) / 2;
        } else {
            return yMargin * zoom;
        }
    }, [pageHeight, zoom, viewHeight, yMargin]);

    const scrollTopMax = useMemo(() => {
        const h = pageHeight * zoom;
        if (h < viewHeight) {
            return yMargin * zoom - (viewHeight - h) / 2;
        } else {
            return (yMargin + pageHeight) * zoom - viewHeight;
        }
    }, [pageHeight, zoom, viewHeight, yMargin]);

    const scrollLeftLimited = useMemo(
        () => Math.min(scrollLeftMax, Math.max(scrollLeftMin, scrollLeft)),
        [scrollLeftMax, scrollLeftMin, scrollLeft],
    );
    const scrollTopLimited = useMemo(
        () => Math.min(scrollTopMax, Math.max(scrollTopMin, scrollTop)),
        [scrollTopMax, scrollTopMin, scrollTop],
    );

    const easeIn = (x) => Math.pow(x, 2);
    const easeOut = (x) => 1 - easeIn(1 - x);
    const easeInOut = (x) => {
        if (x < 0.5) {
            return easeIn(x * 2) / 2;
        } else {
            return 0.5 + easeOut((x - 0.5) * 2) / 2;
        }
    };

    const onResize = () => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        const viewWidth = viewport.clientWidth;
        const viewHeight = viewport.clientHeight;
        const displayedPages = viewWidth > viewHeight && !singlePage ? 2 : 1;

        setViewWidth(viewWidth);
        setViewHeight(viewHeight);
        setDisplayedPages(displayedPages);
        setCurrentPage((curPage) => (displayedPages === 2 ? currentPage & ~1 : curPage));
        fixFirstPage();
        setMinX(Infinity);
        setMaxX(-Infinity);
    };

    const fixFirstPage = () => {
        if (displayedPages == 1 && currentPage == 0 && pages.length && !pageUrl(0)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const pageUrlLoading = (page, hiRes = false) => {
        const url = pageUrl(page, hiRes);
        // console.log("FLIP pageUrlLoading url", url, hiRes, page)
        // High-res image doesn't use 'loading'
        if (hiRes && zoom > 1 && !zooming) {
            return url;
        }
        return url ? loadImage(url) : null;
    };

    const flipLeft = () => {
        if (!canFlipLeft) {
            return;
        }
        flipStart("left", true);
    };

    const flipRight = () => {
        if (!canFlipRight) {
            return;
        }
        flipStart("right", true);
    };

    const flipStart = (direction, auto) => {
        if (direction !== forwardDirection) {
            if (displayedPages === 1) {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    frontImage: pageUrl(currentPage - 1),
                    backImage: null,
                }));
            } else {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    frontImage: pageUrl(firstPage),
                    backImage: pageUrl(currentPage - displayedPages + 1),
                }));
            }
        } else {
            if (displayedPages === 1) {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    frontImage: pageUrl(currentPage),
                    backImage: null,
                }));
            } else {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    frontImage: pageUrl(secondPage),
                    backImage: pageUrl(currentPage + displayedPages),
                }));
            }
        }

        setFlip((currentFlip) => ({
            ...currentFlip,
            direction: direction,
            progress: 0,
        }));

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (direction !== forwardDirection) {
                    if (displayedPages === 2) {
                        setFirstPage(currentPage - displayedPages);
                    }
                } else {
                    if (displayedPages === 1) {
                        setFirstPage(currentPage + displayedPages);
                    } else {
                        setSecondPage(currentPage + 1 + displayedPages);
                    }
                }

                if (auto) {
                    flipAuto(true);
                }
            });
        });
    };

    const flipAuto = (ease) => {
        const t0 = Date.now();
        const duration = flipDuration * (1 - flip.progress);
        const startRatio = flip.progress;

        setFlip((currentFlip) => ({
            ...currentFlip,
            auto: true,
        }));

        if (flip.direction === "left") {
            if (onFlipLeftStart) onFlipLeftStart();
        } else if (flip.direction === "right") {
            if (onFlipRightStart) onFlipRightStart();
        }

        const animate = () => {
            requestAnimationFrame(() => {
                const t = Date.now() - t0;
                let ratio = startRatio + t / duration;
                ratio = ratio > 1 ? 1 : ratio;

                setFlip((currentFlip) => ({
                    ...currentFlip,
                    progress: ease ? easeInOut(ratio) : ratio,
                }));

                if (ratio < 1) {
                    requestAnimationFrame(animate);
                } else {
                    let newCurrentPage = currentPage;
                    if (flip.direction !== forwardDirection) {
                        newCurrentPage -= displayedPages;
                    } else {
                        newCurrentPage += displayedPages;
                    }

                    setCurrentPage(newCurrentPage);

                    // Emitting flip-end event
                    if (flip.direction === "left") {
                        if (onFlipLeftEnd) onFlipLeftEnd();
                    } else if (flip.direction === "right") {
                        if (onFlipRightEnd) onFlipRightEnd();
                    }

                    if (displayedPages === 1 && flip.direction === forwardDirection) {
                        setFlip((currentFlip) => ({
                            ...currentFlip,
                            direction: null,
                        }));
                    } else {
                        onImageLoad(1, () => {
                            setFlip((currentFlip) => ({
                                ...currentFlip,
                                direction: null,
                            }));
                        });
                    }
                    setFlip((currentFlip) => ({
                        ...currentFlip,
                        auto: false,
                    }));
                }
            });
        };

        animate();
    };

    const flipRevert = () => {
        const t0 = Date.now();
        const duration = flipDuration * flip.progress;
        const startRatio = flip.progress;

        setFlip((currentFlip) => ({
            ...currentFlip,
            auto: true,
        }));

        const animate = () => {
            requestAnimationFrame(() => {
                const t = Date.now() - t0;
                let ratio = startRatio - (startRatio * t) / duration;
                ratio = ratio < 0 ? 0 : ratio;

                setFlip((currentFlip) => ({
                    ...currentFlip,
                    progress: ratio,
                }));

                if (ratio > 0) {
                    requestAnimationFrame(animate);
                } else {
                    setFirstPage(currentPage);
                    setSecondPage(currentPage + 1);

                    if (displayedPages === 1 && flip.direction !== forwardDirection) {
                        setFlip((currentFlip) => ({
                            ...currentFlip,
                            direction:
                                displayedPages === 1 && currentFlip.direction !== forwardDirection
                                    ? null
                                    : currentFlip.direction,
                        }));
                    } else {
                        onImageLoad(1, () => {
                            setFlip((currentFlip) => ({
                                ...currentFlip,
                                direction: null,
                            }));
                        });
                    }
                    setFlip((currentFlip) => ({
                        ...currentFlip,
                        auto: false,
                    }));
                }
            });
        };

        animate();
    };

    const onImageLoad = (trigger, cb) => {
        setNImageLoad(0);
        setNImageLoadTrigger(trigger);
        setImageLoadCallback(cb);
    };

    const didLoadImage = (ev) => {
        // console.log("FLIP didLoadImage")
        if (imageWidth === null) {
            const image = ev.target || ev.path[0];
            setImageWidth(image.naturalWidth);
            setImageHeight(image.naturalHeight);
            preloadImages();
        }

        if (!imageLoadCallback) {
            return;
        }

        setNImageLoad((curVal) => curVal + 1);

        if (nImageLoad >= nImageLoadTrigger) {
            imageLoadCallback();
            setImageLoadCallback(null);
        }
    };

    const zoomIn = (zoomAt = null) => {
        if (!canZoomIn) {
            return;
        }
        setZoomIndex((curVal) => curVal + 1);
        zoomTo(zooms_[zoomIndex], zoomAt);
    };

    const zoomOut = (zoomAt = null) => {
        if (!canZoomOut) {
            return;
        }

        setZoomIndex((curVal) => curVal - 1);
        zoomTo(zooms_[zoomIndex], zoomAt);
    };

    const zoomTo = (_zoom, zoomAt = null) => {
        const viewport = viewportRef.current;
        let fixedX, fixedY;

        if (zoomAt) {
            const rect = viewport.getBoundingClientRect();
            fixedX = zoomAt.pageX - rect.left;
            fixedY = zoomAt.pageY - rect.top;
        } else {
            fixedX = viewport.clientWidth / 2;
            fixedY = viewport.clientHeight / 2;
        }

        const start = zoom;
        const end = _zoom;
        const startX = viewport.scrollLeft;
        const startY = viewport.scrollTop;
        const containerFixedX = fixedX + startX;
        const containerFixedY = fixedY + startY;
        const endX = (containerFixedX / start) * end - fixedX;
        const endY = (containerFixedY / start) * end - fixedY;

        const t0 = Date.now();
        setZooming(true);

        if (onZoomStart) onZoomStart();

        const animate = () => {
            requestAnimationFrame(() => {
                const t = Date.now() - t0;
                let ratio = t / zoomDuration;
                if (ratio > 1 || IE) ratio = 1;
                ratio = easeInOut(ratio);

                setZoom(start + (end - start) * ratio);
                setScrollLeft(startX + (endX - startX) * ratio);
                setScrollTop(startY + (endY - startY) * ratio);

                if (t < zoomDuration) {
                    requestAnimationFrame(animate);
                } else {
                    // Emitting zoom-end event
                    if (onZoomEnd) onZoomEnd();
                    setZooming(false);
                    setZoom(_zoom);
                    setScrollLeft(endX);
                    setScrollTop(endY);
                }
            });
        };

        animate();

        if (end > 1) {
            // console.log("FLIP animate - preloadImage")
            preloadImages(true);
        }
    };

    const zoomAt = (zoomAt) => {
        setZoomIndex((curVal) => (curVal + 1) % zooms_.length);
        zoomTo(zooms_[zoomIndex], zoomAt);
    };

    const swipeStart = (touch) => {
        setTouchStartX(touch.pageX);
        setTouchStartY(touch.pageY);
        setMaxMove(0);
        if (zoom <= 1) {
            if (dragToFlip) {
                setActiveCursor("grab");
            }
        } else {
            const viewport = viewportRef.current;
            setStartScrollLeft(viewport.scrollLeft);
            setStartScrollTop(viewport.scrollTop);
            setActiveCursor("all-scroll");
        }
    };

    const swipeMove = (touch) => {
        if (touchStartX === null) return;
        const x = touch.pageX - touchStartX;
        const y = touch.pageY - touchStartY;
        setMaxMove(Math.max(maxMove, Math.abs(x), Math.abs(y)));

        if (zoom > 1) {
            if (dragToScroll) {
                dragScroll(x, y);
            }
            return;
        }

        if (!dragToFlip || Math.abs(y) > Math.abs(x)) return;

        setActiveCursor("grabbing");

        if (x > 0) {
            if (flip.direction === null && canFlipLeft && x >= swipeMin) {
                flipStart("left", false);
            }
            if (flip.direction === "left") {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    progress: Math.min(1, x / pageWidth),
                }));
            }
        } else {
            if (flip.direction === null && canFlipRight && x <= -swipeMin) {
                flipStart("right", false);
            }
            if (flip.direction === "right") {
                setFlip((currentFlip) => ({
                    ...currentFlip,
                    progress: Math.min(1, -x / pageWidth),
                }));
            }
        }

        return true;
    };

    const swipeEnd = (touch) => {
        if (!touchStartX) {
            return;
        }

        if (clickToZoom && maxMove < swipeMin) {
            zoomAt(touch);
        }

        if (flip.direction !== null && !flip.auto) {
            if (flip.progress > 0.25) {
                flipAuto(false);
            } else {
                flipRevert();
            }
        }

        setTouchStartX(null);
        setActiveCursor(null);
    };

    const onTouchStart = (ev) => {
        setHasTouchEvents(true);
        swipeStart(ev.changedTouches[0]);
    };

    const onTouchMove = (ev) => {
        if (swipeMove(ev.changedTouches[0])) {
            if (ev.cancelable) {
                ev.preventDefault();
            }
        }
    };

    const onTouchEnd = (ev) => {
        swipeEnd(ev.changedTouches[0]);
    };

    const onPointerDown = (ev) => {
        setHasPointerEvents(true);
        if (hasTouchEvents) return;
        if (ev.which && ev.which !== 1) return; // Ignore right-click

        swipeStart(ev);

        try {
            ev.target.setPointerCapture(ev.pointerId);
        } catch (error) {
            console.error(error);
        }
    };

    const onPointerMove = (ev) => {
        if (!hasTouchEvents) {
            swipeMove(ev);
        }
    };

    const onPointerUp = (ev) => {
        if (hasTouchEvents) return;
        swipeEnd(ev);
        try {
            ev.target.releasePointerCapture(ev.pointerId);
        } catch (error) {
            console.error(error);
        }
    };

    const onMouseDown = (ev) => {
        if (hasTouchEvents || hasPointerEvents) return;
        if (ev.which && ev.which != 1) return; // Ignore right-click
        swipeStart(ev);
    };

    const onMouseMove = (ev) => {
        if (!hasTouchEvents && !hasPointerEvents) {
            swipeMove(ev);
        }
    };

    const onMouseUp = (ev) => {
        if (!hasTouchEvents && !hasPointerEvents) {
            swipeEnd(ev);
        }
    };

    const dragScroll = (x, y) => {
        setScrollLeft(startScrollLeft - x);
        setScrollTop(startScrollTop - y);
    };

    const onWheel = (ev) => {
        if (wheel === "scroll" && zoom > 1 && dragToScroll) {
            const newScrollLeft = viewportRef.current.scrollLeft + ev.deltaX;
            const newScrollTop = viewportRef.current.scrollTop + ev.deltaY;
            setScrollLeft(newScrollLeft);
            setScrollTop(newScrollTop);

            if (ev.cancelable) {
                ev.preventDefault();
            }
        }

        if (wheel === "zoom") {
            if (ev.deltaY >= 100) {
                zoomOut(ev);
                ev.preventDefault();
            } else if (ev.deltaY <= -100) {
                zoomIn(ev);
                ev.preventDefault();
            }
        }
    };

    const preloadImages = (hiRes = false) => {
        // console.log("FLIP preload")
        for (let i = currentPage - 3; i <= currentPage + 3; i++) {
            // console.log("FLIP preload", i)

            pageUrlLoading(i); // this preloads image
        }

        if (hiRes) {
            for (let i = currentPage; i < currentPage + displayedPages; i++) {
                const src = pagesHiRes[i];
                if (src) {
                    const image = new Image();
                    image.src = src;
                }
            }
        }
    };

    const goToPage = (p) => {
        if (p === null || p === page) return;
        let newCurrentPage;

        if (pages[0] === null) {
            if (displayedPages === 2 && p === 1) {
                newCurrentPage = 0;
            } else {
                newCurrentPage = p;
            }
        } else {
            newCurrentPage = p - 1;
        }

        setCurrentPage(newCurrentPage);
        setMinX(Infinity);
        setMaxX(-Infinity);
        setCurrentCenterOffset(centerOffset);
    };

    const loadImage = (url) => {
        if (imageWidth == null) {
            // First loaded image defines the image width and height.
            // So it must be true image, not 'loading' image.
            return url;
        } else {
            if (loadedImages[url]) {
                return url;
            } else {
                // console.log("FLIP MAGA url",url)
                // //todo: uncomment and fix
                // const img = new Image();
                // img.onload = () => {
                //     setLoadedImages({ ...loadedImages, [url]: true });
                // };
                // img.src = url;
                // return loadingImage;
                return url;
            }
        }
    };
    // ... more event handlers

    useEffect(() => {
        setFirstPage(currentPage);
        setSecondPage(currentPage + 1);
        preloadImages();
    }, [currentPage]);

    useEffect(() => {
        if (animatingCenter) return;

        let animationFrameId;

        const animate = () => {
            const rate = 0.1;
            const diff = centerOffset - currentCenterOffset;
            if (Math.abs(diff) < 0.5) {
                setCurrentCenterOffset(centerOffset);
                setAnimatingCenter(false);
            } else {
                setCurrentCenterOffset((prevOffset) => prevOffset + diff * rate);
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();

        // Cleanup function to cancel the animation frame when the component unmounts or conditions change
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [centerOffset]);

    useEffect(() => {
        if (viewportRef.current) {
            const updateScrollLeft = () => {
                viewportRef.current.scrollLeft = scrollLeft;
            };

            if (IE) {
                requestAnimationFrame(updateScrollLeft);
            } else {
                updateScrollLeft();
            }
        }
    }, [scrollLeft]);

    useEffect(() => {
        if (viewportRef.current) {
            const updateScrollTop = () => {
                viewportRef.current.scrollTop = scrollTop;
            };

            if (IE) {
                requestAnimationFrame(updateScrollTop);
            } else {
                updateScrollTop();
            }
        }
    }, [scrollTop]);

    useEffect(() => {
        fixFirstPage();

        if (pages && pages.length > 0) {
            if (!startPage || startPage > 1) {
                if (pages[0] === null) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }
            }
        }
    }, [pages]);

    useEffect(() => {
        goToPage(startPage);
    }, [startPage]);

    // Lifecycle methods using useEffect
    useEffect(() => {
        // ComponentDidMount logic...
        window.addEventListener("resize", onResize, { passive: true });
        onResize();
        setZoom(zooms_[0]);
        goToPage(startPage);
        return () => {
            // ComponentWillUnmount logic...
            window.removeEventListener("resize", onResize, { passive: true });
        };
    }, []);
    const zoomActive = zooming || zoom > 1;
    // console.log("FLIP RENDER")
    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            className={cn("aspect-a4-vertical md:aspect-a4-horizontal 2xl:aspect-auto 2xl:h-[860px] 2xl:w-full", {
                "overflow-scroll": zoomActive && !dragToScroll,
                "overflow-hidden rounded": zoomActive && dragToScroll,
                "cursor-grabbing": cursor === "grabbing",
                "cursor-auto": cursor !== "grabbing",
            })}
            ref={viewportRef}
            onTouchMove={onTouchMove}
            onPointerMove={onPointerMove}
            onMouseMove={onMouseMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onMouseUp={onMouseUp}
            onWheel={onWheel}
        >
            <div className="w-full h-full relative select-none origin-top-left" style={{ transform: `scale(${zoom})` }}>
                <div
                    className={cn("absolute h-full w-1/2 top-0 left-0 select-none", {
                        "cursor-pointer": canFlipLeft,
                        "cursor-auto": !canFlipLeft,
                    })}
                    onClick={flipLeft}
                />
                <div
                    className={cn("absolute h-full w-1/2 top-0 right-0 select-none", {
                        "cursor-pointer": canFlipRight,
                        "cursor-auto": !canFlipRight,
                    })}
                    onClick={flipRight}
                />
                <div
                    style={{
                        transform: `translateX(${centerOffsetSmoothed}px)`,
                    }}
                >
                    {showLeftPage && (
                        <img
                            className="absolute backface-hidden"
                            style={{
                                width: `${pageWidth}px`,
                                height: `${pageHeight}px`,
                                left: `${xMargin}px`,
                                top: `${yMargin}px`,
                            }}
                            // src={"https://cdn.basedvc.fund/research/shrapnel-nodes/ResearchReport_page-0008.jpg"}
                            src={pageUrlLoading(leftPage, true)}
                            onLoad={didLoadImage}
                        />
                    )}
                    {showRightPage && (
                        <img
                            className="absolute backface-hidden"
                            style={{
                                width: `${pageWidth}px`,
                                height: `${pageHeight}px`,
                                left: `${viewWidth / 2}px`,
                                top: `${yMargin}px`,
                            }}
                            // src={"https://cdn.basedvc.fund/research/shrapnel-nodes/ResearchReport_page-0007.jpg"}
                            src={pageUrlLoading(rightPage, true)}
                            onLoad={didLoadImage}
                        />
                    )}

                    <div style={{ opacity: flip.opacity }}>
                        {polygonArray.map(([key, bgImage, lighting, bgPos, transform, z]) => (
                            <div
                                key={key}
                                className={`absolute top-0 left-0 origin-[center_left] backface-hidden ${!bgImage ? "blank" : ""}`}
                                style={{
                                    backgroundImage: bgImage && `url(${loadImage(bgImage)})`,
                                    backgroundSize: polygonBgSize,
                                    backgroundPosition: bgPos,
                                    width: polygonWidth,
                                    height: polygonHeight,
                                    transform: transform,
                                    zIndex: z,
                                }}
                            >
                                {lighting.length > 0 && (
                                    <div
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: lighting,
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div
                        className="absolute select-none"
                        style={{
                            left: `${boundingLeft}px`,
                            top: `${yMargin}px`,
                            width: `${boundingRight - boundingLeft}px`,
                            height: `${pageHeight}px`,
                            cursor: cursor,
                        }}
                        onTouchStart={onTouchStart}
                        onPointerDown={onPointerDown}
                        onMouseDown={onMouseDown}
                    />
                </div>
            </div>
        </div>
    );
};

export default Flipbook;
