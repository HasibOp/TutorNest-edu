import { Filter } from "lucide-react";
import { PRICE_RANGES } from "../../lib/priceRanges";

const RATING_OPTIONS = [0, 3, 4, 4.5];

const TutorFilters = ({filterRef, isFilterOpen,setIsFilterOpen, minRating, setMinRating, priceLabel, setPriceLabel, activeFilterCount, clearFilters}) => {
    return (
        <div className="relative" ref={filterRef}>
            <button
                type="button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                className="relative inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10">
                <Filter className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-fuchsia-500 text-[10px] font-bold text-white">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {isFilterOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0a1130] p-4 shadow-xl">
                    <div>
                        <p className="text-xs font-medium text-slate-400">Minimum rating</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {RATING_OPTIONS.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setMinRating(value)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                        minRating === value
                                            ? 'bg-fuchsia-500/15 text-fuchsia-300'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}>
                                    {value === 0 ? 'Any' : `${value}+`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-xs font-medium text-slate-400">Hourly rate</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {Object.keys(PRICE_RANGES).map((label) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => setPriceLabel(label)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                                        priceLabel === label
                                            ? 'bg-fuchsia-500/15 text-fuchsia-300'
                                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                                    }`}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 w-full rounded-lg bg-white/5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10">
                            Clear filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorFilters;
