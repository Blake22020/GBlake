import MainNavbarHeader from "../layouts/mainNavbarHeader";
import Post from "../components/Post";
import '../styles/pages/main.css'
import Modal from "../components/Modal";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { feedRequest } from "../services/api";

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
    }, [])

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
