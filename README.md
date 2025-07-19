# Pathfinding Algorithm Visualizer

## Overview

Pathfinding Algorithm Visualizer is a full-stack web application for interactively exploring and comparing the A\* and Dijkstra pathfinding algorithms on a customizable grid. The backend is implemented in Python (Flask). The frontend, a Vite + React application, interacts with the backend via RESTful API endpoints to display algorithm progress. Users can set up grid scenarios, run algorithms, and watch the search process and results animated in real time.

---
## Features

- **Visualize A\* and Dijkstra's algorithms** step-by-step on a grid.
- **Customizable grid size** (row/column length responsive to window size).
- **Set source and target nodes** interactively.
- **Add walls and weighted nodes** to simulate obstacles and variable terrain.
- **Toggle diagonal movement** (4-way or 8-way) for more realistic pathfinding.
- **Adjustable animation speed** and weight cost.
- **Real-time feedback**: See visited nodes, path, path cost, and path length as the algorithm runs.
- **Replay, edit, and reset grid** at any time.
- **In-app tutorial** and algorithm explanations.

---
## Project Structure
```text
Pathfinding-Algorithm-Visualizer
├── app.py
├── grid.py
├── node.py
├── priority_queue.py 
├── search_algorithms.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/ # UI components (Navbar, Grid, Header, etc.)
│   │   ├── main.jsx 
│   │   ├── App.jsx
│   │   ├── ... # Stylesheets and helpers
│   ├── index.html
│   └── ... # React/Vite configs
├── README.md
└── requirements.txt
```

---
## Backend Structure
- **`app.py`**: Flask app exposing `/astar` and `/dijkstra` endpoints for algorithm execution.
- **`grid.py`**: Grid and node management, including wall and weight handling.
- **`node.py`**: Node class representing each cell in the grid.
- **`priority_queue.py`**: Custom priority queue for efficient node selection.
- **`search_algorithms.py`**: Implementations of A* and Dijkstra's algorithms.

## API Endpoints

### `/astar` (POST)
Runs the A\* algorithm on the provided grid.

**Sample Request JSON:**
```json
{
  "num_rows": 20,
  "num_cols": 20,
  "source": [0, 0],
  "target": [19, 19],
  "walls": [[1,2], [2,2], ...],
  "weights": [[5,5], [6,5], ...],
  "weightCost": 5,
  "allowDiagonal": true
}
```
**Sample Response JSON:**
```json
{
  "visited": [[x1, y1], [x2, y2], ...],
  "path": [[x1, y1], [x2, y2], ...],
  "path_length": 27.2,
  "path_cost": 35,
  "node_costs": [f1, f2, ...]
}
```

### `/dijkstra` (POST)
Runs Dijkstra's algorithm on the provided grid.  
**Request/Response:** Same structure as `/astar`.

---
## Frontend Structure

- **`App.jsx`**: Main application logic, manages global state and API interactions.
- **`Navbar.jsx`**: Tool and algorithm selection, speed and weight controls, toggles for diagonal movement, and search results display (nodes explored, path cost/length).
- **`Grid.jsx`**: Renders the interactive grid, handles user input for setting source/target, walls, weights, and triggers algorithm runs.
- **`TutorialPopup.jsx`**: In-app tutorial with step-by-step GIFs and explanations for both algorithms and UI usage.
- **`Header.jsx`**: App title and help button.

---
## Styling
- Uses CSS modules for each component (e.g., `Grid.css`, `Navbar.css`).
- Responsive design for desktop and mobile.
- Theming via CSS variables in `index.css` and `App.css`.

---
## Assets
- All icons and tutorial GIFs are in `frontend/public/images/`.
- Favicon and logos are in `frontend/public/`.

---
## Running Locally
1. **Clone the repository:**
```sh
git clone https://github.com/yourusername/Pathfinding-Algorithm-Visualizer.git
cd Pathfinding-Algorithm-Visualizer
```
2. **Install dependencies:**
```sh
pip install requirements.txt
```
3. **Run the backend server:**
```sh
flask run --debug
```
By default, the Flask app wil run at http://127.0.0.1:5000 when using the --debug option.

4. **Install frontend dependencies and run:**
```sh
cd frontend
npm install
npm run dev
```
By default, Vite + React app runs at http://localhost:5173.
