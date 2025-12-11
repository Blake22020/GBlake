import React, {useEffect} from 'react';
import LoginHeader from '../components/headers/loginHeader'
import LoginNavbar from "../components/navbars/loginNavbar";

function loginNavbarHeader() {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    useEffect(() => {
        const checkWidth = () => {
            setIsMobile(window.innerWidth < 600);
        }
        checkWidth();

        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, [])

    return (
        <div className='loginNavbarHeader'>
            <LoginHeader openFunction={() => {
                setNavbarOpen(prev => !prev);
            }}/>
            <LoginNavbar></LoginNavbar>
        </div>
    )
}

export default loginNavbarHeader;