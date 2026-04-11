interface InputProps {
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    name?: string;
    maxLength?: number;
    className?: string;
    id?: string;
    rows: number;
}

function Input({
    value,
    onChange,
    placeholder,
    name,
    maxLength,
    className,
    id,
    rows,
}: InputProps) {
    return (
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            id={id}
            rows={rows}
            className={`${className || ""} bg-white/10 border-0 resize-none rounded-[35px] outline-none font-[500] text-white hover:bg-white/15 focus:bg-white/20`}
        />
    );
}

export default Input;
