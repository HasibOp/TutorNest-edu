import { ChevronDown } from "lucide-react";

const CategoryDropdown = ({categoryRef, isCategoryOpen, setIsCategoryOpen, categories, categoryId, setCategoryId, selectedCategoryName}) => {
    return (
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
    );
};

export default CategoryDropdown;
