import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Grid3x3, GraduationCap, LayoutList, Search, Sparkles } from "lucide-react";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Loader from "@/components/shared/Loader";

const Tutors = () => {
    const axiosPublic = useAxiosPublic();
    const [categoryId, setCategoryId] = useState("");
    const [search, setSearch] = useState("");
    const [view, setView] = useState("grid");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await axiosPublic.get('/categories')).data,
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setIsCategoryOpen(false);
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
        if (!q) return tutors;
        return tutors.filter((tutor) =>
            tutor.name?.toLowerCase().includes(q) ||
            tutor.subjects?.some((s) => s.toLowerCase().includes(q))
        );
    }, [tutors, search]);

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
                    <div className="relative" ref={categoryRef}>
                        <button
                            type="button"
                            onClick={() => setIsCategoryOpen((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                            {selectedCategoryName}
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCategoryOpen && (
                            <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-2xl border border-white/10 bg-[#0a1130] p-2 shadow-xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCategoryId("");
                                        setIsCategoryOpen(false);
                                    }}
                                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                        categoryId === ""
                                            ? 'bg-fuchsia-500/15 text-fuchsia-300'
                                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}>
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        type="button"
                                        onClick={() => {
                                            setCategoryId(category._id);
                                            setIsCategoryOpen(false);
                                        }}
                                        className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                                            categoryId === category._id
                                                ? 'bg-fuchsia-500/15 text-fuchsia-300'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}>
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
                        <p className="mt-3 text-sm text-slate-300">No tutors found.</p>
                    </div>
                ) : (
                    <div
                        className={
                            view === "grid"
                                ? "mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                                : "mt-6 flex flex-col gap-4"
                        }>
                        {visibleTutors.map((tutor) => (
                            <Link
                                key={tutor._id}
                                to={`/tutors/${tutor._id}`}
                                className={
                                    view === "grid"
                                        ? "group rounded-2xl border border-amber-400/20 bg-white/5 p-5 transition-colors hover:bg-white/10"
                                        : "group flex flex-col gap-4 rounded-2xl border border-amber-400/20 bg-white/5 p-5 transition-colors hover:bg-white/10 sm:flex-row sm:items-center"
                                }>
                                <div className={view === "grid" ? "flex items-center gap-3" : "flex items-center gap-3 sm:w-64 sm:shrink-0"}>
                                    <img
                                        src={tutor.photo || "https://i.ibb.co/2FsfXqM/default-avatar.png"}
                                        alt={tutor.name || "Tutor"}
                                        className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">{tutor.name || 'Unnamed Tutor'}</p>
                                        {tutor.categoryName && (
                                            <p className="text-xs font-medium text-fuchsia-400">{tutor.categoryName}</p>
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

                                <div
                                    className={
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
