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
        <div className="flex flex-col pt-[65px] pb-[110px] pl-[200px] w-dvw object-cover search">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <div className="flex gap-[30px] py-[50px] searchWindow flex=col">
                <div className="flex justify-center items-center gap-[20px] buttons">
                    <button
                        onClick={() => {
                            setIsPosts(true);
                        }}
                        className={`text-white text-[2rem] px-[35px] py-[15px] border-0 reounded-[35px] cursor-pointer transition-all duration-100 ease-in-out ${isPosts ? "bg-white/20" : "bg-white/10"}`}
                    >
                        Посты
                    </button>
                    <button
                        onClick={() => {
                            setIsPosts(false);
                        }}
                        className={`text-white text-[2rem] px-[35px] py-[15px] border-0 reounded-[35px] cursor-pointer transition-all duration-100 ease-in-out ${isPosts ? "bg-white/10" : "bg-white/20"}`}
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
                    className={`flex flex-col gap-[100px] ${isPosts ? "hidden" : ""}`}
                >
                    {users.map(function (user: UserInterface) {
                        const isFollowing = followStatus[user._id] || false;
                        const isLoggedIn = !!localStorage.getItem("token");

                        return (
                            <div className="flex justify-between items-center gap-[30px] bg-white/5 hover:bg-white/10 mx-auto p-[20px] rounded-[65px] w-[700px] text-white transition-all duration-300 ease-in-out cursor-pointer userCard">
                                <img
                                    src={`https://gblake.ru/uploads/${user.avatar}`}
                                    alt="avatar"
                                />
                                <div className="text">
                                    <h1>{user.visualName}</h1>
                                </div>
                                {isLoggedIn && (
                                    <button
                                        className={
                                            isFollowing
                                                ? "unfollowButton"
                                                : "followButton"
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
