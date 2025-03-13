from node import Node
import math

class Grid:
    def __init__(self, num_rows, num_cols, weight_cost=5, moves_diagonally=False):
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
        return self.grid[coor[0]][coor[1]]

    def is_valid(self, x, y):
        return x >= 0 and y >= 0 and x < self.num_rows and y < self.num_cols
    
    def get_node_weight(self, node):
        if self.grid[node.x][node.y].is_weighted():
            return self.weight_cost
        return 1
    
    def get_edge_weight(self, node1, node2):
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