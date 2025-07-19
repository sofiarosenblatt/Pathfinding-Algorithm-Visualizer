from node import Node
import math

class Grid:
    def __init__(self, num_rows, num_cols, weight_cost=5, moves_diagonally=False):
        """
        Initialize a Grid object representing a 2D grid of nodes.

        Args:
            num_rows (int): Number of rows in the grid.
            num_cols (int): Number of columns in the grid.
            weight_cost (float, optional): The cost to traverse a weighted node. Defaults to 5.
            moves_diagonally (bool, optional): Whether diagonal movement is allowed. Defaults to False.

        Attributes:
            num_rows (int): Number of rows in the grid.
            num_cols (int): Number of columns in the grid.
            weight_cost (float): The cost to traverse a weighted node.
            moves_diagonally (bool): Whether diagonal movement is allowed.
            grid (dict): Nested dictionary storing Node objects, accessed as grid[x][y].
        """
        self.num_rows = num_rows
        self.num_cols = num_cols
        self.weight_cost = weight_cost
        self.moves_diagonally = moves_diagonally
        self.grid = {}

        for x in range(num_rows):
            self.grid[x] = {}
            for y in range(num_cols):
                self.grid[x][y] = Node(x, y)
    
    def __getitem__(self, coor):
        """
        Retrieve a Node object at the specified coordinates.

        Args:
            coor (tuple): A tuple (x, y) representing the coordinates of the node.

        Returns:
            Node: The Node object at the specified coordinates.
        """
        return self.grid[coor[0]][coor[1]]

    def is_valid(self, x, y):
        """
        Check if the given coordinates are within the bounds of the grid.

        Args:
            x (int): Row index.
            y (int): Column index.

        Returns:
            bool: True if (x, y) is within the grid bounds, False otherwise.
        """
        return x >= 0 and y >= 0 and x < self.num_rows and y < self.num_cols
    
    def get_node_weight(self, node):
        """
        Get the traversal cost for a given node.

        Args:
            node (Node): The node for which to get the weight.

        Returns:
            float: The cost to traverse the node (weight_cost if weighted, otherwise 1).
        """
        if self.grid[node.x][node.y].is_weighted():
            return self.weight_cost
        return 1
    
    def get_edge_weight(self, node1, node2):
        """
        Calculate the cost to move from node1 to node2, considering weights and diagonal movement.

        Args:
            node1 (Node): The starting node.
            node2 (Node): The destination node.

        Returns:
            float: The cost to move from node1 to node2. Diagonal moves cost sqrt(2) times the node weight.
        """
        x_diff = abs(node1.x - node2.x)
        y_diff = abs(node1.y - node2.y)
        weight = 1
        if self.grid[node2.x][node2.y].is_weighted():
            weight = self.weight_cost
        if x_diff + y_diff == 2:
            return math.sqrt(2) * weight
        else:
            return 1 * weight
    
    def get_neighbors(self, node):
        """
        Get all valid, non-blocked neighboring nodes of a given node.

        Args:
            node (Node): The node for which to find neighbors.

        Returns:
            list: A list of neighboring Node objects that are within bounds and not blocked.
                  Includes diagonal neighbors if moves_diagonally is True.
        """
        neighbors = []
        # Left
        if self.is_valid(node.x - 1, node.y) and not self.grid[node.x - 1][node.y].is_blocked(): 
            neighbors.append(self.grid[node.x - 1][node.y])
        # Right
        if self.is_valid(node.x + 1, node.y) and not self.grid[node.x + 1][node.y].is_blocked(): 
            neighbors.append(self.grid[node.x + 1][node.y])
        # Up
        if self.is_valid(node.x, node.y - 1) and not self.grid[node.x][node.y - 1].is_blocked(): 
            neighbors.append(self.grid[node.x][node.y - 1])
        # Down
        if self.is_valid(node.x, node.y + 1) and not self.grid[node.x][node.y + 1].is_blocked(): 
            neighbors.append(self.grid[node.x][node.y + 1])
        
        if self.moves_diagonally:
            # Up left
            if self.is_valid(node.x - 1, node.y - 1) and not self.grid[node.x - 1][node.y - 1].is_blocked(): 
                neighbors.append(self.grid[node.x - 1][node.y - 1])
            # Up right
            if self.is_valid(node.x + 1, node.y - 1) and not self.grid[node.x + 1][node.y - 1].is_blocked(): 
                neighbors.append(self.grid[node.x + 1][node.y - 1])
            # Down left
            if self.is_valid(node.x - 1, node.y + 1) and not self.grid[node.x - 1][node.y + 1].is_blocked(): 
                neighbors.append(self.grid[node.x - 1][node.y + 1])
            # Down right
            if self.is_valid(node.x + 1, node.y + 1) and not self.grid[node.x + 1][node.y + 1].is_blocked(): 
                neighbors.append(self.grid[node.x + 1][node.y + 1])
        return neighbors