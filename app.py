from flask import Flask, jsonify, request
from flask_cors import CORS
from search_algorithms import a_star, dijkstra
from grid import Grid

app = Flask(__name__)
if app.debug:
    CORS(app, origins=["http://localhost:5173"])
else:
    CORS(app, origins=["https://PAV-frontend.onrender.com"])

@app.route('/astar', methods=['POST'])
def run_astar():
    """
    Run the A* pathfinding algorithm on a grid based on user-provided parameters.

    Expects a JSON payload with the following fields:
        - num_rows (int): Number of rows in the grid.
        - num_cols (int): Number of columns in the grid.
        - source (list or tuple): Coordinates [x, y] of the source node.
        - target (list or tuple): Coordinates [x, y] of the target node.
        - walls (list): List of coordinates representing wall nodes.
        - weights (list): List of coordinates representing weighted nodes.
        - weightCost (float): The cost to traverse a weighted node.
        - allowDiagonal (bool): Whether diagonal movement is allowed.

    Returns:
        JSON response containing:
            - visited (list): List of coordinates visited by the algorithm.
            - path (list): List of coordinates representing the shortest path.
            - path_length (float): The length of the shortest path.
            - path_cost (float): The total cost of the shortest path.
            - node_costs (list): List of f-costs for each visited node.

    Returns HTTP 400 if required parameters are missing, or HTTP 500 on error.
    """
    try:
        # Parse JSON request
        data = request.json
        num_rows = data.get('num_rows')
        num_cols = data.get('num_cols')
        source_pos = tuple(data.get('source'))
        target_pos = tuple(data.get('target'))
        walls = data.get('walls')
        weights = data.get('weights')
        weight_cost = data.get('weightCost')
        allow_diagonal = data.get('allowDiagonal')

        # Validate input
        if not num_rows or not num_cols or not source_pos or not target_pos:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Initialize the grid
        grid = Grid(num_rows, num_cols, weight_cost, moves_diagonally=allow_diagonal)

        # Set source and target nodes
        source_node = grid[source_pos]
        target_node = grid[target_pos]

        # Set walls and weights
        for wall in walls:
            grid[wall].block()

        for weight in weights:
            grid[weight].add_weight()

        # Run A* algorithm
        visited, path, path_length, path_cost = a_star(grid, source_node, target_node, moves_diagonally=allow_diagonal)

        # Convert visited/path to list of tuples
        visited_coordinates = [(node.x, node.y) for node in visited]
        path_coordinates = [(node.x, node.y) for node in path]
        node_costs = [node.f for node in visited]

        return jsonify({'visited': visited_coordinates, 'path': path_coordinates, 'path_length': path_length, 'path_cost': path_cost, 'node_costs': node_costs})

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/dijkstra', methods=['POST'])
def run_dijkstra():
    """
    Run Dijkstra's pathfinding algorithm on a grid based on user-provided parameters.

    Expects a JSON payload with the following fields:
        - num_rows (int): Number of rows in the grid.
        - num_cols (int): Number of columns in the grid.
        - source (list or tuple): Coordinates [x, y] of the source node.
        - target (list or tuple): Coordinates [x, y] of the target node.
        - walls (list): List of coordinates representing wall nodes.
        - weights (list): List of coordinates representing weighted nodes.
        - weightCost (float): The cost to traverse a weighted node.
        - allowDiagonal (bool, optional): Whether diagonal movement is allowed (default: False).

    Returns:
        JSON response containing:
            - visited (list): List of coordinates visited by the algorithm.
            - path (list): List of coordinates representing the shortest path.
            - path_cost (float): The total cost of the shortest path.
            - path_length (float): The length of the shortest path.
            - node_costs (list): List of costs for each visited node.

    Returns HTTP 400 if required parameters are missing, or HTTP 500 on error.
    """
    try:
        # Parse JSON request
        data = request.json
        num_rows = data.get('num_rows')
        num_cols = data.get('num_cols')
        source_pos = tuple(data.get('source'))
        target_pos = tuple(data.get('target'))
        walls = data.get('walls')
        weights = data.get('weights')
        weight_cost = data.get('weightCost')
        allow_diagonal = data.get('allowDiagonal', False)

        # Validate input
        if not num_rows or not num_cols or not source_pos or not target_pos:
            return jsonify({'error': 'Missing required parameters'}), 400

        # Initialize the grid
        grid = Grid(num_rows, num_cols, weight_cost, moves_diagonally=allow_diagonal)

        # Set source and target nodes
        source_node = grid[source_pos]
        target_node = grid[target_pos]

        # Set walls and weights
        for wall in walls:
            grid[wall].block()

        for weight in weights:
            grid[weight].add_weight()

        # Run Dijkstra's algorithm
        visited, path, path_cost, path_length = dijkstra(grid, source_node, target_node, moves_diagonally=allow_diagonal)

        # Convert visited/path to list of tuples
        visited_coordinates = [(node.x, node.y) for node in visited]
        path_coordinates = [(node.x, node.y) for node in path]
        node_costs = [node.f for node in visited]

        return jsonify({'visited': visited_coordinates, 'path': path_coordinates, 'path_cost': float(path_cost), 'path_length': float(path_length), 'node_costs': node_costs})

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

