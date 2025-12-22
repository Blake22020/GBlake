import '../styles/components/modal.css'
interface ModalProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	text?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, text }) => {
	if (!isOpen) return null

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	return (
		<div className='modal-window' onClick={handleOverlayClick}>
			<div className='modal'>
				<div className='modal-header'>
					<h2>{title}</h2>
					<button className='modal-close-button' onClick={onClose}>
						×
					</button>
				</div>
				<div className='modal-content'>
					<p>{text}</p>
				</div>
			</div>
		</div>
	)
}

export default Modal

