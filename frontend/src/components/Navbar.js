import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Navbar.css";

const Navbar = ({ onSelectTool, onAlgorithmSelection, onSpeedChange, onWeightCostChange, onToggleDiagonal, toolChangeTrigger, nodesExplored, pathCost, pathLength, onDisplayNodeCosts }) => {
    const [selectedTool, setSelectedTool] = useState(null);
    const [speed, setSpeed] = useState(50);
    const [weightCost, setWeightCost] = useState(5);
    const [algorithm, setAlgorithm] = useState("A*");
    const [allowDiagonal, setAllowDiagonal] = useState(true);
    const [displayNodeCosts, setDisplayNodeCosts] = useState(false);

    const handleToolSelect = (tool) => {
        if (selectedTool && tool === selectedTool) {
            setSelectedTool(null);
            onSelectTool(null);
            setButtonActive(null);
        } else {
            setSelectedTool(tool);
            onSelectTool(tool);
            setButtonActive(tool);
        }
        if (selectedTool === "edit" || selectedTool === "restart") {
            setDisplayNodeCosts(false);
        }
    };

    useEffect(() => {
        if (toolChangeTrigger !== selectedTool) {
            handleToolSelect(toolChangeTrigger);
        }
    });

    const handleSpeedChange = (value) => {
        const newSpeed = Math.max(10, Math.min(speed + value, 200));
        setSpeed(newSpeed);
        onSpeedChange(newSpeed);
    };

    const handleWeightCostChange = (value) => {
        const newCost = Math.min(Math.max(0, weightCost + value), 20);
        setWeightCost(newCost);
        onWeightCostChange(newCost);
    }

    const handleDiagonalToggle = () => {
        setAllowDiagonal(!allowDiagonal);
        onToggleDiagonal(!allowDiagonal);
    }

    const handleDisplayNodeCosts = () => {
        setDisplayNodeCosts(!displayNodeCosts);
        onDisplayNodeCosts(!displayNodeCosts);
    }

    function showDropdownItems() {
        document.getElementById("algorithmDropdown").style.left = `${document.getElementById("dropdownLabel").offsetLeft}px`;
        document.getElementById("algorithmDropdown").classList.toggle("show");
    }

    function setButtonActive(tool) {
        const mediaWidth = window.innerWidth;
        const changingButtons = new Set(["source", "target", "wall", "weight", "erase"]);
        const allButtons = new Set(document.getElementsByClassName("navbar-primary-button"));

        if (mediaWidth < 768) {
            allButtons.forEach( button => {
                button.lastChild.style.backgroundColor = "var(--grid-color)";
                button.childNodes[1].style.visibility = "hidden";
            })
            if ((selectedTool && tool && selectedTool !== tool) || (!selectedTool && tool)) {
                if (changingButtons.has(tool)) {
                    document.getElementById(`${tool}-button`).lastChild.style.backgroundColor = "var(--accent-color)";
                    document.getElementById(`${tool}-hinttext`).style.visibility = "visible";
                }
            }
        }
    }

    // Close dropdown
    window.onclick = function(e) {
        if (!e.target.matches('.dropdown-button')) {
            var dropdown = document.getElementById("algorithmDropdown");
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }

    const handleAlgorithmChange = (selected) => {
        if (selected === algorithm) return;
        setAlgorithm(selected);
        onAlgorithmSelection(selected);
    }

    const getButtonLabel = (tool) => {
        if (tool === "source") {
            if (selectedTool && selectedTool === "source") return "Done";
            else return "Set Source";
        }
        else if (tool === "target") {
            if (selectedTool && selectedTool === "target") return "Done";
            else return "Set Target";
        }
        else if (tool === "wall") {
            if (selectedTool && selectedTool === "wall") return "Done";
            else return "Add Walls";
        }
        else if (tool === "weight") {
            if (selectedTool && selectedTool === "weight") return "Done";
            else return "Add Weights";
        }
        else if (tool === "erase") {
            if (selectedTool && selectedTool === "erase") return "Done";
            else return "Erase Selection";
        }
        else if (tool === "restart") {
            if (selectedTool && selectedTool === "restart") return "Done";
            else return "Start Over";
        }
        else if (tool === "replay") {
            if (selectedTool && selectedTool === "replay") return "Done";
            else return "Replay Animation";
        }
    };

    return (
        <div className="navbar-container">
            <div className="navbar-primary">
                <button className="navbar-primary-button pre" id="source-button" onClick={() => handleToolSelect("source")}>
                    {getButtonLabel("source")} 
                    <span className="hinttext" id="source-hinttext">Set Source</span>
                    <img src={'/images/source.png'} alt="Set Source"></img>
                </button>
                <button className="navbar-primary-button pre" id="target-button" onClick={() => handleToolSelect("target")}>
                    {getButtonLabel("target")}
                    <span className="hinttext" id="target-hinttext">Set Target</span>
                    <img src={'/images/target.png'} alt="Set Target"></img>
                </button>
                <button className="navbar-primary-button post" id="replay-button" style={{display: 'none'}} onClick={() => handleToolSelect("replay")}>Replay Animation
                <span className="hinttext" id="replay-hinttext">Replay Animation</span>
                <img src={'/images/repeat-solid.png'} alt="Replay"></img>
                </button>
                <button className="navbar-primary-button post" id="restart-button" style={{display: 'none'}} onClick={() => handleToolSelect("restart")}>Start Over
                <span className="hinttext" id="restart-hinttext">Start Over</span>
                <img src={'/images/trash-can-solid.png'} alt="Restart"></img>
                </button>
                <button className="navbar-primary-button post" id="edit-button" style={{display: 'none'}} onClick={() => handleToolSelect("edit")}>Edit
                <span className="hinttext" id="edit-hinttext">Edit</span>
                <img src={'/images/pen-to-square-regular.png'} alt="Edit"></img>
                </button>
                <button className="navbar-primary-button pre" id="wall-button" onClick={() => handleToolSelect("wall")}>
                    {getButtonLabel("wall")}
                    <span className="hinttext" id="wall-hinttext">Add Walls</span>
                    <img src={'/images/boundary.png'} alt="Add Walls"></img>
                </button>
                <button className="navbar-primary-button pre" id="weight-button" onClick={() => handleToolSelect("weight")}>
                    {getButtonLabel("weight")}
                    <span className="hinttext" id="weight-hinttext">Add Weights</span>
                    <img src={'/images/weight.png'} alt="Add Weights"></img>
                </button>
                <button className="navbar-primary-button pre" id="erase-button" onClick={() => handleToolSelect("erase")}>
                    {getButtonLabel("erase")}
                    <span className="hinttext" id="erase-hinttext">Erase Selection</span>
                    <img src={'/images/eraser.png'} alt="Erase"></img>
                </button>
                <button className="navbar-primary-button run" id="run-button" onClick={() => handleToolSelect("run")}>Run
                <span className="hinttext" id="run-hinttext"></span>
                <img src={'/images/play.png'} alt="Run"></img>
                </button>
            </div>
            <div className="navbar-secondary">
                <div className="navbar-secondary-item pre">
                    <span className="navbar-label">Algorithm</span>
                    <button className="dropdown-button" id="dropdownLabel" onClick={() => showDropdownItems()}><div></div>{algorithm}
                    <i className="triangle"></i></button>
                    <div className="dropdown-content" id="algorithmDropdown">
                        <span onClick={() => handleAlgorithmChange("A*")}>A*</span>
                        <span onClick={() => handleAlgorithmChange("Dijkstra's")}>Dijkstra's</span>
                    </div>
                </div>
                <div className="navbar-secondary-item pre">
                    <span className="navbar-label">Weight Cost</span>
                    <div className="plus-minus-button">
                        <button className="navbar-secondary-button" id="minus-button" onClick={() => handleWeightCostChange(-1)}>
                            <img src={'/images/minus-solid.png'} alt="Minus"></img>
                        </button>
                        <span className="navbar-label">{weightCost}</span>
                        <button className="navbar-secondary-button" id="plus-button" onClick={() => handleWeightCostChange(+1)}>
                            <img src={'/images/plus-solid.png'} alt="Plus"></img>
                        </button>
                    </div>
                </div>
                <div className="navbar-secondary-item pre">
                    <span className="navbar-label">Movement</span>
                    <label className="toggle">
                        <input 
                        type="checkbox"
                        checked={allowDiagonal}
                        onChange={handleDiagonalToggle}
                        />
                        <span className="slider">
                            <span style={{ display: allowDiagonal ? "block" : "none" }} id="eight-way-label">8-way</span>
                            <span style={{ display: allowDiagonal ? "none" : "block" }} id="four-way-label">4-way</span>
                        </span>
                    </label>
                </div>
                <div className="post table" style={{display: 'none'}}>
                    <div className="row">
                        <span>Search Results:</span>
                    </div>
                    <div className="row">
                        <span className="cell">{`Nodes Explored: ${nodesExplored}`}</span>
                        <span className="cell">{`Path Length: ${pathLength.toFixed(2)}`}</span>
                    </div>
                    <div className="row">
                        <span className="cell">{`Path Cost: ${pathCost.toFixed(2)}`}</span>
                        <span className="cell display-costs-switch">Display Node Costs:
                            <input
                                type="checkbox"
                                id="display-costs-toggle"
                                checked={displayNodeCosts}
                                onChange={handleDisplayNodeCosts}
                            />
                        </span>
                    </div>
                </div>
                <div className="navbar-secondary-item">
                    <span className="navbar-label">Animation Speed</span>
                    <div className="plus-minus-button">
                        <button className="navbar-secondary-button" id="minus-button" onClick={() => handleSpeedChange(-10)}>
                            <img src={'/images/minus-solid.png'} alt="Minus"></img>
                        </button>
                        <span className="navbar-label">{speed}%</span>
                        <button className="navbar-secondary-button" id="plus-button" onClick={() => handleSpeedChange(+10)}>
                            <img src={'/images/plus-solid.png'} alt="Plus"></img>
                        </button>
                    </div>
                </div>
                <div className="navbar-secondary-item pre">
                    <span className="navbar-label">Clear</span>
                    <button className="navbar-secondary-button" id="clear-button" onClick={() => handleToolSelect("restart")}>
                        <img src={'/images/trash-can-solid.png'} alt="Clear"></img>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
