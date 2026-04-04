import { useSearchParams, useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
import { searchResponse, followUser, checkFollowStatus } from "../services/api";
import Post from "../components/Post";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";

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
        username: string;
        avatar: string;
    };
}

function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get("q") || "";
    const [isPosts, setIsPosts] = useState(true);
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [followStatus, setFollowStatus] = useState<{
        [key: string]: boolean;
    }>({});

    useEffect(() => {
        document.title = query + " | Поиск в GBlake";
        setMeta("description", "GBlake");
    }, [query]);

    const handleFollowClick = async (userId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await followUser(userId, token);
            setFollowStatus((prev) => ({ ...prev, [userId]: res.following }));
            toast.success(
                `Вы ${res.following ? "подписались на" : "отписались от"} пользователя`,
            );
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Ошибка при выполнении действия";
            toast.error(errMsg);
        }
    };

    const checkUserFollowStatus = async (userId: string) => {
        const token = localStorage.getItem("token");
        if (!token) return false;

        try {
            const response = await checkFollowStatus(userId, token);
            return response.following || false;
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

                    const token = localStorage.getItem("token");
                    if (token) {
                        const followStatusPromises = results.users.map(
                            async (user: UserInterface) => {
                                const isFollowing = await checkUserFollowStatus(
                                    user._id,
                                );
                                return { userId: user._id, isFollowing };
                            },
                        );

                        const followStatusResults =
                            await Promise.all(followStatusPromises);
                        const statusMap: { [key: string]: boolean } = {};
                        followStatusResults.forEach(
                            ({ userId, isFollowing }) => {
                                statusMap[userId] = isFollowing;
                            },
                        );
                        setFollowStatus(statusMap);
                    }
                }
                console.log("Posts saved:", results.posts);
                console.log("Users saved:", results.users);
            } catch (error: any) {
                const errMsg =
                    error?.response?.data?.message ||
                    error.message ||
                    "Неизвестная ошибка";
                toast.error(errMsg);
            }
        };

        if (query) {
            performSearch();
        }
    }, [query, navigate]);

    return (
        <div className="flex flex-col pt-[50px] nav:pt-[65px] pb-[110px] pl-[0px] xs:pl-[200px] w-full object-cover search">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div className="flex gap-[30px] py-[25px] nav:py-[50px] searchWindow flex-col">
                <div className="flex justify-center items-center gap-[20px] buttons">
                    <button
                        onClick={() => {
                            setIsPosts(true);
                        }}
                        className={`text-white text-[1.5rem] lg:text-[2rem] px-[15px] nav:px-[35px] py-[10px] nav:py-[15px] border-0 rounded-[35px] cursor-pointer transition-all duration-100 ease-in-out ${isPosts ? "bg-white/20" : "bg-white/10"}`}
                    >
                        Посты
                    </button>
                    <button
                        onClick={() => {
                            setIsPosts(false);
                        }}
                        className={`text-white text-[1.5rem] lg:text-[2rem] px-[15px] nav:px-[35px] py-[10px] nav:py-[15px] border-0 rounded-[35px] cursor-pointer transition-all duration-100 ease-in-out ${isPosts ? "bg-white/10" : "bg-white/20"}`}
                    >
                        Пользователи
                    </button>
                </div>

                <div
                    className={`flex flex-col gap-[50px] ${isPosts ? "" : "hidden"}`}
                >
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

                <div
                    className={`flex flex-col gap-[25px] nav:gap-[100px] ${isPosts ? "hidden" : ""}`}
                >
                    {users.map(function (user: UserInterface) {
                        const isFollowing = followStatus[user._id] || false;
                        const isLoggedIn = !!localStorage.getItem("token");

                        return (
                            <div className="flex justify-between items-center gap-[10px] min-[450px]:gap-[30px] bg-white/5 hover:bg-white/10 mx-auto p-[20px] rounded-[65px] w-[90%] xs:w-[80%] min-[700px]:w-[400px] nav:w-[500px] lg:w-[550px] xl:w-[700px] text-white transition-all duration-300 ease-in-out cursor-pointer userCard">
                                <img
                                    src={`${process.env.REACT_APP_API_URL}${user.avatar}`}
                                    alt="avatar"
                                    className="bg-transparent m-0 p-0 border-0 rounded-[50%] w-[36px] h-[36px] min-[700px]:w-[48px] min-[700px]:h-[48px] nav:w-[72px] nav:h-[72px] lg:w-[96px] lg:h-[96px] object-cover aspect-square"
                                />
                                <div className="flex justify-between text">
                                    <h1 className="font-800 min-[450px]:font-bold text-[0.9rem] min-[700px]:text-[1rem] nav:text-[1.3rem] lg:text-[1.5rem] xl:text-[2rem]">
                                        {user.visualName}
                                    </h1>{" "}
                                </div>
                                {isLoggedIn && (
                                    <button
                                        className={
                                            isFollowing
                                                ? "unfollowButton text-[1rem] min-[700px]:text-[1.3rem] bg-white/20 px-[10px] py-[5px] min-[700px]:px-[15px] min-[700px]:py-[10px] lg:px-[35px] lg:py-[15px] rounded-[35px] border-0 text-white cursor-pointer hover:bg-white/30"
                                                : "followButton text-[1rem] min-[700px]:text-[1.3rem] bg-primary-600 px-[10px] py-[5px] min-[700px]:px-[15px] min-[700px]:py-[10px] lg:px-[35px] lg:py-[15px] rounded-[35px] border-0 text-white cursor-pointer hover:bg-primary-500"
                                        }
                                        onClick={() =>
                                            handleFollowClick(user._id)
                                        }
                                    >
                                        {isFollowing
                                            ? "Отписаться"
                                            : "Подписаться"}
                                    </button>
                                )}
                                {!isLoggedIn && (
                                    <button
                                        className="followButton"
                                        onClick={() => navigate("/login")}
                                    >
                                        Подписаться
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Search;
