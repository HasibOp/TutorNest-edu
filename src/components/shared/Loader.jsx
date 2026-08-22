import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const Loader = () => {
    return (
        <div className="flex items-center justify-center gap-2.5 py-14 text-slate-400">
            <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="flex">
                <Loader2 className="h-5 w-5 text-fuchsia-400" />
            </motion.span>
            <span className="text-sm font-medium">Loading…</span>
        </div>
    );
};

export default Loader;
