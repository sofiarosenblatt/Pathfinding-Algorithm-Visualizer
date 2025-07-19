import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./TutorialPopup.css";

const tabs = [
    { id: "instructions", label: "Instructions" },
    { id: "dijkstra", label: "Dijkstra's Algorithm" },
    { id: "astar", label: "A* Algorithm" }
];

const content = {
    instructions: [
        {
            title: "Welcome to the Pathfinding Algorithm Visualizer!",
            content_1: "This tool helps you visualize how search algorithms find the shortest path between two points on a grid.",
            content_2: "•   Click on the grid to set your source and target, then add walls or weights.\n•  Use the controls above the grid to select tools, adjust how the algorithm searches, and run the search animation."
        },
        {
            title: "1. Set Source",
            content_1: "Choose where the path starts.",
            images_1: ["/images/set-source-step-1.gif", "/images/set-source-step-2.gif", "/images/set-source-step-3.gif"],
        },
        {
            title: "2. Set Target",
            content_1: "Choose where the path ends.",
            images_1: ["/images/set-target-step-1.gif", "/images/set-target-step-2.gif", "/images/set-target-step-3.gif"],
        },
        {
            title: "3. Add Walls",
            content_1: "Place obstacles that the algorithm must avoid.",
            images_1: ["/images/add-wall-step-1.gif", "/images/add-wall-step-2.gif", "/images/add-wall-step-3.gif"],
        },
        {
            title: "4. Add Weights",
            content_1: "Add nodes that are harder to pass through.",
            images_1: ["/images/add-weight-step-1.gif", "/images/add-weight-step-2.gif", "/images/add-weight-step-3.gif"],
            content_2: "You can adjust the cost of the weight nodes.",
            images_2: ["/images/adjust-weight-cost.gif"]
        },
        {
            title: "5. Algorithm",
            content_1: "Select the algorithm you want to visualize.",
            images_1: ["/images/select-algorithm.gif"],
            content_2: "A* uses a heuristic to find paths faster, while Dijkstra's explores all possible paths. Both guarantee the shortest path, but A* is usually more efficient on large grids."
        },
        {
            title: "6. Run",
            content_1: "Watch the algorithm find the shortest path!",
            images_1: ["/images/run-step-1.gif"],
            content_2: "If no path is found, try moving walls or weights, or check that source and target are not blocked."
        },
        {
            title: "7. Move Diagonally",
            content_1: "Toggle 8-way diagonal movement to let the algorithm move diagonally, potentially finding faster paths.",
            images_1: ["/images/adjust-movement.gif"],
        },
        {
            title: "8. Animation Speed",
            content_1: "Control how fast the algorithm visualization runs.",
            images_1: ["/images/adjust-animation-speed.gif"],
        },
        {
            title: "9. Erase Selection",
            content_1: "Use the Erase tool to remove walls, weights, or reset the source/target by clicking on them.",
            images_1: ["/images/erase-item-step-1.gif", "/images/erase-item-step-2.gif", "/images/erase-item-step-3.gif"],
        },
        {
            title: "10. Clear All",
            content_1: "You can also clear all nodes and start from scratch.",
            images_1: ["/images/clear.gif"],
        },
        {
            title: "11. Display Node Costs",
            content_1: "You can toggle the display of the node costs computed by the algorithm.",
            images_1: ["/images/display-node-costs.gif"],
            content_2: "Node costs show the value used by the algorithm to determine the best path."
        },
        {
            title: "12. Replay Animation",
            content_1: "Watch the pathfinding animation again.",
            images_1: ["/images/replay-step-1.gif"],
        },
        {
            title: "13. Start Over",
            content_1: "Reset the grid to start a new pathfinding session from scratch.",
            images_1: ["/images/start-over-step-1.gif"],
        },
        {
            title: "14. Edit Nodes",
            content_1: "You can also edit individual pre-selected nodes instead of starting a new pathfinding session from scratch.",
            images_1: ["/images/edit-step-1.gif"],
        },
    ],
    dijkstra: [
        {
            title: "Dijkstra's Algorithm",
            content_1: "Dijkstra's Algorithm always finds the shortest path by exploring nodes in order of their total cost from the start. It does not use any guesswork (heuristics) about the remaining distance to the goal.",
            content_2: "Dijkstra's is ideal for grids or graphs where all edge weights are non-negative, and it will explore every possible path if needed."
        },
        {
            title: "1. Initialization",
            content_1: "Dijkstra's algorithm begins by assigning a distance of 0 to the source node and infinity to all other nodes.",
            images_1: ["/images/search_start.png"],
        },
        {
            title: "2. Selecting the Nearest Node",
            content_1: "A priority queue is a data structure that always returns the node with the shortest known distance so far. It is used to track which node should be visited next.",
            images_1: ["/images/dijkstra_pq.gif"],
            content_2: "The algorithm repeatedly selects the unvisited node with the smallest distance from the priority queue, ensuring that it always expands the shortest known path first.",
        },
        {
            title: "3. Updating Neighboring Nodes",
            content_1: "For each selected node, the algorithm examines its neighboring nodes.",
            images_1: ["/images/dijkstra_neighbors.gif"],
            content_2: "If a shorter path to a neighboring node is found through the current node, the algorithm updates the recorded distance for that neighbor.",
        },
        {
            title: "4. Marking Nodes as Visited",
            content_1: "Once a node has been processed, it is marked as visited. Visited nodes are not checked again.",
            images_1: ["/images/dijkstra_visited.gif"],
            content_2: "The algorithm then moves to the next closest unvisited node.",
        },
        {
            title: "5. Repeating Until the Target is Reached",
            content_1: "This process continues until the target node is reached or all reachable nodes have been visited.",
            images_1: ["/images/dijkstra_simulation.gif"],
            content_2: "If the target is unreachable, the algorithm determines that no valid path exists.",
        },
        {
            title: "6. Handling Weights and Obstacles",
            content_1: "Weighted nodes increase the cost to reach them. If paths have different weights (such as varying travel times or costs), Dijkstra always selects the least costly route rather than the shortest number of steps.",
            images_1: ["/images/dijkstra_weight.png"],
            content_2: "Walls are treated as uncrossable obstacles. If there are any wall nodes, they are either ignored or treated as having an infinite cost, preventing them from being included in the path.",
            images_2: ["/images/dijkstra_wall.png"]
        },
        {
            title: "7. Reconstructing the Shortest Path",
            content_1: "Once the shortest path to the target is determined, it is traced back from the target to the source using each node's recorded predecessor (i.e., parent node).",
            images_1: ["/images/dijkstra_path.gif"],
            content_2: "This ensures that the final path is optimal, providing the most efficient route based on the given weights.",
        },
        {
            title: "A* vs. Dijkstra's: Key Differences",
            content_1: "•   Both algorithms guarantee the shortest path if all edge weights are non-negative.",
            content_2: "•   Dijkstra's explores all possible paths in order of cost, which can be slow for large grids.\n•  A* uses a heuristic to focus its search toward the target, making it faster in most cases."
        }
    ],
    astar: [
        {
            title: "A* Algorithm",
            content_1: "A* is a pathfinding algorithm that combines the actual distance traveled from the start with an estimate (heuristic) of the distance left to the goal.",
            content_2: "This estimate helps A* focus its search toward the target, often making it much faster than Dijkstra's algorithm, especially on large or complex grids. Like Dijkstra's, A* always finds the shortest path if the heuristic never overestimates the true distance."
        },
        {
            title: "1. Initialization",
            content_1: "The A* algorithm begins by assigning a distance (g score) of 0 to the source node and infinity to all other nodes.",
            images_1: ["/images/search_start.png"],
            content_2: "A priority queue is a data structure used to track which node should be visited next by returning the node with the lowest cost so far. Unlike Dijkstra's algorithm, A* prioritizes nodes based on both their current distance from the start (g) and an estimated heuristic cost (h) to the target.",
            images_2: ["/images/astar_pq_blank.png"]
        },
        {
            title: "2. Using the Cost Function",
            content_1: "Each node is assigned a total estimated cost f(n) = g(n) + h(n), where: \n•   g(n) is the known cost from the start to this node.\n•   h(n) is the heuristic estimate of the cost from this node to the target.\n•   f(n) is their sum.",
            images_1: ["/images/astar_cost_function.gif"],
            content_2: "This heuristic helps A* focus on paths leading toward the goal, rather than exploring all possible routes equally.",
        },
        {
            title: "3. Selecting the Best Node to Expand",
            content_1: "The priority queue returns the unvisited node with the lowest estimated total cost f(n).",
            images_1: ["/images/astar_pq.gif"],
            content_2: "This ensures it expands paths that are likely to reach the target efficiently.",
        },
        {
            title: "4. Updating Neighboring Nodes",
            content_1: "For each selected node, the algorithm examines its neighboring nodes. If a shorter path to a neighbor is found, it updates that node's g(n) cost and recalculates its total f(n) value.",
            images_1: ["/images/astar_neighbor.gif"],
            content_2: "The updated neighbor is then added to the priority queue for further exploration.",
        },
        {
            title: "5. Marking Nodes as Visited",
            content_1: "Once a node has been processed, it is marked as visited. Visited nodes are not checked again.",
            images_1: ["/images/astar_set_visited.gif"],
            content_2: "The algorithm then moves to the next closest unvisited node.",
        },
        {
            title: "6. Repeating Until the Target is Reached",
            content_1: "This process continues until the target node is reached or all reachable nodes have been visited.",
            images_1: ["/images/astar_sim.gif"],
            content_2: "If the target is unreachable, the algorithm determines that no valid path exists.",
        },
        {
            title: "7. Handling Weights and Obstacles",
            content_1: "Weighted nodes increase the cost to reach them. If paths have different weights (such as varying travel times or costs), A* incorporates these into the cost function, ensuring that higher-cost routes are avoided when possible.",
            images_1: ["/images/astar_weight.png"],
            content_2: "Walls are treated as uncrossable obstacles. If there are any wall nodes, they are either ignored or treated as having an infinite cost, preventing them from being included in the path.",
            images_2: ["/images/astar_wall.png"],
        },
        {
            title: "8. Reconstructing the Shortest Path",
            content_1: "Once the shortest path to the target is determined, it is traced back from the target to the source using each node's recorded predecessor (i.e., parent node).",
            images_1: ["/images/astar_final_path.gif"],
            content_2: "This ensures an optimal and efficient route, guided by both actual travel costs and estimated distance to the goal.",
        },
        {
            title: "A* vs. Dijkstra's: Key Differences",
            content_1: "•   Both algorithms guarantee the shortest path if all edge weights are non-negative.",
            content_2: "•   Dijkstra's explores all possible paths in order of cost, which can be slow for large grids.\n•  A* uses a heuristic to focus its search toward the target, making it faster in most cases."
        }
    ]
};

const TutorialPopup = ( {onClosePopup, popupState} ) => {
    const [activeTab, setActiveTab] = useState("instructions");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const nextSlide = () => {
        if (currentSlide < content[activeTab].length - 1) {
            setCurrentSlide((prev) => (prev + 1) % content[activeTab].length);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide((prev) => (prev - 1 + content[activeTab].length) % content[activeTab].length);
        }
    };

    useEffect(() => {
        if (popupState) {
            setIsVisible(true);
        }
    });

    const closePopup = () => {
        setIsVisible(false);
        onClosePopup();
    };

    const handleTabChange = (tab) => {
        setCurrentSlide(0);
        setActiveTab(tab);
    };

    if (!isVisible) return null;  // Hide popup if closed

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-popup">
                {/* Close Button */}
                <button className="close-btn" onClick={closePopup}><X size={20} /></button>

                {/* Tab Buttons */}
                <div className="tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => handleTabChange(tab.id)}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    <h2>{content[activeTab][currentSlide].title}</h2>
                    <p style={{ whiteSpace: "pre-line" }}>{content[activeTab][currentSlide].content_1}</p>

                    { "images_1" in content[activeTab][currentSlide] && content[activeTab][currentSlide].images_1.map((image, index) => (
                        <img 
                            key={index}
                            style={{ display: "flex" }}
                            src={`${image}`} alt={`tab-content-img-${index + 1}`}>
                        </img>
                    ))}
                    
                    <p style={{ visibility: `${"content_2" in content[activeTab][currentSlide] ? "visible" : "hidden"}`, whiteSpace: "pre-line" }}>
                        {`${content[activeTab][currentSlide].content_2}`}
                    </p>

                    { "images_2" in content[activeTab][currentSlide] && content[activeTab][currentSlide].images_2.map((image, index) => (
                        <img 
                            key={index}
                            style={{ display: "flex" }}
                            src={`${image}`} alt={`tab-content-img-${index + 1}`}>
                        </img>
                    ))}
                    
                </div>

                <div className="navigation-buttons" id="navigation-buttons">
                    <button className="left_btn" onClick={prevSlide}><ArrowLeft size={20} /></button>
                    <button className="right_btn" onClick={nextSlide}><ArrowRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default TutorialPopup;
