import { useSearchParams, useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
import { searchResponse, followUser, checkFollowStatus } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";

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

	const handleFollowClick = async (userId: string) => {
		const token = localStorage.getItem('token');
		if (!token) {
			navigate('/login');
			return;
		}

		try {
			const isFollowing = followStatus[userId];
			if (isFollowing) {
				await followUser(userId, token);
				setFollowStatus(prev => ({ ...prev, [userId]: false }));
			} else {
				await followUser(userId, token);
				setFollowStatus(prev => ({ ...prev, [userId]: true }));
			}
		} catch (error: any) {
			const errMsg = error?.response?.data?.message || error.message || 'Ошибка при выполнении действия';
			openModal('Ошибка', errMsg);
		}
	};

	const checkUserFollowStatus = async (userId: string) => {
		const token = localStorage.getItem('token');
		if (!token) return false;

		try {
			const response = await checkFollowStatus(userId, token);
			return response.isFollowing || false;
		} catch (error) {
			return false;
		}
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
					
					const token = localStorage.getItem('token');
					if (token) {
						const followStatusPromises = results.users.map(async (user: UserInterface) => {
							const isFollowing = await checkUserFollowStatus(user._id);
							return { userId: user._id, isFollowing };
						});
						
						const followStatusResults = await Promise.all(followStatusPromises);
						const statusMap: {[key: string]: boolean} = {};
						followStatusResults.forEach(({ userId, isFollowing }) => {
							statusMap[userId] = isFollowing;
						});
						setFollowStatus(statusMap);
					}
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
					{users.map(function (user: UserInterface) {
						const isFollowing = followStatus[user._id] || false;
						const isLoggedIn = !!localStorage.getItem('token');
						
						return (
							<div className="userCard">
								<img src={`https://gblake.ru/uploads/${user.avatar}`} alt="avatar" />
								<div className="text">
									<h1>{user.visualName}</h1>
									
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