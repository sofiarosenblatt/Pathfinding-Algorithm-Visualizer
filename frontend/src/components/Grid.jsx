import { useState, useEffect, useCallback, useRef } from "react";
import "./Grid.css";

/**
 * Grid component for rendering and interacting with the pathfinding grid.
 * Handles user interactions, grid state, node editing, and animation of algorithm results.
 *
 * Props:
 *   - selectedTool (string): The currently selected tool (e.g., "source", "target", "wall", "weight", "run", etc.).
 *   - animationSpeed (number): Animation speed in ms per step.
 *   - onRun (function): Callback to trigger the backend algorithm run.
 *   - onMissingVars (function): Callback when required variables are missing.
 *   - onToolUpdate (function): Callback to update the selected tool.
 */
const Grid = ({ selectedTool, animationSpeed, onRun, onMissingVars, onToolUpdate }) => {
    const [numRows, setNumRows] = useState(30);
    const [numCols, setNumCols] = useState(30);
    const [grid, setGrid] = useState([]);
    const [nodesInUse, setNodesInUse] = useState(new Map());
    const [sourceNode, setSource] = useState(null);
    const [targetNode, setTarget] = useState(null);
    const [walls, setWalls] = useState(new Set());
    const [weights, setWeights] = useState(new Set());
    const [isRunning, setIsRunning] = useState(false);
    const [lastVisited, setLastVisited] = useState([]);
    const [lastPath, setLastPath] = useState([]);
    const [warningMessage, setWarningMessage] = useState("");

    const visitedNodesRef = useRef(new Set());
    const pathNodesRef = useRef(new Set());
    const animationTimeouts = useRef([]);
    const animationSpeedRef = useRef(animationSpeed);

    /**
     * Dynamically calculates the grid size based on the window size.
     * Ensures a minimum grid size and resets source/target if out of bounds.
     */
    const calculateGridSize = useCallback(() => {
        const cellSize = 25; // Size of each cell in pixels
        const maxWidth = window.innerWidth * 0.9; // % of screen width
        const maxHeight = window.innerHeight * 0.7; // % of screen height

        const newNumCols = Math.floor(maxWidth / cellSize);
        const newNumRows = Math.floor(maxHeight / cellSize);

        var greatestX = 0;
        var greatestY = 0;
        visitedNodesRef.current.forEach(item => {
            item = item.split(",")
            if (item[0] > greatestX) greatestX = item[0];
            if (Number(item[1]) > greatestY) greatestY = Number(item[1]);
        });

        setNumCols(Math.max(newNumCols, 10)); // Ensure minimum of 10 cols
        setNumRows(Math.max(newNumRows, 15)); // Ensure minimum of 15 rows

        if (greatestY >= newNumCols || greatestX >= newNumRows) {
            setSource(null);
            setTarget(null);
            var preItems = new Set(document.getElementsByClassName("pre"));
            preItems.forEach( item => { item.style.display = "flex";})
            document.getElementById("run-button").style.display = "flex";

            var postItems = new Set(document.getElementsByClassName("post"));
            postItems.forEach( item => { item.style.display = "none";})

            var inputItems = new Set(document.getElementsByClassName("input"));
            inputItems.forEach( item => { item.disabled = false; });

            document.getElementById("display-costs-toggle").checked = false;
            var visitedList = new Set(document.getElementsByClassName("grid-node-span"));
            visitedList.forEach( item => {
                item.innerHTML = "";
                item.style.visibillity = "hidden";
            })
        }
    }, []);

    /**
     * Updates the grid size when the window is resized.
     */
    useEffect(() => {
        calculateGridSize();
        window.addEventListener("resize", calculateGridSize);
        return () => window.removeEventListener("resize", calculateGridSize);
    }, [calculateGridSize]);

    /**
     * Creates a new grid when the computed size changes.
     * Removes nodes that are now out of bounds.
     */
    useEffect(() => {
        const newGrid = Array.from({ length: numRows }, (_, row) =>
            Array.from({ length: numCols }, (_, col) => (
                { row, col, type:  nodesInUse.has(document.getElementById(`${row}-${col}`)) ? nodesInUse.get(document.getElementById(`${row}-${col}`)) : null }
        )));
        setGrid(newGrid);
        for (var key of nodesInUse.keys()) {
            const node = key.id.split("-");
            if (node[0] >= numRows || node[1] >= numCols) {
                nodesInUse.delete(key);
            }
        }
        setNodesInUse(nodesInUse);
    }, [numRows, numCols, nodesInUse]);

    /**
     * Edits a single node in the grid based on user selection and tool.
     * Handles toggling of source, target, wall, and weight nodes.
     *
     * @param {number} row - Row index of the node.
     * @param {number} col - Column index of the node.
     * @param {string} nodeType - Type of node to set ("source", "target", "wall", "weight").
     */
    const editNode = useCallback((row, col, nodeType) => {
        const node = `${row},${col}`;

        // If node changed was previously a source or target, reset it
        if (sourceNode && sourceNode[0] === row && sourceNode[1] === col) { 
            setSource(null); 
        }
        if (targetNode && targetNode[0] === row && targetNode[1] === col) { 
            setTarget(null); 
        }

        if (nodeType === "source") {
            setSource([row, col]);
        }
        if (nodeType === "target") {
            setTarget([row, col]);
        }
        if (nodeType === "wall") {
            setWalls(prevWalls => {
                const newWalls = new Set(prevWalls);
                if (newWalls.delete(node)) {
                } else {
                    newWalls.add(node);
                }
                return newWalls;
            });
        } 
        if (nodeType === "weight") {
            setWeights(prevWeights => {
                const newWeights = new Set(prevWeights);
                if (newWeights.delete(node)) {
                } else {
                    newWeights.add(node);
                }
                return newWeights;
            });
        }

    }, [sourceNode, targetNode]);

    /**
     * Handles user clicks on grid nodes, updating node type and grid state.
     * Supports placing/removing source, target, wall, weight, and erase actions.
     *
     * @param {number} row - Row index of the clicked node.
     * @param {number} col - Column index of the clicked node.
     */
    const handleNodeClick = useCallback((row, col) => {
        if (isRunning) return; // Disable actions once path is displayed
        if (!selectedTool) return;

        let newType = selectedTool;
        const node = document.getElementById(`${row}-${col}`);

        if (selectedTool === "source") { 
            // Replace previously selected source node
            if (sourceNode) {
                nodesInUse.delete(document.getElementById(`${sourceNode[0]}-${sourceNode[1]}`));
                setGrid((prevGrid) =>
                    prevGrid.map((r, rIdx) =>
                        r.map((node, cIdx) =>
                            rIdx === sourceNode[0] && cIdx === sourceNode[1] ? { ...node, type: null } : node
                        )
                    )
                );
            }
        }
        else if (selectedTool === "target") { 
            // Replace previously selected target node
            if (targetNode) {
                nodesInUse.delete(document.getElementById(`${targetNode[0]}-${targetNode[1]}`));
                setGrid((prevGrid) =>
                    prevGrid.map((r, rIdx) =>
                        r.map((node, cIdx) =>
                            rIdx === targetNode[0] && cIdx === targetNode[1] ? { ...node, type: null } : node
                        )
                    )
                );
            }
        }
        else if (selectedTool === "wall") { 
            // If re-selecting wall node, treat as undo
            if (node.className === "grid-node wall ") newType = null; 
        }
        else if (selectedTool === "weight") { 
            // If re-selecting weight node, treat as undo
            if (node.className === "grid-node weight ") newType = null;
        }
        
        if (selectedTool === "erase") {
            newType = null;
            if (node.className === "grid-node wall ") {
                editNode(row, col, "wall");
            } else if (node.className === "grid-node weight ") {
                editNode(row, col, "weight");
            } else if (node.className === "grid-node source ") {
                setSource(null);
            } else if (node.className === "grid-node target ") {
                setTarget(null);
            }
        } else editNode(row, col, selectedTool);

        setGrid((prevGrid) =>
            prevGrid.map((r, rIdx) =>
                r.map((node, cIdx) =>
                    rIdx === row && cIdx === col ? { ...node, type: newType } : node
                )
            )
        );

        if (newType !== null) {
            nodesInUse.set(node, newType);
        } else {
            nodesInUse.delete(node);
        }
        setNodesInUse(nodesInUse);
    }, [isRunning, selectedTool, sourceNode, targetNode, editNode, nodesInUse]);

    /**
     * Dynamically updates the animation speed reference when the prop changes.
     */
    useEffect(() => {
        animationSpeedRef.current = animationSpeed;
    }, [animationSpeed]);

    /**
     * Clears all running animations and resets visited/path node states.
     */
    const clearAnimations = useCallback(() => {
        animationTimeouts.current.forEach(clearTimeout);
        animationTimeouts.current = [];
        setIsRunning(false);

        setGrid(prevGrid =>
            prevGrid.map(row =>
                row.map(cell => ({
                    ...cell,
                    type: cell.type && cell.type.includes("visited") ? cell.type.replace("visited", "") 
                    : cell.type && cell.type.includes("path") ? cell.type.replace("path", "") 
                    : cell.type
                }))
            )
        );
    }, []);

    /**
     * Animates the visited nodes and the shortest path on the grid.
     * Locks grid interactions during animation.
     *
     * @param {Array} visited - Array of [row, col] for visited nodes.
     * @param {Array} path - Array of [row, col] for path nodes.
     */
    const animatePath = useCallback((visited, path) => {
        clearAnimations();
        setIsRunning(true);

        setLastVisited(visited); // Store for restart
        setLastPath(path);

        visitedNodesRef.current.clear();
        pathNodesRef.current.clear();

        visited.forEach((node, index) => {
            if (!visitedNodesRef.current.has(`${node[0]},${node[1]}`)) {
                visitedNodesRef.current.add(`${node[0]},${node[1]}`); 
            }
            const timeout = setTimeout(() => {
                setGrid(prevGrid =>
                    prevGrid.map((r, rIdx) =>
                        r.map((cell, cIdx) =>
                            rIdx === node[0] && cIdx === node[1] ? {...cell, type: `${cell.type} visited` } : cell
                        )
                    )
                );
            }, index * (201 - animationSpeedRef.current) / 2);
            animationTimeouts.current.push(timeout);
        });

        const pathTimeout = setTimeout(() => {
            if (path.length === 0) showWarning("No path was found.");
            path.forEach((node, index) => {
                if (!pathNodesRef.current.has(`${node[0]},${node[1]}`)) {
                    pathNodesRef.current.add(`${node[0]},${node[1]}`);
                }
                const timeout = setTimeout(() => {
                    setGrid(prevGrid =>
                        prevGrid.map((r, rIdx) =>
                            r.map((cell, cIdx) =>
                                rIdx === node[0] && cIdx === node[1] ? { ...cell, type: `${cell.type} path` } : cell
                            )
                        )
                    );
                    // Once the last path node is animated, unlock interactions
                    if (index === path.length - 1) {
                        const isRunningTimeout = setTimeout(() => {
                            setIsRunning(false);
                        }, (201 - animationSpeedRef.current) / 2);
                        animationTimeouts.current.push(isRunningTimeout);
                    }
                }, index * (201 - animationSpeedRef.current));
                animationTimeouts.current.push(timeout);
            });
        }, visited.length * (201 - animationSpeedRef.current) / 2);
        animationTimeouts.current.push(pathTimeout);
    }, [clearAnimations]);

    /**
     * Displays a temporary warning popup with the provided message.
     *
     * @param {string} message - The warning message to display.
     */
    const showWarning = (message) => {
        setWarningMessage(message);
        setTimeout(() => {
            setWarningMessage("");
        }, 3000);
    };

    /**
     * Triggers the search algorithm when the "run" tool is selected.
     * Validates that source and target nodes are set and not the same.
     */
    useEffect(() => {
        if (selectedTool === "run") {
            if (!sourceNode) {
                showWarning("Please set a source node before running.");
                onMissingVars();
                setIsRunning(false);
                return;
            }
            if (!targetNode) {
                showWarning("Please set a target node before running.");
                onMissingVars();
                setIsRunning(false);
                return;
            }
            if (sourceNode === targetNode) {
                showWarning("Source and target cannot be the same.");
                onMissingVars();
                setIsRunning(false);
                return;
            }
            if (sourceNode && targetNode && sourceNode !== targetNode) setIsRunning(true);
            onRun(
                numRows, numCols, sourceNode, targetNode, 
                Array.from(walls).map(item => item.split(",").map(Number)), 
                Array.from(weights).map(item => item.split(",").map(Number)),
                animatePath, isRunning
            );
        }
    }, [selectedTool, sourceNode, targetNode, walls, weights, numRows, numCols, onRun, isRunning, animatePath, onMissingVars]);

    /**
     * Clears animations and resets tool when "edit" tool is selected.
     */
    useEffect(() => {
        if (selectedTool === "edit") {
            clearAnimations();
            onToolUpdate(null);
        }
    })
    
    /**
     * Replays the last animation when the "replay" tool is selected.
     */
    useEffect(() => {
        if (lastVisited.length === 0 || lastPath.length === 0) return; // Nothing to replay
        
        if (selectedTool === "replay") {
            clearAnimations();
            animatePath(lastVisited, lastPath);
            onToolUpdate(null);
        }
    }, [selectedTool, lastVisited, lastPath, animatePath, clearAnimations, onToolUpdate]);

    /**
     * Resets the grid and all states when the "restart" tool is selected.
     */
    useEffect(() => {
        if (selectedTool === "restart") {
            animationTimeouts.current.forEach(clearTimeout);
            animationTimeouts.current = [];
            setIsRunning(false);
            setNodesInUse(new Map());
            setWalls(new Set());
            setWeights(new Set());
            setSource(null);
            setTarget(null);
            setGrid(Array.from({ length: numRows }, (_, row) =>
                Array.from({ length: numCols }, (_, col) => ({ row, col, type: null }))
            ));
        }
    }, [selectedTool, numRows, numCols]);
    
    return (
        <div className="grid-container">
            {warningMessage && <div className="warning-popup">{warningMessage}</div>}
            <div className="grid" style={{ 
                gridTemplateColumns: `repeat(${numCols}, minmax(25px, 1fr))`,
                gridTemplateRows: `repeat(${numRows}, 25px)` }} >
                {grid.map((row, rowIdx) =>
                    row.map((node, colIdx) => {
                        let extraClass = "";
                        if (node.type === "visited") extraClass = "visited";
                        if (node.type === "path") extraClass = "path";
                        return (
                            <div
                                key={`${rowIdx}-${colIdx}`}
                                className={`grid-node ${node.type ? node.type : ""} ${extraClass}`}
                                id={`${rowIdx}-${colIdx}`}
                                onClick={() => handleNodeClick(rowIdx, colIdx)}>
                                <span 
                                    className="grid-node-span"
                                    id={`${rowIdx}-${colIdx} span`}
                                    style={{ visibility: "hidden"}}
                                    textcontent={0}>
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Grid;
