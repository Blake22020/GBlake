import { useSearchParams } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
import { searchResponse } from "../services/api";
import Modal from "../components/Modal";

function Search() {
	const [searchParams] =useSearchParams();
	const query = searchParams.get('q') || '';
	const [isPosts, setIsPosts] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ title: '', text: '' });
	const openModal = (title: string, text: string) => {
		setModalData({ title, text });
		setIsModalOpen(true);
	};

	useEffect(() => {
		try {
			searchResponse(query).then((res) => {
				console.log(res);
			})
		} catch(error : any) {
			const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
			openModal('Ошибка', errMsg);
		}

	})

	return (
		<div className="Search">
			{localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader />}
			<div className="searchWindow">
				<div className="buttons">
					<button onClick={() => { setIsPosts(true) }}>Посты</button>
					<button onClick={() => { setIsPosts(false) }}>Пользователи</button>
				</div>

				<div className={isPosts ? "posts" : 'posts hidden'}>

				</div>

				<div className={isPosts ? "users hidden" : "users"} id='users'>

				</div>
			</div>
			<Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
		</div>
	)
}

export default Search;	