function Button({
    type,
    onClick,
    children,
    className,
}: {
    type?: "submit" | "button" | "reset";
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`${className} bg-primary-600 hover:bg-primary-600/75 border-0 rounded-[35px] outline-none text-white text-center cursor-pointer`}
        >
            {children}
        </button>
    );
}

export default Button;
