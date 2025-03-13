import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css"
import TutorialPopup from "./components/TutorialPopup";
import Grid from "./components/Grid";
import Navbar from "./components/Navbar";
import Header from "./components/Header";

function App() {
    const [selectedTool, setSelectedTool] = useState(null);
    const [animationSpeed, setAnimationSpeed] = useState(50);
    const [weightCost, setWeightCost] = useState(5);
    const [selectedAlgorithm, setAlgorithm] = useState("A*");
    const [allowDiagonal, setAllowDiagonal] = useState(true);
    const [nodeCosts, setNodeCosts] = useState(null);
    
    const [nodesExplored, setNodesExplored] = useState(0);
    const [pathCost, setPathCost] = useState(0);
    const [pathLength, setPathLength] = useState(0);
    const [visited, setVisited] = useState(null);

    const preItems = new Set(document.getElementsByClassName("pre"));
    const postItems = new Set(document.getElementsByClassName("post"));
    const inputItems = new Set(document.getElementsByClassName("input"));

    /** Handles tool selection from Navbar */
    const handleToolSelect = (tool) => {
        setSelectedTool(tool);
        if (tool === "restart") {
            preItems.forEach( item => { item.style.display = "flex";})
            postItems.forEach( item => { item.style.display = "none";})
            inputItems.forEach( item => { item.disabled = false; });
    
            document.getElementById("display-costs-toggle").checked = false;
            document.getElementById("run-button").style.display = "flex";
            
            var visitedList = new Set(document.getElementsByClassName("grid-node-span"));
            visitedList.forEach( item => {
                item.innerHTML = "";
                item.style.visibillity = "hidden";
            })
        } else if (tool === "edit") {
            preItems.forEach( item => { item.style.display = "flex";})
            postItems.forEach( item => { item.style.display = "none";})
            inputItems.forEach( item => { item.disabled = false; });
    
            handleDisplayNodeCosts(false);
            document.getElementById("run-button").style.display = "flex";
        }
    };

    /** Handles animation speed adjustment */
    const handleSpeedChange = (speed) => {
        setAnimationSpeed(speed);
    };

    /** Handles changes to weight cost */
    const handleWeightCostChange = (cost) => {
        setWeightCost(cost);
    }

    const handleToggleDiagonal = (isDiagonal) => {
        setAllowDiagonal(isDiagonal);
    };

    const handleAlgorithmSelection = (selection) => {
        setAlgorithm(selection);
    }

    const handleDisplayNodeCosts = (checked) => {
        if (checked && visited) {
            visited.forEach((node, index) => {
                const nodeElement = document.getElementById(`${node[0]}-${node[1]} span`);
                nodeElement.innerHTML = `${nodeCosts[index].toFixed(1)}`;
                nodeElement.style.visibility = "visible";
            });
        } else {
            visited.forEach(node => {
                const nodeElement = document.getElementById(`${node[0]}-${node[1]} span`);
                nodeElement.style.visibility = "hidden";
            });
        }
    }

    const handleMissingVars = () => {
        setSelectedTool(null);
    }

    /** Triggers the selected search algorithm */
    const runAlgorithm = (num_rows, num_cols, source, target, walls, weights, animatePath, isRunning) => {
        if (isRunning) {
            preItems.forEach( item => { item.style.display = "none";})
            postItems.forEach( item => { item.style.display = "flex";})
            inputItems.forEach( item => { item.disabled = true; });
            document.getElementById("run-button").style.display = "none";

            let fetch_link = "http://192.168.86.116:5000/"
            if (selectedAlgorithm === "A*") fetch_link = "http://192.168.86.116:5000/astar"
            else if (selectedAlgorithm === "Dijkstra's") fetch_link = "http://192.168.86.116:5000/dijkstra"

            fetch(fetch_link, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ num_rows, num_cols, source, target, walls, weights, weightCost, allowDiagonal })
            })
            .then(response => response.json())
            .then(data => {
                setNodesExplored(data.visited.length);
                setPathCost(data.path_cost);
                setPathLength(data.path_length);
                setVisited(data.visited);
                setNodeCosts(data.node_costs);
                animatePath(data.visited, data.path, animationSpeed);
            })
            .catch(error => console.error("Error running search algorithm:", error));
            setSelectedTool(null);
        }
    };  

    return (
        <div className="App">
            <TutorialPopup />
            <Router>
                <Header />
                <Navbar onSelectTool={handleToolSelect} onAlgorithmSelection={handleAlgorithmSelection} 
                onSpeedChange={handleSpeedChange} onWeightCostChange={handleWeightCostChange}
                onToggleDiagonal={handleToggleDiagonal} toolChangeTrigger={selectedTool} 
                nodesExplored={nodesExplored} pathCost={pathCost} pathLength={pathLength} onDisplayNodeCosts={handleDisplayNodeCosts}/>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Grid selectedTool={selectedTool} 
                                  animationSpeed={animationSpeed}
                                  onRun={runAlgorithm}
                                  onMissingVars={handleMissingVars} 
                                  onToolUpdate={handleToolSelect}
                                  />
                        </>
                    } />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

