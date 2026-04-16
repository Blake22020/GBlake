import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useEffect, useState } from "react";
import { followingsPosts } from "../services/api";
import Post from "../components/Post";
import { setMeta } from "../services/description";
import toast from "react-hot-toast";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useCallback } from "react";

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

function Followings() {
    useEffect(() => {
        document.title = "Подписки | GBlake";
        setMeta("description", "Подписки");
    }, []);

    const navigate = useNavigate();

    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadPosts = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await followingsPosts(token, page, 10);
            if (res.length < 10) {
                setHasMore(false);
            }
            setPosts((prev) => {
                const newPosts = res.filter(
                    (newP: any) => !prev.some((p) => p._id === newP._id),
                );
                return [...prev, ...newPosts];
            });
            setPage((prev) => prev + 1);
        } catch (error: any) {
            const errMsg =
                error?.response?.data?.message ||
                error.message ||
                "Неизвестная ошибка";
            toast.error(errMsg);
        } finally {
            setIsLoading(false);
        }
    }, [page, isLoading, hasMore, navigate]);

    useEffect(() => {
        if (page === 1 && posts.length === 0 && hasMore) {
            loadPosts();
        }
    }, [loadPosts, page, posts.length, hasMore]);

    const lastElementRef = useInfiniteScroll({
        isLoading,
        hasMore,
        onLoadMore: loadPosts,
    });

    return (
        <div className="flex flex-col pt-[65px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-screen object-cover FollowingsPage">
            <LoginNavbarHeader />
            <div className="flex flex-col pt-[150px] pb-[100px] w-full FollowingsWindow">
                {posts.map((post: PostInterface) => (
                    <Post
                        key={post._id}
                        _id={post._id}
                        title={post.title}
                        text={post.text}
                        createdAt={post.createdAt}
                        likes={post.likes}
                        liked={false}
                        author={post.author}
                    />
                ))}

                {/* Якорь для бесконечной прокрутки */}
                <div ref={lastElementRef} style={{ height: "20px" }} />
                {isLoading && (
                    <div className="text-center text-white my-4">
                        Загрузка...
                    </div>
                )}
            </div>
        </div>
    );
}

export default Followings;
