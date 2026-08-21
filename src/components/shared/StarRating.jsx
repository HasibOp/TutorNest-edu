import { Star } from "lucide-react";

const StarRating = ({ rating = 0, size = "h-3 w-3" }) => {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => {
                const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
                return (
                    <div key={i} className={`relative ${size}`}>
                        <Star className={`absolute inset-0 ${size} text-slate-600`} />
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                            <Star className={`${size} fill-amber-300 text-amber-300`} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StarRating;
