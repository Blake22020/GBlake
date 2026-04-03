import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { feedRequest } from "../services/api";
import { setMeta } from "../services/description";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import toast from "react-hot-toast";

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

    useEffect(() => {
        const token = localStorage.getItem("token");

        const request = async () => {
            try {
                const res = await feedRequest(token);
                setPosts(res);
            } catch (error: any) {
                const errMsg =
                    error?.response?.data?.message ||
                    error.message ||
                    "Неизвестная ошибка";
                toast.error(errMsg);
            }
        };

        request();
    }, [navigate]);

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
                        _id={post._id}
                        title={post.title}
                        text={post.text}
                        createdAt={post.createdAt}
                        likes={post.likes}
                        liked={false}
                        author={post.author}
                    />
                ))}
            </main>
        </div>
    );
}

export default MainPage;
