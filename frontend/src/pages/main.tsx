import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import '../styles/pages/main.css'
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { feedRequest } from "../services/api";

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
                const res = await feedRequest(token);
                setPosts(res)
            } catch(error : any) {
                const errMsg = error?.response?.data?.message || error.message || 'Неизвестная ошибка';
                openModal('Ошибка', errMsg);
            }
        }

        request();
    }, [navigate])     

    return (
        <div className="main">
            <Helmet>
                <title>GBlake ❄️</title>
                <meta
                name="description"
                content="Платформа для коротких и длинных мыслей. Общайся, пиши, будь собой."
            />
            </Helmet>        
            <MainNavbarHeader />
            <main>
                {posts.map((post : PostInterface) => 
                    <Post
                        _id={post._id}
                        title={post.title}
                        text={post.text}
                        createdAt={post.createdAt}
                        likes={post.likes}
                        liked={false}
                        author={post.author}
                    />
                )}
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalData.title}
                text={modalData.text}
            />
        </div>
    )
}

export default MainPage;
