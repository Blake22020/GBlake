import { useEffect, useState } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { getUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/pages/adminPanel.css";
import Modal from "../components/Modal";

function AdminPanel() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: "", text: "" });
    const openModal = (title: string, text: string) => {
        setModalData({ title, text });
        setIsModalOpen(true);
    };

    useEffect(() => {
        const checkRole = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    navigate("/404");
                    return;
                }
                const user = await getUser(id);
                const role = user.role;
                if (role < 2) {
                    navigate("/404");
                    return;
                }
            } catch (err) {
                console.error("/404");
                return;
            }
        };
        checkRole();
    }, [navigate]);

    return (
        <div className="adminPage">
            <LoginNavbarHeader />
            <div className="adminWindow">
                <div className="adminPanel">
                    <form>
                        <h1>Админ панель</h1>
                        <div className="inputs">
                            <input placeholder="id пользователя" />
                            <input placeholder="Роль (-1, 0, 1, 2)" />
                        </div>
                        <button type="submit">Изменить роль</button>
                    </form>
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

export default AdminPanel;
