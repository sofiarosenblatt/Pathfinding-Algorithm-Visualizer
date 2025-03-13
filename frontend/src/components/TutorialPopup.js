import React, { useState } from "react";
import "./TutorialPopup.css";
import { X, ArrowLeft, ArrowRight } from "lucide-react";

const tabs = [
    { id: "instructions", label: "Instructions" },
    { id: "dijkstra", label: "Dijkstra's Algorithm" },
    { id: "astar", label: "A* Algorithm" }
];

const content = {
    instructions: [
        {
            title: "Welcome to the Pathfinding Algorithm Visualizer!",
            content_1: "This tool helps you visualize how search algorithms find the shortest path between two points on a grid. You can set obstacles, weights, and adjust how the algorithm searches.",
        },
        {
            title: "1. Set Source",
            content_1: "Choose where the path starts.",
            image: "/images/set-source-demo.gif"
        },
        {
            title: "2. Set Target",
            content_1: "Choose where the path ends.",
            image: "/images/set-target-demo.gif"
        },
        {
            title: "3. Add Walls",
            content_1: "Place obstacles that the algorithm must avoid.",
            image: "/images/add-walls-demo.gif"
        },
        {
            title: "4. Add Weights",
            content_1: "Add nodes that are harder to pass through.",
            image: "/images/add-weights-demo.gif",
            content_2: "You can adjust the weight nodes' cost with the Weight Cost silder.",
            image_2: "/images/weight-cost-demo.gif"
        },
        {
            title: "5. Algorithm",
            content_1: "Select the algorithm you want to visualize.",
            image: "/images/select-algo-demo.gif",
        },
        {
            title: "6. Move Diagonally",
            content_1: "Toggle diagonal movement to let the algorithm move diagonally, potentially finding faster paths.",
            image: "/images/diagonal-demo.gif",
        },
        {
            title: "7. Animation Speed",
            content_1: "Use the speed slider to control how fast the algorithm runs.",
            image: "/images/set-speed-demo.gif",
        },
        {
            title: "8. Erase Selection",
            content_1: "If necessary, reset any previously selected nodes.",
            image: "/images/erase-demo.gif",
        },
        {
            title: "9. Run",
            content_1: "Watch the algorithm find the shortest path!",
            image: "/images/run-demo.gif",
        },
        {
            title: "10. Start Over/Replay Animation",
            content_1: "Reset the grid or replay the animation.",
            image: "/images/replay-demo.gif",
            image_2: "/images/start-over-demo.gif",
        },
    ],
    dijkstra: [
        {
            title: "Dijkstra's Algorithm",
            content_1: "Dijkstra's Algorithm guarantees the shortest path by exploring all possible paths in order of increasing cost.",
            content_2: "It does not use heuristics and is ideal for graphs with varying, non-negative weights."
        },
        {
            title: "1. Initialization",
            content_1: "Dijkstra's algorithm begins by assigning a distance of 0 to the source node and infinity to all other nodes.",
            image: "/images/search_start.png",
        },
        {
            title: "2. Selecting the Nearest Node",
            content_1: "A priority queue is used to track which node should be visited next, prioritizing the one with the shortest known distance.",
            image: "/images/dijkstra_pq.gif",
            content_2: "The algorithm repeatedly selects the unvisited node with the smallest distance from the priority queue, ensuring that it always expands the shortest known path first.",
        },
        {
            title: "3. Updating Neighboring Nodes",
            content_1: "For each selected node, the algorithm examines its neighboring nodes.",
            image: "/images/dijkstra_neighbors.gif",
            content_2: "If a shorter path to a neighboring node is found through the current node, the algorithm updates the recorded distance for that neighbor.",
        },
        {
            title: "4. Marking Nodes as Visited",
            content_1: "Once a node has been processed, it is marked as visited. Visited nodes are not checked again.",
            image: "/images/dijkstra_visited.gif",
            content_2: "The algorithm then moves to the next closest unvisited node.",
        },
        {
            title: "5. Repeating Until the Target is Reached",
            content_1: "This process continues until the target node is reached or all reachable nodes have been visited.",
            image: "/images/dijkstra_simulation.gif",
            content_2: "If the target is unreachable, the algorithm determines that no valid path exists.",
        },
        {
            title: "6. Handling Weights and Obstacles",
            content_1: "If paths have different weights (such as varying travel times or costs), Dijkstra always selects the least costly route rather than the shortest number of steps.",
            image: "/images/dijkstra_weight.png",
            content_2: "If there are uncrossable obstacles (e.g. walls), they are either ignored or treated as having an infinite cost, preventing them from being included in the path.",
            image_2: "/images/dijkstra_wall.png"
        },
        {
            title: "7. Reconstructing the Shortest Path",
            content_1: "Once the shortest path to the target is determined, it is reconstructed by tracing backward from the target to the source using the recorded shortest distances.",
            image: "/images/dijkstra_path.gif",
            content_2: "This ensures that the final path is optimal, providing the most efficient route based on the given weights.",
        }
    ],
    astar: [
        {
            title: "A* Algorithm",
            content_1: "A* is a pathfinding algorithm that balances actual distance traveled with an estimate of remaining distance to the goal.",
            content_2: "By using a heuristic function, A* reduces unnecessary exploration, often making it faster than Dijkstra's algorithm, especially for large grids or complex maps."
        },
        {
            title: "1. Initialization",
            content_1: "The A* algorithm begins by assigning a distance (g score) of 0 to the source node and infinity to all other nodes.",
            image: "/images/search_start.png",
            content_2: "A priority queue is used to track which node to visit next, but unlike Dijkstra's algorithm, A* prioritizes nodes based on both their current distance from the start (g) and an estimated heuristic cost (h) to the target.",
            image_2: "/images/astar_pq_blank.png"
        },
        {
            title: "2. Using the Cost Function",
            content_1: "Each node is assigned a total estimated cost f(n) = g(n) + h(n), where: \n•   g(n) is the known cost from the start to the current node.\n•   h(n) is the heuristic estimate of the cost from the current node to the target.",
            image: "/images/astar_cost_function.gif",
            content_2: "This heuristic helps A* focus on paths leading toward the goal, rather than exploring all possible routes equally.",
        },
        {
            title: "3. Selecting the Best Node to Expand",
            content_1: "The algorithm selects the unvisited node with the lowest total cost f(n) from the priority queue.",
            image: "/images/astar_pq.gif",
            content_2: "This ensures it expands paths that are likely to reach the target efficiently.",
        },
        {
            title: "4. Updating Neighboring Nodes",
            content_1: "For each selected node, the algorithm examines its neighboring nodes. If a shorter path to a neighbor is found, it updates that node's g(n) cost and recalculates its total f(n) value.",
            image: "/images/astar_neighbor.gif",
            content_2: "The updated neighbor is then added to the priority queue for further exploration.",
        },
        {
            title: "5. Marking Nodes as Visited",
            content_1: "Once a node has been processed, it is marked as visited. Visited nodes are not checked again.",
            image: "/images/astar_set_visited.gif",
            content_2: "The algorithm then moves to the next closest unvisited node.",
        },
        {
            title: "6. Repeating Until the Target is Reached",
            content_1: "This process continues until the target node is reached or all reachable nodes have been visited.",
            image: "/images/astar_sim.gif",
            content_2: "If the target is unreachable, the algorithm determines that no valid path exists.",
        },
        {
            title: "7. Handling Weights and Obstacles",
            content_1: "If paths have different weights (such as varying travel times or costs), A* incorporates these into the cost function, ensuring that higher-cost routes are avoided when possible.",
            image: "/images/astar_weight.png",
            content_2: "If there are uncrossable obstacles (e.g. walls), they are either ignored or treated as having an infinite cost, preventing them from being included in the path.",
            image_2: "/images/astar_wall.png",
        },
        {
            title: "8. Reconstructing the Shortest Path",
            content_1: "Once the shortest path to the target is determined, it is reconstructed by tracing backward from the target to the source using the recorded shortest distances.",
            image: "/images/astar_final_path.gif",
            content_2: "This ensures an optimal and efficient route, guided by both actual travel costs and estimated distance to the goal.",
        }
    ]
};

const TutorialPopup = () => {
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

    const closePopup = () => {
        setIsVisible(false);
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
                    
                    <img 
                     style={{ display: `${"image" in content[activeTab][currentSlide] ? "flex" : "none"}`}}
                     src={`${content[activeTab][currentSlide].image}`} alt="tab-content-img">
                    </img>
                    
                    <p style={{ visibility: `${"content_2" in content[activeTab][currentSlide] ? "visible" : "hidden"}`, whiteSpace: "pre-line" }}>
                        {`${content[activeTab][currentSlide].content_2}`}
                    </p>
                    
                    <img 
                    style={{ display: `${"image_2" in content[activeTab][currentSlide] ? "flex" : "none"}`}}
                    src={`${content[activeTab][currentSlide].image_2}`} alt="tab-content-img-2">
                    </img>
                    
                </div>

                <div className="navigation-buttons" id="navigation-buttons">
                    <button onClick={prevSlide}><ArrowLeft size={20} /></button>
                    <button onClick={nextSlide}><ArrowRight size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default TutorialPopup;
