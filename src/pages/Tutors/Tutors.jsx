import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid3x3, GraduationCap, LayoutList, Search, Sparkles } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Loader from "@/components/shared/Loader";
import TutorFilters from "@/components/tutor/TutorFilters";
import CategoryDropdown from "@/components/tutor/CategoryDropdown";
import TutorCard from "@/components/tutor/TutorCard";
import { PRICE_RANGES } from "@/components/tutor/priceRanges";

const Tutors = () => {
    const axiosPublic = useAxiosPublic();
    const [categoryId, setCategoryId] = useState("");
    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const [minRating, setMinRating] = useState(0);
    const [priceLabel, setPriceLabel] = useState('Any');

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await axiosPublic.get('/categories')).data,
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setIsCategoryOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCategoryName = categoryId
        ? categories.find((c) => c._id === categoryId)?.name || 'All Categories'
        : 'All Categories';

    const { data: tutors = [], isPending } = useQuery({
        queryKey: ['tutor-profiles', categoryId],
        queryFn: async () => {
            const res = await axiosPublic.get('/tutor-profiles', {
                params: categoryId ? { categoryId } : {},
            });
            return res.data;
        },
    });

    const visibleTutors = useMemo(() => {
        const q = search.trim().toLowerCase();

        return tutors.filter((tutor) => {
            if (q && !tutor.name?.toLowerCase().includes(q) && !tutor.subjects?.some((s) => s.toLowerCase().includes(q))) {
                return false;
            }
            if (minRating > 0 && (tutor.averageRating || 0) < minRating) {
                return false;
            }
            const priceRange = PRICE_RANGES[priceLabel];
            if (priceRange) {
                const [min, max] = priceRange;
                if (tutor.hourlyRate < min || tutor.hourlyRate > max) {
                    return false;
                }
            }
            return true;
        });
    }, [tutors, search, minRating, priceLabel]);

    const activeFilterCount = (minRating > 0 ? 1 : 0) + (priceLabel !== 'Any' ? 1 : 0);

    const clearFilters = () => {
        setMinRating(0);
        setPriceLabel('Any');
    };

    return (
        <div className="min-h-screen bg-[#020921]">
            <div className="relative overflow-hidden border-b border-white/10">
                <img
                    src="/tutorsBanner.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-[#020921] via-[#020921]/85 to-[#020921]/20" />
                <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        Find Guidance That Fits You
                    </span>
                    <h1 className="mt-4 max-w-xl text-3xl font-bold text-fuchsia-200 sm:text-4xl">
                        Learn from the Best, Achieve Your Goals
                    </h1>
                    <p className="mt-3 max-w-md text-sm text-slate-400">
                        Connect with expert tutors and start your learning journey today.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <CategoryDropdown
                        categoryRef={categoryRef}
                        isCategoryOpen={isCategoryOpen}
                        setIsCategoryOpen={setIsCategoryOpen}
                        categories={categories}
                        categoryId={categoryId}
                        setCategoryId={setCategoryId}
                        selectedCategoryName={selectedCategoryName}>
                    </CategoryDropdown>

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tutors..."
                                className="h-10 w-48 rounded-full border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-fuchsia-400/60 sm:w-64"
                            />
                        </div>

                        <TutorFilters
                            filterRef={filterRef}
                            isFilterOpen={isFilterOpen}
                            setIsFilterOpen={setIsFilterOpen}
                            minRating={minRating}
                            setMinRating={setMinRating}
                            priceLabel={priceLabel}
                            setPriceLabel={setPriceLabel}
                            activeFilterCount={activeFilterCount}
                            clearFilters={clearFilters}>
                        </TutorFilters>

                        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                            <button
                                type="button"
                                aria-label="Grid view"
                                onClick={() => setView("grid")}
                                className={`rounded-full p-1.5 transition-colors ${
                                    view === "grid" ? 'bg-fuchsia-500/80 text-white' : 'text-slate-400 hover:text-white'
                                }`}>
                                <Grid3x3 className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="List view"
                                onClick={() => setView("list")}
                                className={`rounded-full p-1.5 transition-colors ${
                                    view === "list" ? 'bg-fuchsia-500/80 text-white' : 'text-slate-400 hover:text-white'
                                }`}>
                                <LayoutList className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {isPending ? (
                    <div className="mt-10">
                        <Loader></Loader>
                    </div>
                ) : visibleTutors.length === 0 ? (
                    <div className="mt-10 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
                        <GraduationCap className="mx-auto h-8 w-8 text-fuchsia-400" />
                        <p className="mt-3 text-sm text-slate-300">
                            {tutors.length === 0 ? 'No tutors found.' : 'No tutors match your filters.'}
                        </p>
                        {tutors.length > 0 && (activeFilterCount > 0 || search) && (
                            <button
                                type="button"
                                onClick={() => {
                                    clearFilters();
                                    setSearch("");
                                }}
                                className="mt-3 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15">
                                Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={view === "grid"
                                ? "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                                : "mt-6 flex flex-col gap-4"}>
                        {visibleTutors.map((tutor) => (
                            <TutorCard key={tutor._id} tutor={tutor} view={view}></TutorCard>
                        ))}
                    </div>
                )}
            </div>

            <div className="border-t border-white/10 bg-white/2">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/15 text-fuchsia-300">🛡️</span>
                        <div>
                            <p className="text-sm font-semibold text-white">Verified Tutors</p>
                            <p className="text-xs text-slate-500">All tutors are verified</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">✅</span>
                        <div>
                            <p className="text-sm font-semibold text-white">Background Checked</p>
                            <p className="text-xs text-slate-500">Trusted & safe learning</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">⭐</span>
                        <div>
                            <p className="text-sm font-semibold text-white">Student Reviewed</p>
                            <p className="text-xs text-slate-500">Real reviews from students</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">🎧</span>
                        <div>
                            <p className="text-sm font-semibold text-white">24/7 Support</p>
                            <p className="text-xs text-slate-500">We're here to help</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutors;
