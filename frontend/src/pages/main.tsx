import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { feedRequest } from "../services/api";
import { setMeta } from "../services/description";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
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

function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "GBlake";
        setMeta("description", "Gblake");
    }, []);

    const [posts, setPosts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const loadPosts = useCallback(async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await feedRequest(token, page, 10);
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
    }, [page, isLoading, hasMore]);

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
        <div className="main">
            {localStorage.getItem("token") ? (
                <LoginNavbarHeader />
            ) : (
                <MainNavbarHeader />
            )}
            <main className="flex flex-col pt-[50px] nav:pt-[65px] pb-[110px] w-full pl-[0px] xs:pl-[200px] ">
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
            </main>
        </div>
    );
}

export default MainPage;
