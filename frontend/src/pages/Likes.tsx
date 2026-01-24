import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useEffect, useState } from "react";
import { likesPosts } from "../services/api";
import Modal from "../components/Modal";
import Post from "../components/Post";
import '../styles/pages/likes.css';
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

function Likes() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Лайки | GBlake";
        setMeta("description", "Лайки");
    }, []);


    const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState({ title: '', text: '' });
	const openModal = (title: string, text: string) => {
		setModalData({ title, text });
		setIsModalOpen(true);
	};

    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }

        const request = async () => {
            try {
                const res = await likesPosts(token);
                setPosts(res)
            } catch(error : any) {
				const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
				openModal('Ошибка', errMsg);
			}
        }
    }, [])

    return (
        <div className="LikesPage">
            <LoginNavbarHeader />
            <div className="LikesWindow">
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
    )
}

export default Likes;