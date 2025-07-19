from priority_queue import PriorityQueue
import math


def a_star(grid, source, target, moves_diagonally=False):
    """
    Perform the A* pathfinding algorithm to find the shortest path from source to target on a grid.

    Args:
        grid (Grid): The grid to search through.
        source (Node): The starting node.
        target (Node): The goal node.
        moves_diagonally (bool, optional): Whether diagonal movement is allowed. Defaults to False.

    Returns:
        tuple: A tuple containing:
            - visited_ordered (list): List of nodes visited in the order they were explored.
            - path (list): List of nodes representing the shortest path from source to target (inclusive).
            - path_length (float): The total length of the shortest path.
            - path_cost (float): The total cost of the shortest path.

    Notes:
        - If the source and target are the same node, returns an empty list.
        - If no path is found, returns (visited_ordered, [], 0, 0).
    """
    path_length = 0
    path_cost = 0
    if source == target:
        return []
    else:
        frontier = PriorityQueue()
        visited = set([])
        visited_ordered = []  # Only for display purposes

        # process starting node
        source.set_g(0)
        source.set_h(euclidean_dist_heuristic(source, target))
        source.set_f(source.h)
        frontier.insert(source)

        while len(frontier) > 0:
            node = frontier.pop()  # pop node with lowest f score
            
            if node not in visited:
                visited.add(node)
                visited_ordered.append(node)
                
                if node == target:  # if goal node is reached, stop
                    path = [target]
                    target.set_f(0)
                    path_cost += source.f
                    while path[-1] != source:
                        path.append(path[-1].parent)
                        if moves_diagonally:
                            path_length += grid.get_edge_weight(path[-1], path[-2])
                        else:
                            path_length += grid.get_node_weight(path[-1])
                        path_cost += path[-1].f
                    path.reverse()
                    return visited_ordered, path, path_length, path_cost
                
                neighbors = grid.get_neighbors(node)
                for neighbor in neighbors:
                    if neighbor not in visited:  # iterate through unexplored neighbors
                        if moves_diagonally:
                            neighbor_g = grid.get_edge_weight(node, neighbor) + node.g
                        else:
                            neighbor_g = grid.get_node_weight(neighbor) + node.g
                        neighbor_h = euclidean_dist_heuristic(neighbor, target)
                        neighbor_f = neighbor_g + neighbor_h

                        if neighbor in frontier:
                            if neighbor_g < neighbor.g:  # check if g score improved
                                neighbor.set_parent(node)
                                neighbor.set_g(neighbor_g)
                                neighbor.set_h(neighbor_h)
                                neighbor.set_f(neighbor_f)
                                frontier.update_priority(neighbor, neighbor_f) # replace node's f score with lower one
                        else:
                            neighbor.set_parent(node)
                            neighbor.set_g(neighbor_g)
                            neighbor.set_h(neighbor_h)
                            neighbor.set_f(neighbor_f)
                            frontier.insert(neighbor)
        # No path found
        return visited_ordered, [], 0, 0

def dijkstra(grid, source, target, moves_diagonally=False): 
    """
    Perform Dijkstra's algorithm to find the shortest path from source to target on a grid.

    Args:
        grid (Grid): The grid to search through.
        source (Node): The starting node.
        target (Node): The goal node.
        moves_diagonally (bool, optional): Whether diagonal movement is allowed. Defaults to False.

    Returns:
        tuple: A tuple containing:
            - visited_ordered (list): List of nodes visited in the order they were explored.
            - path (list): List of nodes representing the shortest path from source to target (inclusive).
            - path_cost (float): The total cost of the shortest path.
            - path_length (float): The total length of the shortest path.

    Notes:
        - If the source and target are the same node, returns an empty list.
        - If no path is found, returns (visited_ordered, [], 0, 0).
    """
    path_cost = 0
    path_length = 0
    if source == target:
        return []
    else:
        frontier = PriorityQueue()
        visited = set([])
        visited_ordered = []  # Only for display purposes

        # process starting node
        source.set_f(0)
        frontier.insert(source)

        while len(frontier) > 0:
            node = frontier.pop()  # pop node with lowest f score
            if node not in visited:
                visited.add(node)
                visited_ordered.append(node)
                
                if node == target:  # if goal node is reached, stop
                    path = [target]
                    target.set_f(0)
                    while path[-1] != source:
                        path.append(path[-1].parent)
                        if moves_diagonally:
                            edge_weight = grid.get_edge_weight(path[-1], path[-2])
                            path_cost += edge_weight
                            if edge_weight % 1 == 0:
                                path_length += 1
                            else:
                                path_length += math.sqrt(2)
                        else:
                            path_cost += grid.get_node_weight(path[-1])
                            path_length += 1
                    path.reverse()
                    return visited_ordered, path, path_cost, path_length
                
                neighbors = grid.get_neighbors(node)
                for neighbor in neighbors:
                    if neighbor not in visited:  # iterate through unexplored neighbors
                        if moves_diagonally:
                            neighbor_f = grid.get_edge_weight(node, neighbor) + node.f
                        else:
                            neighbor_f = grid.get_node_weight(neighbor) + node.f
                        
                        if neighbor in frontier:
                            if neighbor_f < neighbor.f:  # check if score improved
                                neighbor.set_parent(node)
                                neighbor.set_f(neighbor_f)
                                frontier.update_priority(neighbor, neighbor_f) # replace node's score with lower one
                        else:
                            neighbor.set_parent(node)
                            neighbor.set_f(neighbor_f)
                            frontier.insert(neighbor)

        # No path found
        return visited_ordered, [], 0, 0

def euclidean_dist_heuristic(node1, node2):
    """
    Calculate the Euclidean distance between two nodes.

    Args:
        node1 (Node): The first node.
        node2 (Node): The second node.

    Returns:
        float: The Euclidean distance between node1 and node2.
    """
    return math.sqrt(math.pow(node2.x - node1.x, 2) + math.pow(node2.y - node1.y, 2))