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

    // useEffect(() => {
    //     const checkRole = async () => {
    //         try {
    //             const id = localStorage.getItem("id");
    //             if (!id) {
    //                 navigate("/404");
    //                 return;
    //             }
    //             const user = await getUser(id);
    //             const role = user.role;
    //             if (role < 2) {
    //                 navigate("/404");
    //                 return;
    //             }
    //         } catch (err) {
    //             console.error("/404");
    //             return;
    //         }
    //     };
    //     checkRole();
    // }, [navigate]);

    return (
        <div className="flex flex-col pt-[65px] pb-[110px] pl-[200px] w-screen h-screen object-cover adminPage">
            <LoginNavbarHeader />
            <div className="flex flex-col justify-center items-center w-full h-full adminWindow">
                <div className="shadow-[0_0_100px_0_#6e5bff] p-[45px] rounded-[45px] w-[50%] h-[60%] adminPanel">
                    <form className="flex flex-col justify-between h-full">
                        <h1 className="text-[2rem] text-white text-center">
                            Админ панель
                        </h1>
                        <div className="flex flex-col gap-[40px] inputs">
                            <input
                                placeholder="id пользователя"
                                className="bg-white/10 hover:bg-white/15 focus:bg-white/20 pt-[20px] pr-0 pb-[20px] pl-[30px] border-0 rounded-[35px] outline-none text-[2rem] text-white"
                            />
                            <input
                                placeholder="Роль (-1, 0, 1, 2)"
                                className="bg-white/10 hover:bg-white/15 focus:bg-white/20 pt-[20px] pr-0 pb-[20px] pl-[30px] border-0 rounded-[35px] outline-none text-[2rem] text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-[linear-gradient(135deg,#6e5bff,#a08eff)] p-[15px] border-0 rounded-[35px] outline-0 font-700 text-[3rem] text-white hover:-translate-y-[20px] cursor-pointer"
                        >
                            Изменить роль
                        </button>
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
