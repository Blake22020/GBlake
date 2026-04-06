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
        <div className="flex flex-col gap-2 md:gap-[10px] text-white bg-white/10 px-[15px] py-[10px] sm:p-[20px] rounded-[50px]">
            <h1 className="text-[1.1rem] sm:text-[1.4rem] md:text-[1.8rem] lg:text-[2.5rem] font-bold">
                {formatNumberWithSpaces(stat)}
            </h1>
            <h2 className="text-[0.9rem] sm:text-[1rem] lg:text-[1.5rem]">
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
        "px-[20px] py-[10px] lg:px-[35px] lg:py-[15px] rounded-[35px] text-white text-[1rem] xs:text-[1.4rem] sm:text-[1.8rem] md:text-[1.5rem] xl:text-[2rem] outline-0 border-0 cursor-pointer font-medium transition-colors";

    return (
        <div className="w-full pt-[50px] nav:pt-[65px] pl-0 xs:pl-[200px] flex flex-col pb-[110px] min-h-screen">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div>
                <div className="flex flex-col gap-[40px] md:gap-[100px] px-4 sm:px-8 lg:px-[150px] py-[50px] md:py-[100px] w-full text-center">
                    <div className="flex flex-col gap-[50px] md:gap-[100px] text-center items-center">
                        <div className="flex justify-between w-[90%] sm:w-[500px] md:w-[600px] lg:w-[700px] xl:w-[850px] items-center">
                            <div className="flex items-center gap-2 sm:gap-[25px]">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${user.avatar.trim()}`}
                                    alt=""
                                    className="h-[3rem] xs:h-[4rem] sm:h-[5rem] lg:h-[6rem] xl:h-[7rem] w-[3rem] xs:w-[4rem] sm:w-[5rem] lg:w-[6rem] xl:w-[7rem] object-cover bg-white rounded-full"
                                />
                                <h1 className="text-white text-[1.5rem] xs:text-[2rem] sm:text-[3rem] lg:text-[4rem] xl:text-[5rem] font-bold">
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
                        <p className="text-white text-[1.2rem] sm:text-[1.5rem] lg:text-[2rem] px-4 max-w-4xl">
                            {user.bio}
                        </p>
                    </div>
                    <div className="flex gap-[20px] sm:gap-[50px] md:gap-[100px] justify-center items-center">
                        {statCard(user.followers, "Подписчиков")}
                        {statCard(user.followings, "Подписок")}
                    </div>
                </div>
                <div className="posts">
                    {user.posts.map((post: PostInterface) => (
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

export default UserPage;
