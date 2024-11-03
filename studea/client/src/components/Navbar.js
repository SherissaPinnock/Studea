import React from 'react';
import { Link } from 'react-router-dom'; 
import '../css/Navbar.css'; 

const Navbar = () => {
    return (
        <div className="navbar">
            <ul className="navbar-items">
                <li>STUDEA</li>
                <li>My Convos</li>
                <li>Notes</li>
            </ul>
        </div>
    );
};

export default Navbar;
