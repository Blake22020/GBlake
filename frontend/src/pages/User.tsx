import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../services/api";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { followUser, checkFollowStatus } from "../services/api";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";

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
        <div className="flex flex-col gap-[10px] max-[800px]:gap-2 max-[500px]:gap-2 max-[400px]:gap-2 text-white bg-white/10 p-[20px] max-[400px]:px-[15px] max-[400px]:py-[10px] rounded-[50px]">
            <h1 className="text-[2.5rem] max-[800px]:text-[1.8rem] max-[500px]:text-[1.4rem] max-[400px]:text-[1.1rem]">
                {formatNumberWithSpaces(stat)}
            </h1>
            <h2 className="text-[1.5rem] max-[800px]:text-[1rem] max-[500px]:text-[1rem] max-[400px]:text-[0.9rem]">
                {info}
            </h2>
        </div>
    );
}

function UserPage() {
    const navigate = useNavigate();

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
            toast.success(`Вы подписались на ${user.visualName}.`);
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
            toast.error(message);
        }
    };

    const buttonStyle =
        "px-[35px] py-[15px] max-[1000px]:px-[20px] max-[1000px]:py-[10px] max-[850px]:px-[20px] max-[850px]:py-[10px] max-[600px]:px-[20px] max-[600px]:py-[10px] max-[400px]:px-[20px] max-[400px]:py-[10px] rounded-[35px] text-white text-[2rem] max-[1200px]:text-[1.5rem] max-[600px]:text-[1.8rem] max-[500px]:text-[1.4rem] max-[400px]:text-[1rem] outline-0 border-0 cursor-pointer";

    return (
        <div className="w-screen pt-[65px] pl-[200px] max-[900px]:pt-[50px] max-[600px]:pl-0 flex flex-col pb-[110px] object-cover overflow-y-hidden">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div>
                <div className="flex flex-col gap-[100px] max-[400px]:gap-[40px] px-[150px] max-[400px]:px-0 max-[400px]:py-[75px] pb-[100px] max-[400px]:pb-[50px] w-full text-center">
                    <div className="flex flex-col gap-[100px] max-[1000px]:gap-[50px] text-center items-center pt-[100px]">
                        <div className="flex justify-between w-[850px] max-[1200px]:w-[700px] max-[1000px]:w-[600px] max-[850px]:w-[500px] max-[600px]:w-[90%] max-[400px]:w-[90%] items-center">
                            <div className="flex items-center gap-[25px] max-[500px]:gap-2">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${user.avatar.trim()}`}
                                    alt=""
                                    className="h-[5rem] max-[1200px]:h-[4rem] max-[1000px]:h-[3rem] max-[850px]:h-[3rem] max-[600px]:h-[2rem] max-[400px]:h-[1.5rem] object-cover bg-white rounded-full"
                                />
                                <h1 className="text-white text-[5rem] max-[1200px]:text-[4rem] max-[1000px]:text-[3rem] max-[850px]:text-[3rem] max-[600px]:text-[2rem] max-[400px]:text-[1.5rem]">
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
                        <p className="text-white text-[2rem] max-[400px]:text-[1.2rem]">
                            {user.bio}
                        </p>
                    </div>
                    <div className="flex gap-[100px] max-[800px]:gap-[50px] max-[500px]:gap-[20px] max-[400px]:gap-[20px] justify-center items-center">
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
        </div>
    );
}

export default UserPage;
