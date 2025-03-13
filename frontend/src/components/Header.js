import React from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const location = useLocation();

    const pageTitles = {
        "/": "Pathfinding Algorithm Visualizer",
        "/settings": "Settings",
        "/about": "About This App",
        "/help": "Help & Instructions"
    };

    // Get the title based on the current route (default to home title)
    const title = pageTitles[location.pathname] || "Pathfinding Algorithm Visualizer";

    return (
        <div className="header-container">
            <div className="header-spacer" style={{minWidth: '100px'}}></div>
            <div className="header-title">{title}</div>
            <div className="header-spacer" style={{minWidth: '100px'}}></div>
        </div>
    );
}

export default Header;