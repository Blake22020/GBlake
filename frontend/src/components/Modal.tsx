import "../styles/components/modal.css";
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
      className="modal-window fixed top-0 left-0 right-0 bottom-0.5 bg-white/50 flex justify-center items-center z-1000"
      onClick={handleOverlayClick}
    >
      <div className="modal bg-white/90 rounded-[12px] p-0 max-w-[500px] text-white w-[90%] max-h-[80vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
        <div className="modal-header flex justify-between items-center px-[24px] py-[20px] border-b border-[#3d3d3f]">
          <h2 className="m-0 text-[1.25rem] text-600">{title}</h2>
          <button
            className="modal-close-button bg-none boreder-0 text-[24px] cursor-pointer text-[#6b7280] p-0 w-[24px] h-[24px] flex items-center justify-center rounded-[4px] transition-all duration-200 hover:text-[#3b4149]"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="modal-content p-24px">
          <p className="m-0 leading-[1.5]">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
