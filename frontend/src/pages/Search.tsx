import { useSearchParams, useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";
import { useEffect, useState } from "react";
import { searchResponse, followUser, checkFollowStatus } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";
import { setMeta } from "../services/description";
import "../styles/pages/search.css";

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
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const handleFollowClick = async (userId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const isFollowing = followStatus[userId];
            if (isFollowing) {
                await followUser(userId, token);
                setFollowStatus((prev) => ({ ...prev, [userId]: false }));
            } else {
                await followUser(userId, token);
                setFollowStatus((prev) => ({ ...prev, [userId]: true }));
            }
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Ошибка при выполнении действия";
            openModal("Ошибка", errMsg);
        }
    };

    const checkUserFollowStatus = async (userId: string) => {
        const token = localStorage.getItem("token");
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
                openModal("Ошибка", errMsg);
            }
        };

        if (query) {
            performSearch();
        }
    }, [query]);

    return (
        <div className="flex flex-col pt-[65px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-dvw object-cover search">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div className="flex gap-[30px] py-[50px] max-[900px]:py-[25px] searchWindow flex=col">
                <div className="flex justify-center items-center gap-[20px] buttons">
                    <button
                        onClick={() => {
                            setIsPosts(true);
                        }}
                        className={`text-white text-[2rem] px-[35px] py-[15px] border-0 reounded-[35px] cursor-pointer transition-all duration-100 ease-in-out max-[1000px]:text-[1.5rem] max-[900px]:px-[15px] max-[900px]:py-[10px] ${isPosts ? "bg-white/20" : "bg-white/10"}`}
                    >
                        Посты
                    </button>
                    <button
                        onClick={() => {
                            setIsPosts(false);
                        }}
                        className={`text-white text-[2rem] max-[1000px]:text-[1.5rem] px-[35px] py-[15px] border-0 reounded-[35px] cursor-pointer transition-all duration-100 ease-in-out max-[900px]:px-[15px] max-[900px]:py-[10px] ${isPosts ? "bg-white/10" : "bg-white/20"}`}
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
                    className={`flex flex-col gap-[100px] max-[900px]:gap-[25px] ${isPosts ? "hidden" : ""}`}
                >
                    {users.map(function (user: UserInterface) {
                        const isFollowing = followStatus[user._id] || false;
                        const isLoggedIn = !!localStorage.getItem("token");

                        return (
                            <div className="flex justify-between items-center gap-[30px] max-[450px]:gap-[10px] bg-white/5 hover:bg-white/10 mx-auto p-[20px] rounded-[65px] w-[700px] max-[1000px]:w-[550px] max-[550px]:w-[90%] max-[600px]:w-[80%] max-[700px]:w-[400px] max-[900px]:w-[500px] text-white transition-all duration-300 ease-in-out cursor-pointer userCard">
                                <img
                                    src={`https://gblake.ru/uploads/${user.avatar}`}
                                    alt="avatar"
                                    className="bg-transparent m-0 p-0 border-0 rounded-[50%] w-[96px] max-[700px]:w-[36px] max-[900px]:w-[48px] max[1000px]:w-[72px] h-[96px] max-[1000px]:h-[72px] max-[700px]:h-[36px] max-[900px]:h-[48px] object-cover aspect-square"
                                />
                                <div className="flex justify-between text">
                                    <h1 className="max-[450px]:font-800 text-[2rem] max-[1000px]:text-[1.5rem] max-[450px]:text-[0.9rem] max-[700px]:text-[1rem] max-[900px]:text-[1.3rem]">
                                        {user.visualName}
                                    </h1>{" "}
                                    n
                                </div>
                                {isLoggedIn && (
                                    <button
                                        className={
                                            isFollowing
                                                ? "unfollowButton text-[1.3rem] bg-white/20 px-[35px] py-[15px]  rounded-[35px] border-0 text-white cursor-pointer hover:bg-white/30 max-[1000px]:px-[15px] max-[1000px]:py-[10px] max-[1000px]:text-[1.3rem] max-[700px]:px-[10px] max-[700px]:py-[5px] max-[700px]:text-[1rem]"
                                                : "followButton text-[1.3rem] bg-primary-600 px-[35px] py-[15px] rounded-[35px] border-0 text-white cursor-pointer hover:bg-primary-500 max-[1000px]:px-[15px] max-[1000px]:py-[10px] max-[1000px]:text-[1.3rem]  max-[700px]:px-[10px] max-[700px]:py-[5px] max-[700px]:text-[1rem]"
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </div>
    );
}

export default Search;
