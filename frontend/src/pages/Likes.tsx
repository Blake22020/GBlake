import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useEffect, useState } from "react";
import { likesPosts } from "../services/api";
import Post from "../components/Post";
import { setMeta } from "../services/description";
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

function Likes() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Лайки | GBlake";
        setMeta("description", "Лайки");
    }, []);

    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        const request = async () => {
            try {
                const res = await likesPosts(token);
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
        <div className="flex flex-col pt-[65px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-screen object-cover LikesPage">
            <LoginNavbarHeader />
            <div className="flex flex-col pt-[150px] pb-[100px] w-full LikesWindow">
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
        </div>
    );
}

export default Likes;
