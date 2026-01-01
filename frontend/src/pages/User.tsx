import { useParams } from 'react-router-dom';


function User() {
    const { id } = useParams<{ id: string }>();

  return <div>user id: {id}</div>;

}

export default User;