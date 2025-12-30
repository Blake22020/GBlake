import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import '../styles/pages/createPost.css'
import { useNavigate } from 'react-router-dom';


function CreatePost() {
    const navigate = useNavigate();
    
    return (
        <div className="createPost">
            <LoginNavbarHeader />
            <div className="createPostMain">
                <div className="createPostCard">
                    <button className="closeButton" onClick={() => {navigate("/")}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50"><g data-name="Layer 2"><g data-name="close"><rect width="50" height="50" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg></button>
                    <h1>Создание поста</h1>
                    <form className="createPostForm">
                        <div className="createPostInputs">
                            <input placeholder="Заголовок" />
                            <textarea placeholder="Текст" />
                        </div>
                        <button type="submit">Выложить пост</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;