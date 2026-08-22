import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const TutorCard = ({ tutor, view }) => {
    return (
        <Link
            to={`/tutors/${tutor._id}`}
            className={view === "grid"
                    ? "group rounded-2xl border border-amber-400/20 bg-white/5 p-5 transition-colors hover:bg-white/10"
                    : "group flex flex-col gap-4 rounded-2xl border border-amber-400/20 bg-white/5 p-5 transition-colors hover:bg-white/10 sm:flex-row sm:items-center"
            }>
            <div className={view === "grid" ? "flex items-center gap-3" : "flex items-center gap-3 sm:w-64 sm:shrink-0"}>
                <img
                    src={tutor.photo || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
                    alt={tutor.name || "Tutor"}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"/>
                <div>
                    <p className="font-semibold text-white">{tutor.name || 'Unnamed Tutor'}</p>
                    {tutor.categoryName && (
                        <p className="text-xs font-medium text-fuchsia-400">{tutor.categoryName}</p>
                    )}
                    {tutor.totalReviews > 0 ? (
                        <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-amber-300">
                            <Star className="h-3 w-3 fill-amber-300" />
                            {tutor.averageRating.toFixed(1)} ({tutor.totalReviews})
                        </span>
                    ) : (
                        <span className="mt-0.5 inline-block text-xs text-slate-500">New</span>
                    )}
                </div>
            </div>

            <div className={view === "grid" ? "" : "flex-1"}>
                {tutor.bio && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-400 sm:mt-0">{tutor.bio}</p>
                )}

                {tutor.subjects?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {tutor.subjects.slice(0, 3).map((subject) => (
                            <span
                                key={subject}
                                className="rounded-full bg-fuchsia-500/15 px-2.5 py-0.5 text-xs font-medium text-fuchsia-300">
                                {subject}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className={
                    view === "grid"
                        ? "mt-4 flex items-center justify-between border-t border-amber-400/20 pt-3"
                        : "flex shrink-0 items-center gap-4 border-t border-amber-400/20 pt-3 sm:border-t-0 sm:pt-0"
                }>
                <span className="text-sm font-semibold text-white">${tutor.hourlyRate}/hr</span>
                <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-amber-400 transition-colors group-hover:bg-white/15">
                    <ArrowRight className="h-4 w-4" />
                </span>
            </div>
        </Link>
    );
};

export default TutorCard;
