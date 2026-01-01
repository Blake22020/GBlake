import { useParams } from 'react-router-dom';
import { getUser } from '../services/api';
import LoginNavbarHeader from '../layouts/mainNavbarHeader';
import MainNavbarHeader from '../layouts/mainNavbarHeader';


async function User() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <div>Loading...</div>;
    }
    const user = await getUser(id);

    return (
        <div className='userPage'>
            {localStorage.getItem("token") ? <LoginNavbarHeader /> : <MainNavbarHeader />}
        </div>
    );    
}

export default User;