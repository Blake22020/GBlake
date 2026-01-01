import { useParams } from 'react-router-dom';
// import { getUser } from '../services/api';
import LoginNavbarHeader from '../layouts/mainNavbarHeader';
import MainNavbarHeader from '../layouts/mainNavbarHeader';
import Post from '../components/Post';
// import { useEffect, useState } from 'react';
import '../styles/pages/user.css';


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

function User() {
    // const [user, setUser] = useState<User | null>(null);

    const { id } = useParams<{ id: string }>();

    // useEffect(() => {
    //     if (!id) {
    //         return;
    //     }

    //     const fetchUser = async () => {
    //         try {
    //             const userData = await getUser(id); // ← тут вызывается твой API
    //             setUser(userData);
    //         } catch (err) {
    //             console.error('Failed to fetch user:', err);
    //         } 
    //     };

    //     fetchUser();
    // }, [id]); 


    if (!id) {
        return <div>Loading...</div>;
    }


    const user = {
        id: '12343',
        username: 'Blake22020',
        visualname: 'Blake',
        bio: 'Full-stack developer',
        followers: 4000000,
        followings: 2,
        avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', 
        posts: [
            {
                _id: 'post001',
                title: 'Запуск нового проекта',
                text: 'Сегодня начал работать над новым open-source фреймворком для быстрой разработки React-приложений. Скоро расскажу подробнее!',
                createdAt: new Date(Date.now() - 1000 * 60 * 45),
                likes: 127,
                liked: false,
                author: {
                    _id: '12343',
                    name: 'Blake',
                    avatar: '149071.png'
                }
            },
            {
                _id: 'post002',
                title: 'TypeScript vs JavaScript',
                text: 'После года разработки на TypeScript возвращаться на чистый JavaScript уже не хочется. Строгая типизация экономит кучу времени на отладку.',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), 
                likes: 342,
                liked: true,
                author: {
                    _id: '12343',
                    name: 'Blake',
                    avatar: '149071.png'
                }
            },
            {
                _id: 'post003',
                title: 'Hyprland и fastfetch — идеальный дуэт',
                text: 'Только что настроил кастомный Hyprland-конфиг с плавными анимациями и прозрачностью. Всё работает идеально — даже курсор больше не пропадает!',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
                likes: 89,
                liked: false,
                author: {
                    _id: '12343',
                    name: 'Blake',
                    avatar: '149071.png'
                }
            }
        ]
    };
    return (
        <div className='userPage'>
            {localStorage.getItem("token") ? <LoginNavbarHeader /> : <MainNavbarHeader />}
            <div className='userWindow'>
                <div className='userCard'>
                    <div className='userInfo'>
                        <div className='userLine'>
                            <div className="userNameAvatar">
                                <img src={user.avatar.trim()} alt='' className='userAvatar' />
                                <h1>{user.visualname}</h1>
                            </div>
                            {localStorage.getItem('id') === user.id ? <button className='editButton'>
                                <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_9_174)">
                                        <path d="M34.7584 13.1508L29.8492 8.24167C29.2085 7.63984 28.3689 7.29452 27.4902 7.2714C26.6114 7.24827 25.7549 7.54896 25.0834 8.11625L8.95838 24.2413C8.37925 24.8253 8.01866 25.5907 7.93713 26.4092L7.16671 33.8804C7.14257 34.1428 7.17663 34.4074 7.26644 34.6551C7.35625 34.9029 7.49961 35.1278 7.68629 35.3138C7.85371 35.4798 8.05225 35.6112 8.27054 35.7003C8.48884 35.7895 8.72258 35.8347 8.95838 35.8333H9.11963L16.5909 35.1525C17.4093 35.071 18.1748 34.7104 18.7588 34.1313L34.8838 18.0063C35.5097 17.3451 35.8479 16.4627 35.8244 15.5526C35.8009 14.6425 35.4175 13.7788 34.7584 13.1508ZM16.2684 31.5692L10.8934 32.0708L11.3771 26.6958L21.5 16.6983L26.3375 21.5358L16.2684 31.5692ZM28.6667 19.135L23.865 14.3333L27.3588 10.75L32.25 15.6413L28.6667 19.135Z" fill="white"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_9_174">
                                        <rect width="43" height="43" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                Редактировать
                            </button> : <button className='followButton'>Подписаться</button>}
                        </div>
                        <p>{user.bio}</p>
                    </div>
                    <div className='userStats'>
                        {statCard(user.followers, 'Подписчиков')}
                        {statCard(user.followings, 'Подписок')}
                    </div>
                </div>
                <div className='posts'>
                    {user.posts.map(post => (
                        <Post
                            key={post._id}
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
        </div>
    );    
}

export default User;