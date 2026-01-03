import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../services/api';
import LoginNavbarHeader from '../layouts/loginNavbarHeader';
import MainNavbarHeader from '../layouts/mainNavbarHeader';
import Post from '../components/Post';
import { useEffect, useState } from 'react';
import '../styles/pages/user.css';
import { followUser, checkFollowStatus } from '../services/api';
import Modal from '../components/Modal';

interface User {
    id: string;
    username: string;
    visualName: string;
    bio: string;
    followers: number;
    followings: number;
    avatar: string;
    posts: PostInterface[];
}

interface PostInterface {
    _id: string;
    title: string;
    text: string;
    createdAt: Date;
    likes: number;
    liked: boolean;
    author: {
        _id: string;
        name: string;
        avatar: string;
    };
}


function formatNumberWithSpaces(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function statCard(stat: number, info: string) {
    return (
        <div className='userStatCard'>
            <h1>{formatNumberWithSpaces(stat)}</h1>
            <h2>{info}</h2>
        </div>
    )
}

function UserPage() {
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', text: '' });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const [user, setUser] = useState<User | null>(null);
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const myId = localStorage.getItem('id');
        const token = localStorage.getItem('token');
        
        if (!myId || !token || !id || myId === id) {
            setIsFollow(false);
            return;
        }

        const checkFollow = async () => {
            try {
                const data = await checkFollowStatus(id, token);
                setIsFollow(data.following);
            } catch (error) {
                console.error('Failed to check follow status:', error);
                setIsFollow(false);
            }
        };

        checkFollow();
    }, [id])

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await getUser(id);
                setUser(userData);
            } catch (err) {
                console.error('Failed to fetch user:', err);
                navigate('/404');
            } 
        };

        fetchUser();
    }, [id, navigate]); 


    if (!id) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Loading user data...</div>;
    }

    const handleFollow = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const data = await followUser(id, token);
            setIsFollow(data.following);
        } catch (error: any) {
            let message = 'Не удалось выполнить действие';

            if (error.response) {
                message = error.response.data?.message || error.response.statusText || message;
            } else if (error.request) {
                message = 'Нет соединения с сервером';
            }
            openModal('Ошибка', message)
        }
    };

    return (
        <div className='userPage'>
            {localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader /> } 
            <div className='userWindow'>
                <div className='userCard'>
                    <div className='userInfo'>
                        <div className='userLine'>
                            <div className="userNameAvatar">
                                <img src={user.avatar.trim()} alt='' className='userAvatar' />
                                <h1>{user.visualName}</h1>
                            </div>
                            {
                            localStorage.getItem('id') === user.id
                             ? <button className='editButton'>Редактировать</button>
                             : 
                            (isFollow 
                             ? <button className='unfollowButton' onClick={handleFollow}>Отписаться</button>
                             : <button className='followButton' onClick={handleFollow}>Подписаться</button>)
                            }
                        </div>
                        <p>{user.bio}</p>
                    </div>
                    <div className='userStats'>
                        {statCard(user.followers, 'Подписчиков')}
                        {statCard(user.followings, 'Подписок')}
                    </div>
                </div>
                <div className='posts'>
                    {user.posts.map((post: PostInterface) => (
                        <Post
                            _id={post._id}
                            title={post.title}
                            text={post.text}
                            createdAt={post.createdAt}
                            likes={post.likes}
                            liked={post.liked}
                            author={post.author}
                        />
                    ))}
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </div>
    );    
}

export default UserPage;