import React, { useState } from "react";
import "./StatsPopup.css";
import { SquareMinus } from "lucide-react";

const StatsPopup = ({ nodesExplored, pathCost, pathLength, onDisplayNodeCosts }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [position, setPosition] = useState({ x: 5, y: 75 }); // Initial position
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [displayNodeCosts, setDisplayNodeCosts] = useState(false);

    const pxToVw = (px) => (px / window.innerWidth) * 100;
    const pxToVh = (px) => (px / window.innerHeight) * 100;

    // Start dragging
    const handleMouseDown = (e) => {
        setDragging(true);
        setOffset({
            x: pxToVw(e.clientX)- position.x,
            y: pxToVh(e.clientY) - position.y
        });
    };

    // Move popup
    const handleMouseMove = (e) => {
        if (dragging) {
            const newX = pxToVw(e.clientX) - offset.x;
            const newY = pxToVh(e.clientY) - offset.y;

            setPosition({
                x: Math.max(0, Math.min(newX, 85)),
                y: Math.max(0, Math.min(newY, 85))
            });
        }
    };

    const handleDisplayNodeCosts = () => {
        setDisplayNodeCosts(!displayNodeCosts);
        onDisplayNodeCosts(!displayNodeCosts);
    }

    // Stop dragging
    const handleMouseUp = () => {
        setDragging(false);
    };

    const minimizePopup = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="stats-popup post" id="stats-popup" 
        style={{ display: "none", left: `${position.x}vw`, top: `${position.y}vh` }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}>
            {/* Minimize Button */}
            <div className="stats-tab" onMouseDown={handleMouseDown}>
                <button className="minimize-btn" onClick={minimizePopup}><SquareMinus size={20} /></button>
                <p>Search Results</p>
            </div>
            <div className="stats-content"
            style={{ display: isMinimized ? "none" : "block"}}>
                <p>{`Nodes Explored: ${nodesExplored}`}</p>
                <p>{`Path Cost: ${pathCost.toFixed(2)}`}</p>
                <p>{`Path Length: ${pathLength.toFixed(2)}`}</p>
                <div className="display-costs-switch">
                    <p>Display Node Costs:</p>
                    <input
                        type="checkbox"
                        id="display-costs-toggle"
                        checked={displayNodeCosts}
                        onChange={handleDisplayNodeCosts}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatsPopup;