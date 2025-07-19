import { useLocation } from "react-router";
import "./Header.css";

const Header = ({ onSelectHelpButton }) => {
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
            <button className="header-button" id="help-button" onClick={() => onSelectHelpButton() }>
                <img src={'/images/bulb.svg'} alt="Help"></img>
            </button>
        </div>
    );
}

export default Header;