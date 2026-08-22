const getInitials = (name = '') => {
const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const SIZES = {
    sm: "h-9 w-9 text-[11px]",
    md: "h-11 w-11 text-sm",
};

const Avatar = ({ name, src, size = "md", ring = "ring-white/10" }) => {
    const dimension = SIZES[size] || SIZES.md;

    if (src) {
        return (
            <img
                src={src}
                alt={name || 'User'}
                className={`${dimension} shrink-0 rounded-full object-cover ring-2 ${ring}`}/>
        );
    }

    return (
        <span
            aria-hidden="true"
            className={`${dimension} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 font-bold text-white ring-2 ${ring}`}>
            {getInitials(name)}
        </span>
    );
};

export default Avatar;
