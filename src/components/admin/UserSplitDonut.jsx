import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2.5;


const UserSplitDonut = ({ segments, total }) => {
    const shouldReduceMotion = useReducedMotion();
    const [animatedProgress, setAnimatedProgress] = useState(0);
    const progress = shouldReduceMotion ? 1 : animatedProgress;

    useEffect(() => {
        if (shouldReduceMotion) {
            return;
        }
        const controls = animate(0, 1, {
            duration: 1.1,
            delay: 0.25,
            ease: "easeOut",
            onUpdate: setAnimatedProgress,
        });
        return () => controls.stop();
    }, [shouldReduceMotion]);

    if (!total) {
        return null;
    }

    let cursor = 0;
    const arcs = segments
        .filter((segment) => segment.value > 0)
        .map((segment) => {
            const full = (segment.value / total) * CIRCUMFERENCE;
            const drawn = Math.max(full * progress - GAP, 0);
            const arc = {
                ...segment,
                dash: `${drawn} ${CIRCUMFERENCE - drawn}`,
                offset: -cursor * progress,
            };
            // eslint-disable-next-line react-hooks/immutability
            cursor += full;
            return arc;
        });

    return (
        <div className="relative h-36 w-36 shrink-0 sm:h-40 sm:w-40">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle
                    cx="50"
                    cy="50"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="9"
                    className="text-white/5"/>
                {arcs.map((arc) => (
                    <circle
                        key={arc.label}
                        cx="50"
                        cy="50"
                        r={RADIUS}
                        fill="none"
                        stroke={arc.color}
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={arc.dash}
                        strokeDashoffset={arc.offset}
                    />
                ))}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-bold text-white">
                    {Math.round(total * progress)}
                </span>
                <span className="text-[11px] font-medium text-slate-400">users</span>
            </div>
        </div>
    );
};

export default UserSplitDonut;
