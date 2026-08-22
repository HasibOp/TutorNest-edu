import { useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import AuthContext from "@/provider/AuthContext";
import Loader from "@/components/shared/Loader";
import ProfileHeader from "@/components/tutor/ProfileHeader";
import BasicsSection from "@/components/tutor/BasicsSection";
import SubjectsSection from "@/components/tutor/SubjectsSection";
import AvailabilitySection from "@/components/tutor/AvailabilitySection";

const emptySlot = { day: "Monday", startTime: "09:00", endTime: "10:00" };

const Profile = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);

    const [categoryId, setCategoryId] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [subjectInput, setSubjectInput] = useState("");
    const [bio, setBio] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [availability, setAvailability] = useState([]);

    const { data: profile, isPending: isProfilePending } = useQuery({
        queryKey: ['tutor-profile', user?.email],
        enabled: !!user?.email,
        queryFn: async () => (await axiosSecure.get('/tutor-profiles/me')).data,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => (await axiosSecure.get('/categories')).data,
    });

    useEffect(() => {
        if (profile) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCategoryId(profile.categoryId || "");
            setSubjects(profile.subjects || []);
            setBio(profile.bio || "");
            setHourlyRate(profile.hourlyRate || "");
            setAvailability(profile.availability || []);
        }
    }, [profile]);

    const { mutate: saveProfile, isPending: isSaving } = useMutation({
        mutationFn: async (payload) => (await axiosSecure.put('/tutor-profiles/me', payload)).data,
        onSuccess: () => {
            toast.success('Profile saved');
            queryClient.invalidateQueries({ queryKey: ['tutor-profile', user?.email] });
        },
        onError: () => toast.error('Failed to save profile'),
    });

    const checklist = useMemo(() => [
        { label: 'Category', done: Boolean(categoryId) },
        { label: 'Hourly rate', done: Boolean(String(hourlyRate).trim()) },
        { label: 'Bio', done: Boolean(bio.trim()) },
        { label: 'Subjects', done: subjects.length > 0 },
        { label: 'Availability', done: availability.length > 0 },
    ], [categoryId, hourlyRate, bio, subjects, availability]);

    const completed = checklist.filter((item) => item.done).length;
    const completeness = Math.round((completed / checklist.length) * 100);

    const addSubject = () => {
        const value = subjectInput.trim();
        if (value && !subjects.includes(value)) {
            setSubjects([...subjects, value]);
        }
        setSubjectInput("");
    };
    const removeSubject = (subject) => {
        setSubjects(subjects.filter((s) => s !== subject));
    };

    const addSlot = () => setAvailability([...availability, { ...emptySlot }]);
    const updateSlot = (index, field, value) => {
        setAvailability(availability.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    };
    const removeSlot = (index) => setAvailability(availability.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        saveProfile({ categoryId, subjects, bio, hourlyRate, availability });
    };

    if (isProfilePending) {
        return <Loader></Loader>;
    }

    return (
        <div className="space-y-6">
            <ProfileHeader checklist={checklist} completeness={completeness}></ProfileHeader>

            <form onSubmit={handleSubmit} className="space-y-5">
                <BasicsSection
                    categories={categories}
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    hourlyRate={hourlyRate}
                    setHourlyRate={setHourlyRate}
                    bio={bio}
                    setBio={setBio}
                ></BasicsSection>

                <SubjectsSection
                    subjects={subjects}
                    subjectInput={subjectInput}
                    setSubjectInput={setSubjectInput}
                    addSubject={addSubject}
                    removeSubject={removeSubject}
                ></SubjectsSection>

                <AvailabilitySection
                    availability={availability}
                    addSlot={addSlot}
                    updateSlot={updateSlot}
                    removeSlot={removeSlot}
                ></AvailabilitySection>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.34, ease: "easeOut" }}
                    className="flex flex-wrap items-center gap-4">
                    <motion.button
                        type="submit"
                        disabled={isSaving}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex h-12 items-center gap-2 rounded-full bg-linear-to-r from-fuchsia-500 to-purple-600 px-7 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 disabled:opacity-50">
                        {isSaving ? 'Saving...' : (
                            <>
                                <CheckCircle2 className="h-4 w-4" /> Save profile
                            </>
                        )}
                    </motion.button>

                    {completeness < 100 && (
                        <p className="text-xs text-slate-400">
                            {checklist.length - completed} thing{checklist.length - completed > 1 ? 's' : ''} left before students see a full profile.
                        </p>
                    )}
                </motion.div>
            </form>
        </div>
    );
};

export default Profile;
