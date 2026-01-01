import { useParams } from 'react-router-dom';
// import { getUser } from '../services/api';
import LoginNavbarHeader from '../layouts/mainNavbarHeader';
import MainNavbarHeader from '../layouts/mainNavbarHeader';
import Post from '../components/Post';

function statCard(stat: Number, info: string) {
    return (
        <div className='userStatCard'>
            <h1>{stat.toString()}</h1>
            <h2>{info}</h2>
        </div>
    )
}

async function User() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <div>Loading...</div>;
    }
    // const user = await getUser(id);
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
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 дня назад
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
                                <img src={user.avatar} alt='' className='userAvatar' />
                                <h1>{user.visualname}</h1>
                            </div>
                            <button className='followButton'>Подписаться</button>
                        </div>
                        <h2>{user.bio}</h2>
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