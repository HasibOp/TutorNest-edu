import { Video, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { avatarSeeds, highlights, stats } from "@/components/data/HeroSectionData";

const Hero = () => {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
                <div className="text-left">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
                        <Star className="h-3 w-3 fill-fuchsia-300" />
                        Your Success, Our Mission
                    </span>

                    <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] text-white sm:text-5xl">
                        <span className="bg-linear-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                             Learn Better!
                            <br />
                            Achieve More!
                        </span>
                    </h1>

                    <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
                        At TutorNest-edu, we connect you with expert tutors, engaging
                        courses, and the support you need to unlock your full potential.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Button
                            size="lg"
                            className="h-11 rounded-full bg-linear-to-r from-amber-300 to-orange-400 px-6 text-sm font-semibold text-[#151b2e] hover:opacity-90">
                            Explore Courses
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-11 rounded-full border-white/15 bg-transparent px-6 text-sm font-semibold text-white hover:bg-white/10">
                            Find a Tutor
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                        {highlights.map((item) => (
                            <li
                                key={item}
                                className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative mx-auto w-full max-w-md">
                   
                    <img src="/hero.png"
                        alt="Student learning online with TutorNest-edu"
                        className="relative z-10 w-full"/>

                    <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-gray-600/50 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md">
                        <Video className="h-4 w-4 text-fuchsia-300" />
                        <div className="text-left">
                            <p className="font-semibold">Live Classes</p>
                            <p className="text-[10px] text-slate-300">Interactive & Engaging</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 sm:grid-cols-4">
                    {stats.map(({ icon: Icon, value, label }) => (
                        <div key={label} className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500/20 to-purple-600/20 text-fuchsia-300">
                                <Icon className="h-5 w-5" />
                            </span>
                            <div className="text-left">
                                <p className="text-lg font-bold text-white">{value}</p>
                                <p className="text-xs text-slate-400">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 pb-16 sm:px-6 lg:px-8">
                <p className="flex items-center gap-1.5 text-sm text-slate-400">
                    Trusted by thousands of students worldwide!
                </p>
                <div className="flex items-center">
                    {avatarSeeds.map((seed, index) => (
                        <img
                            key={seed}
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                            alt=""
                            className={`h-9 w-9 rounded-full border-2 border-[#151b2e] ${
                                index === 0 ? "" : "-ml-3"
                            }`}/>
                    ))}
                    <span className="-ml-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#151b2e] bg-fuchsia-500 text-[10px] font-semibold text-white">
                        +2K
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
