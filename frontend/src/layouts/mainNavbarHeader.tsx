import React, {useEffect, useState} from 'react';
import MainNavbar from "../components/navbars/mainNavbar";
import MainHeader from "../components/headers/mainHeader";

function MainNavbarHeader() {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);


    useEffect(() => {
        const checkWidth = () => {
            setIsMobile(window.innerWidth < 600);
        }
        checkWidth();

        window.addEventListener('resize', checkWidth);

        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    return (
        <div className='MainNavbarHeader'>
            <MainHeader openFunction={() => {
                setNavbarOpen(prev => !prev);
            }} open={navbarOpen}/>
            <MainNavbar open={isMobile ? navbarOpen: true}></MainNavbar>
        </div>
    )
}

export default MainNavbarHeader;