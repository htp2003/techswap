import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';

type AnimatedCounterProps = {
    to: number;
    from?: number;
    animationOptions?: object;
};

export default function AnimatedCounter({ to, from = 0, animationOptions }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (inView) {
            animate(from, to, {
                duration: 1.5,
                ease: "easeOut",
                ...animationOptions,
                onUpdate(value) {
                    if (ref.current) {
                        ref.current.textContent = Math.round(value).toLocaleString();
                    }
                },
            });
        }
    }, [inView, from, to, animationOptions]);

    return <span ref={ref} />;
}