
class Node:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.coor = tuple([x, y])

        self.parent = None
        self.g = float('inf')  # Cost from source to this node
        self.h = 0  # Total cost (g + h)
        self.f = float('inf')  # Heuristic cost from node to destination
        self.blocked = False
        self.weighted = False

    def __eq__(self, other):
        if not isinstance(other, Node):
            return False
        return self.coor == other.coor
    
    def __hash__(self):
        return hash(self.coor)
    
    def __str__(self):
        return f"{self.coor}"
    
    def set_parent(self, parent):
        self.parent = parent
    
    def set_g(self, val):
        self.g = val

    def set_h(self, val):
        self.h = val

    def set_f(self, val):
        self.f = val

    def block(self):
        self.blocked = True

    def unblock(self):
        self.blocked = False

    def is_blocked(self):
        return self.blocked

    def add_weight(self):
        self.weighted = True

    def remove_weight(self):
        self.weighted = False

    def is_weighted(self):
        return self.weighted