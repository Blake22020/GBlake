import LoginNavbarHeader from "../layouts/loginNavbarHeader";

function CreatePost() {
    
    return (
        <div className="createPost">
            <LoginNavbarHeader />
            <div className="createPostMain">
                <div className="createPostCard">
                    <form className="createPost">
                        <h1>Создание поста</h1>
                        <input placeholder="Заголовок" />
                        <textarea placeholder="Текст" />
                        <button>Выложить пост</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;