// default animations

// motion variants
const baseVariants = {
    hidden: {
        opacity: 0,
        y: 5,
        transition: { staggerChildren: 0.1, duration: 0.2 },
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { staggerChildren: 0.2, duration: 0.3 },
    },
    scrolling: { scale: 0.95 },
};

const baseMotionSettings = {
    variants: baseVariants,
    animate: 'visible',
    initial: 'hidden',
    exit: 'hidden',
};

export { baseMotionSettings, baseVariants };
