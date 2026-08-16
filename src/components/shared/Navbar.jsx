import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BookOpen, Menu, Moon, Sparkles, Sun, X } from "lucide-react";
import { cn } from "../../lib/utils";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);

    const navLinks = [
        { label: "Home", to: "/" },
        { label: "About", to: "/about" },
        { label: "Courses", to: "/courses" },
        { label: "Tutors", to: "/tutors" },
        { label: "Contact", to: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-[#030c2d]/70 backdrop-blur-xs">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex shrink-0 items-center gap-2.5">
                    <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-500 to-purple-600 shadow-[0_0_14px_rgba(217,70,239,0.45)]">
                        <BookOpen className="h-5 w-5 text-white" strokeWidth={2.4} />
                        <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-fuchsia-200" />
                    </span>
                    <span className="flex flex-col leading-tight text-left">
                        <span className="text-lg font-bold text-white">
                            TutorNest<span className="text-fuchsia-400">-edu</span>
                        </span>
                    </span>
                </Link>

                <ul className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    cn("relative py-1 text-sm font-medium text-slate-300 transition-colors hover:text-white",
                                        isActive && "text-white after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-fuchsia-400")}>
                                {link.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        aria-label="Toggle theme"
                        onClick={() => setIsDark((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-200 transition-colors hover:bg-white/15">
                        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </button>
                    <Link
                        to="/login"
                        className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15">
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_16px_rgba(217,70,239,0.35)] transition-transform hover:scale-[1.03]">
                        Sign Up
                    </Link>
                </div>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-white/10 md:hidden">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {isMenuOpen && (
                <div className="border-t border-white/10 px-4 pb-4 md:hidden">
                    <ul className="flex flex-col gap-1 pt-3">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <NavLink
                                    to={link.to}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                        cn("block rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white",
                                            isActive && "bg-white/10 text-fuchsia-400")}>
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex items-center gap-3">
                        <button
                            type="button"
                            aria-label="Toggle theme"
                            onClick={() => setIsDark((prev) => !prev)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-200 hover:bg-white/15">
                            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </button>
                        <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 rounded-full bg-white/10 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-white/15">
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex-1 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-5 py-2 text-center text-sm font-semibold text-white">
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
