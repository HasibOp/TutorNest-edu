import { motion } from "framer-motion";

const EmptyState = ({ icon: Icon, title, hint, action }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-12 text-center">
            <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-500/10">
                <Icon className="h-7 w-7 text-fuchsia-400" />
            </motion.span>
            <p className="mt-4 font-heading text-lg font-semibold text-white">{title}</p>
            {hint && <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-400">{hint}</p>}
            {action && <div className="mt-5">{action}</div>}
        </motion.div>
    );
};

export default EmptyState;
