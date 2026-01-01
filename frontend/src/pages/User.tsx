import { useParams } from 'react-router-dom';
import { getUser } from '../services/api';


async function User() {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <div>Loading...</div>;
    }
    const user = await getUser(id);

    return <div>user id: {id}</div>;    
}

export default User;