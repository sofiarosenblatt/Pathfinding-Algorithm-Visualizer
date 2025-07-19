
class Node:
    def __init__(self, x, y):
        """
        Initialize a Node object representing a cell in the grid.

        Args:
            x (int): The row index of the node.
            y (int): The column index of the node.

        Attributes:
            x (int): Row index.
            y (int): Column index.
            coor (tuple): Tuple of (x, y) coordinates.
            parent (Node or None): Parent node in the path.
            g (float): Cost from source to this node.
            h (float): Heuristic cost from this node to the destination.
            f (float): Total cost (g + h).
            blocked (bool): Whether the node is blocked (wall).
            weighted (bool): Whether the node is weighted.
        """
        self.x = x
        self.y = y
        self.coor = tuple([x, y])

        self.parent = None
        self.g = float('inf')
        self.h = 0
        self.f = float('inf')
        self.blocked = False
        self.weighted = False

    def __eq__(self, other):
        """
        Check if this node is equal to another node based on coordinates.

        Args:
            other (Node): The node to compare with.

        Returns:
            bool: True if coordinates are equal, False otherwise.
        """
        if not isinstance(other, Node):
            return False
        return self.coor == other.coor
    
    def __hash__(self):
        """
        Compute the hash value of the node based on its coordinates.

        Returns:
            int: Hash value of the node.
        """
        return hash(self.coor)
    
    def __str__(self):
        """
        Return a string representation of the node's coordinates.

        Returns:
            str: String in the form "(x, y)".
        """
        return f"{self.coor}"
    
    def set_parent(self, parent):
        """
        Set the parent node for path reconstruction.

        Args:
            parent (Node): The parent node.
        """
        self.parent = parent
    
    def set_g(self, val):
        """
        Set this node's g cost (distance from source).

        Args:
            val (float): The g cost value.
        """
        self.g = val

    def set_h(self, val):
        """
        Set this node's h cost (heuristic to destination).

        Args:
            val (float): The h cost value.
        """
        self.h = val

    def set_f(self, val):
        """
        Set this node's f cost (total cost).

        Args:
            val (float): The f cost value.
        """
        self.f = val

    def block(self):
        """
        Mark this node as blocked (wall).
        """
        self.blocked = True

    def unblock(self):
        """
        Mark this node as unblocked (not a wall).
        """
        self.blocked = False

    def is_blocked(self):
        """
        Check if this node is blocked (i.e., is a wall).

        Returns:
            bool: True if the node is blocked, False otherwise.
        """
        return self.blocked

    def add_weight(self):
        """
        Mark this node as weighted.
        """
        self.weighted = True

    def remove_weight(self):
        """
        Remove the weighted status from this node.
        """
        self.weighted = False

    def is_weighted(self):
        """
        Check if this node is weighted.

        Returns:
            bool: True if the node is weighted, False otherwise.
        """
        return self.weighted