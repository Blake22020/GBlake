import { useSearchParams, useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
// import { searchResponse, followUser, checkFollowStatus } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";
import '../styles/pages/search.css';

interface UserInterface {
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

// Фейковые данные для тестирования
const fakePosts: PostInterface[] = [
	{
		_id: "1",
		title: "Первый тестовый пост",
		text: "Это содержимое первого тестового поста для проверки работы поиска и отображения постов.",
		createdAt: new Date("2024-01-15"),
		likes: 42,
		author: {
			_id: "user1",
			name: "Александр",
			avatar: "avatar1.jpg"
		}
	},
	{
		_id: "2",
		title: "Второй пост о разработке",
		text: "В этом посте рассказывается о веб-разработке, React и современных технологиях фронтенда.",
		createdAt: new Date("2024-01-14"),
		likes: 128,
		author: {
			_id: "user2",
			name: "Мария",
			avatar: "avatar2.jpg"
		}
	},
	{
		_id: "3",
		title: "Третий пост с изображением",
		text: "Контент третьего поста с интересными мыслями и идеями для сообщества.",
		createdAt: new Date("2024-01-13"),
		likes: 67,
		author: {
			_id: "user3",
			name: "Дмитрий",
			avatar: "avatar3.jpg"
		}
	}
];

const fakeUsers: UserInterface[] = [
	{
		_id: "user1",
		visualName: "Александр Разработчик",
		followers: 150,
		avatar: "avatar1.jpg"
	},
	{
		_id: "user2",
		visualName: "Мария Дизайнер",
		followers: 320,
		avatar: "avatar2.jpg"
	},
	{
		_id: "user3",
		visualName: "Дмитрий Frontend",
		followers: 89,
		avatar: "avatar3.jpg"
	},
	{
		_id: "user4",
		visualName: "Елена Backend",
		followers: 256,
		avatar: "avatar4.jpg"
	},
	{
		_id: "user5",
		visualName: "Иван Fullstack",
		followers: 412,
		avatar: "avatar5.jpg"
	}
];

function Search() {
	const [searchParams] =useSearchParams();
	const navigate = useNavigate();
	const query = searchParams.get('q') || '';
	const [isPosts, setIsPosts] = useState(true);
	const [posts, setPosts] = useState<any[]>([]);
	const [users, setUsers] = useState<any[]>([]);
	const [followStatus, setFollowStatus] = useState<{[key: string]: boolean}>({});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ title: '', text: '' });
	const openModal = (title: string, text: string) => {
		setModalData({ title, text });
		setIsModalOpen(true);
	};

	// const handleFollowClick = async (userId: string) => {
	// 	const token = localStorage.getItem('token');
	// 	if (!token) {
	// 		navigate('/login');
	// 		return;
	// 	}

	// 	try {
	// 		const isFollowing = followStatus[userId];
	// 		if (isFollowing) {
	// 			await followUser(userId, token);
	// 			setFollowStatus(prev => ({ ...prev, [userId]: false }));
	// 		} else {
	// 			await followUser(userId, token);
	// 			setFollowStatus(prev => ({ ...prev, [userId]: true }));
	// 		}
	// 	} catch (error: any) {
	// 		const errMsg = error?.response?.data?.message || error.message || 'Ошибка при выполнении действия';
	// 		openModal('Ошибка', errMsg);
	// 	}
	// };

	// const checkUserFollowStatus = async (userId: string) => {
	// 	const token = localStorage.getItem('token');
	// 	if (!token) return false;

	// 	try {
	// 		const response = await checkFollowStatus(userId, token);
	// 		return response.isFollowing || false;
	// 	} catch (error) {
	// 		return false;
	// 	}
	// };

	const handleFollowClick = (userId: string) => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}

		const isFollowing = followStatus[userId];
		setFollowStatus(prev => ({ ...prev, [userId]: !isFollowing }));
	};

	// useEffect(() => {
	// 		const performSearch = async () => {
	// 		try {
	// 			const results = await searchResponse(query);
	// 			if (results && results.posts) {
	// 				setPosts(results.posts);
	// 			}
	// 			if (results && results.users) {
	// 				setUsers(results.users);
					
	// 				const token = localStorage.getItem('token');
	// 				if (token) {
	// 					const followStatusPromises = results.users.map(async (user: UserInterface) => {
	// 						const isFollowing = await checkUserFollowStatus(user._id);
	// 						return { userId: user._id, isFollowing };
	// 					});
						
	// 					const followStatusResults = await Promise.all(followStatusPromises);
	// 					const statusMap: {[key: string]: boolean} = {};
	// 					followStatusResults.forEach(({ userId, isFollowing }) => {
	// 						statusMap[userId] = isFollowing;
	// 					});
	// 					setFollowStatus(statusMap);
	// 				}
	// 			}
	// 			console.log('Posts saved:', results.posts);
	// 			console.log('Users saved:', results.users);
	// 		} catch(error : any) {
	// 			const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
	// 			openModal('Ошибка', errMsg);
	// 		}
	// 	};

	// 	if (query) {
	// 		performSearch();
	// 	}
	// }, [query]);

	// Инициализация фейковыми данными
	useEffect(() => {
		setPosts(fakePosts);
		setUsers(fakeUsers);
		
		// Устанавливаем случайные статусы подписок для демонстрации
		const initialFollowStatus: {[key: string]: boolean} = {};
		fakeUsers.forEach(user => {
			initialFollowStatus[user._id] = Math.random() > 0.5;
		});
		setFollowStatus(initialFollowStatus);
	}, []);

	return (
		<div className="search">
			{localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader />}
			<div className="searchWindow">
				<div className="buttons">
					<button onClick={() => { setIsPosts(true) }} className={isPosts ? 'button active' : 'button'}>Посты</button>
					<button onClick={() => { setIsPosts(false) }} className={isPosts ? 'button' : 'button active'}>Пользователи</button>
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
					{users.map(function (user: UserInterface) {
						const isFollowing = followStatus[user._id] || false;
						const isLoggedIn = !!localStorage.getItem('token');
						
						return (
							<div className="userCard">
								<img src={`https://gblake.ru/uploads/${user.avatar}`} alt='' onClick={() => { navigate('/user/' + user._id)}}/>
								<div className="text">
									<h1 onClick={() => { navigate('/user/' + user._id)}}>{user.visualName}</h1>
								</div>
								{isLoggedIn && (
									<button 
										className={isFollowing ? 'unfollowButton' : 'followButton'}
										onClick={() => handleFollowClick(user._id)}
									>
										{isFollowing ? 'Отписаться' : 'Подписаться'}
									</button>
								)}
								{!isLoggedIn && (
									<button 
										className="followButton"
										onClick={() => navigate('/login')}
									>
										Подписаться
									</button>
								)}
							</div>
						)
					})}
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