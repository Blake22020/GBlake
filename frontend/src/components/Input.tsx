interface InputProps {
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    className?: string;
    id?: string;
}

function Input({
    type = "Введите...",
    value,
    onChange,
    placeholder,
    name,
    maxLength,
    className,
    id,
}: InputProps) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            id={id}
            className={`${className || ""} bg-white/10 border-0 rounded-[35px] outline-none font-[500] text-white hover:bg-white/15 focus:bg-white/20`}
        />
    );
}

export default Input;
