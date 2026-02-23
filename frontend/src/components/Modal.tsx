interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    text?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, text }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="top-0 right-0 bottom-0.5 left-0 z-1000 fixed flex justify-center items-center bg-white/50 modal-window"
            onClick={handleOverlayClick}
        >
            <div className="bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.25)] max-[640px]:m-20px p-0 rounded-[12px] w-[90%] max-[640px]:w-[95%] max-w-[500px] max-h-[80vh] overflow-y-auto text-white modal">
                <div className="flex justify-between items-center px-[24px] max-[640px]:px-[20px] py-[20px] max-[640px]:py-[16px] border-[#3d3d3f] border-b modal-header">
                    <h2 className="m-0 text-[1.25rem] text-600">{title}</h2>
                    <button
                        className="flex justify-center items-center bg-none p-0 rounded-[4px] w-[24px] h-[24px] text-[#6b7280] text-[24px] hover:text-[#3b4149] transition-all duration-200 cursor-pointer modal-close-button boreder-0"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="p-[24px] max-[640px]:p-[20px] modal-content">
                    <p className="m-0 leading-[1.5]">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;
