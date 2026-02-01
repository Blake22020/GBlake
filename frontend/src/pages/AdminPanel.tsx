import { useEffect } from "react";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { getUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
    const navigate = useNavigate();

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
            <div className="adminWindow"></div>
        </div>
    );
}

export default AdminPanel;
