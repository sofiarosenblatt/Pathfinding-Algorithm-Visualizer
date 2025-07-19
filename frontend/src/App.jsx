import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router";
import './App.css'
import TutorialPopup from "./components/TutorialPopup";
import Grid from "./components/Grid";
import Navbar from "./components/Navbar";
import Header from "./components/Header";

function App() {
  const API_BASE_URL = import.meta.env.DEV
  ? "http://127.0.0.1:5000"
  : import.meta.env.VITE_API_URL;

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

  const [tutorialPopup, setTutorialPopup] = useState(true);

  /**
   * Handles tool selection from the Navbar.
   * Updates the selected tool and resets or updates UI elements based on the tool.
   *
   * @param {string} tool - The tool selected by the user ("restart", "edit", etc.).
   */
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
          
          var visited = new Set(document.getElementsByClassName("visited"));
          var pathNodes = new Set(document.getElementsByClassName("path"));
          let visitedNodes = new Set([...visited, ...pathNodes]);
          visitedNodes.forEach( item => {
              item.style.backgroundColor = "transparent";
          })
      }
  };

  /**
   * Handles animation speed adjustment from the Navbar.
   *
   * @param {number} speed - The new animation speed in ms per step.
   */
  const handleSpeedChange = (speed) => {
      setAnimationSpeed(speed);
  };

  /**
   * Handles changes to the weight cost from the Navbar.
   *
   * @param {number} cost - The new cost for weighted nodes.
   */
  const handleWeightCostChange = (cost) => {
      setWeightCost(cost);
  }

  /**
   * Handles toggling of diagonal movement option.
   *
   * @param {boolean} isDiagonal - Whether diagonal movement is allowed.
   */
  const handleToggleDiagonal = (isDiagonal) => {
      setAllowDiagonal(isDiagonal);
  };

  /**
   * Handles algorithm selection from the Navbar.
   *
   * @param {string} selection - The selected algorithm ("A*", "Dijkstra's").
   */
  const handleAlgorithmSelection = (selection) => {
      setAlgorithm(selection);
  }

  /**
   * Handles toggling the display of node costs on the grid.
   *
   * @param {boolean} checked - Whether to display node costs.
   */  
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

  /**
   * Handles the case where required variables are missing.
   * Resets the selected tool.
   */
  const handleMissingVars = () => {
      setSelectedTool(null);
  }

  /**
   * Shows the tutorial popup.
   */
  const showTutorial = () => {
        setTutorialPopup(true);
  }

  /**
   * Hides the tutorial popup.
   */
  const hideTutorial = () => {
        setTutorialPopup(false);
  }

  /**
   * Triggers the selected search algorithm (A* or Dijkstra) by sending a POST request to the backend.
   * Updates state with the results and animates the path on the grid.
   *
   * @param {number} num_rows - Number of rows in the grid.
   * @param {number} num_cols - Number of columns in the grid.
   * @param {Array} source - [x, y] coordinates of the source node.
   * @param {Array} target - [x, y] coordinates of the target node.
   * @param {Array} walls - Array of [x, y] coordinates for wall nodes.
   * @param {Array} weights - Array of [x, y] coordinates for weighted nodes.
   * @param {function} animatePath - Callback to animate the path and visited nodes.
   * @param {boolean} isRunning - Whether the algorithm should run.
   */
  const runAlgorithm = (num_rows, num_cols, source, target, walls, weights, animatePath, isRunning) => {
      if (isRunning) {
          preItems.forEach( item => { item.style.display = "none";})
          postItems.forEach( item => { item.style.display = "flex";})
          inputItems.forEach( item => { item.disabled = true; });
          document.getElementById("run-button").style.display = "none";

          let fetch_link = `${API_BASE_URL}/`;
          if (selectedAlgorithm === "A*") fetch_link = `${API_BASE_URL}/astar`;
          else if (selectedAlgorithm === "Dijkstra's") fetch_link = `${API_BASE_URL}/dijkstra`;

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
          <TutorialPopup onClosePopup={hideTutorial} popupState={tutorialPopup} />
          <Router>
              <Header onSelectHelpButton={showTutorial} />
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