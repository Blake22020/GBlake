import { useNavigate } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import { useEffect } from "react";

function Likes() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    })

    return (
        <div className="LikesPage">
            <LoginNavbarHeader />
            <div className="LikesWindow">

            </div>
        </div>
    )
}

export default Likes;