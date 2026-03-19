import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useEffect, useState } from "react";
import { followingsPosts } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";
import { setMeta } from "../services/description";

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        const request = async () => {
            try {
                const res = await followingsPosts(token);
                setPosts(res);
            } catch (error: any) {
                const errMsg =
                    error?.response?.data?.message ||
                    error.message ||
                    "Неизвестная ошибка";
                openModal("Ошибка", errMsg);
            }
        };

        request();
    }, []);

    return (
        <div className="flex flex-col pt-[65px] max-[900px]:pt-[50px] pb-[110px] pl-[200px] max-[600px]:pl-0 max-[900px]:pl-[200px] w-screen object-cover FollowingsPage">
            <LoginNavbarHeader />
            <div className="flex flex-col pt-[150px] pb-[100px] w-full FollowingsWindow">
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
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </div>
    );
}

export default Followings;
