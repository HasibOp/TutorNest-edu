import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";


const CountUp = ({ value = 0, duration = 1.1, delay = 0, className }) => {
    const shouldReduceMotion = useReducedMotion();
    const [animatedDisplay, setAnimatedDisplay] = useState(0);
    const display = shouldReduceMotion ? value : animatedDisplay;

    useEffect(() => {
        if (shouldReduceMotion) {
            return;
        }
        const controls = animate(0, value, {
            duration,
            delay,
            ease: "easeOut",
            onUpdate: (latest) => setAnimatedDisplay(Math.round(latest)),
        });
        return () => controls.stop();
    }, [value, duration, delay, shouldReduceMotion]);

    return <span className={className}>{display}</span>;
};

export default CountUp;
