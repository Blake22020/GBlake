import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../services/api";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import "../styles/pages/user.css";
import { followUser, checkFollowStatus } from "../services/api";
import Modal from "../components/Modal";
import { setMeta } from "../services/description";

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
        username: string;
        avatar: string;
        _id: string;
    };
}

function formatNumberWithSpaces(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function statCard(stat: number, info: string) {
    return (
        <div className="userStatCard flex flex-col gap-[10px] text-white bg-white/10 p-[20px] rounded-[50px]">
            <h1 className="text-[2.5rem]">{formatNumberWithSpaces(stat)}</h1>
            <h2 className="text-[1.5rem]">{info}</h2>
        </div>
    );
}

function UserPage() {
    const navigate = useNavigate();

    useEffect(() => {}, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const [user, setUser] = useState<User | null>(null);
    const [isFollow, setIsFollow] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const myId = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!myId || !token || !id || myId === id) {
            setIsFollow(false);
            return;
        }

        const checkFollow = async () => {
            try {
                const data = await checkFollowStatus(id, token);
                setIsFollow(data.following);
            } catch (error) {
                console.error("Failed to check follow status:", error);
                setIsFollow(false);
            }
        };

        checkFollow();
    }, [id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await getUser(id);
                setUser(userData);
                document.title = userData?.visualName + " | GBlake" || "GBlake";
                setMeta("description", userData?.visualName || "Не найдено");
            } catch (err) {
                console.error("Failed to fetch user:", err);
                navigate("/404");
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
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const data = await followUser(id, token);
            setIsFollow(data.following);
        } catch (error: any) {
            let message = "Не удалось выполнить действие";

            if (error.response) {
                message =
                    error.response.data?.message ||
                    error.response.statusText ||
                    message;
            } else if (error.request) {
                message = "Нет соединения с сервером";
            }
            openModal("Ошибка", message);
        }
    };

    const buttonStyle =
        "px-[35px] py-[15px] rounded-[35px] text-white text-[2rem] outline-0 border-0 cursor-pointer";

    return (
        <div className="userPage w-screen pt-[65px] pl-[200px] flex flex-col pb-[110px] object-cover overflow-y-hidden">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div className="userWindow">
                <div className="userCard flex flex-col gap-[100px] px-[150px] pb-[100px] w-full text-center">
                    <div className="userInfo flex flex-col gap-[100px] text-center">
                        <div className="userLine flex justify-between w-[850px] items-center">
                            <div className="userNameAvatar flex items-center gap-[25px]">
                                <img
                                    src={`http://localhost:3000${user.avatar.trim()}`}
                                    alt=""
                                    className="userAvatar h-[5rem] object-cover bg-white rounded-full"
                                />
                                <h1 className="text-white text-[5rem]">
                                    {user.visualName}
                                </h1>
                            </div>
                            {localStorage.getItem("id") === user.id ? (
                                <button
                                    className={`${buttonStyle} bg-white/10 hover:bg-white/20`}
                                    onClick={() => {
                                        navigate("/edit");
                                    }}
                                >
                                    Редактировать
                                </button>
                            ) : isFollow ? (
                                <button
                                    className={`${buttonStyle} bg-white/10 hover:bg-white/20`}
                                    onClick={handleFollow}
                                >
                                    Отписаться
                                </button>
                            ) : (
                                <button
                                    className={`${buttonStyle} bg-primary-600 hover:bg-primary-500`}
                                    onClick={handleFollow}
                                >
                                    Подписаться
                                </button>
                            )}
                        </div>
                        <p className="text-white text-[2rem]">{user.bio}</p>
                    </div>
                    <div className="userStats flex gap-[100px] justify-center items-center">
                        {statCard(user.followers, "Подписчиков")}
                        {statCard(user.followings, "Подписок")}
                    </div>
                </div>
                <div className="posts">
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
