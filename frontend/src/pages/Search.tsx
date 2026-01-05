import { useSearchParams } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
import { searchResponse } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";

interface User {
    _id: string;
    visualName: string;
    followers: number;
    avatar: string;
}

interface PostInterface {
    _id: string;
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    author: {
        _id: string;
        name: string;
        avatar: string;
    };
}


function Search() {
	const [searchParams] =useSearchParams();
	const query = searchParams.get('q') || '';
	const [isPosts, setIsPosts] = useState(true);
	const [posts, setPosts] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ title: '', text: '' });
	const openModal = (title: string, text: string) => {
		setModalData({ title, text });
		setIsModalOpen(true);
	};

	useEffect(() => {
			const performSearch = async () => {
			try {
				const results = await searchResponse(query);
				if (results && results.posts) {
					setPosts(results.posts);
				}
				if (results && results.users) {
					setUsers(results.users);
				}
				console.log('Posts saved:', results.posts);
				console.log('Users saved:', results.users);
			} catch(error : any) {
				const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
				openModal('Ошибка', errMsg);
			}
		};

		if (query) {
			performSearch();
		}
	}, [query]);

	return (
		<div className="Search">
			{localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader />}
			<div className="searchWindow">
				<div className="buttons">
					<button onClick={() => { setIsPosts(true) }}>Посты</button>
					<button onClick={() => { setIsPosts(false) }}>Пользователи</button>
				</div>

				<div className={isPosts ? "posts" : 'posts hidden'}>
					{posts.map((post: PostInterface) => (
                        <Post
                            _id={post._id}
                            title={post.title}
                            text={post.text}
                            createdAt={post.createdAt}
                            likes={post.likes}
                            liked={false}
                            author={post.author}
                        />
                    ))}
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