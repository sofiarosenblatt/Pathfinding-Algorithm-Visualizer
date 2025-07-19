import heapq

class PriorityQueue(object):
    """
    A queue structure where each element is served in order of priority.
    Higher priority elements are popped before lower priority elements.  
    If two elements have the same priority, they pop in the order they were added to the queue.

    Attributes:
        queue (list): List of tuples (priority, counter, node) in the priority queue.
        counter (int): Counter to maintain insertion order for nodes with equal priority.
    """

    def __init__(self):
        """
        Initialize a new Priority Queue.
        """
        self.queue = []
        self.counter = 0

    def __iter__(self):
        """
        Return an iterator over the queue, sorted by priority and insertion order.

        Returns:
            iterator: An iterator over the sorted queue elements.
        """
        return iter(sorted(self.queue))

    def __str__(self):
        """
        Return a string representation of the queue.

        Returns:
            str: String representation of the queue.
        """
        return f"{self.queue}"
    
    def pop(self):
        """
        Remove and return the node with the highest priority (lowest f value).
        If multiple nodes have the same priority, the one inserted first is returned.

        Returns:
            Node: The node with the highest priority.

        Raises:
            KeyError: If the priority queue is empty.
        """
        while self.queue:
            heapq.heapify(self.queue)
            _, _, node = heapq.heappop(self.queue)
            return node
        raise KeyError('This priority queue is empty')

    def insert(self, node):
        """
        Insert a node into the priority queue.

        Args:
            node (Node): The node to insert. Its priority is determined by its f value.
        """
        self.queue.append((node.f, self.counter, node))
        self.counter += 1

    def update_priority(self, node, new_priority):
        """
        Update the priority (f value) of a specific node in the queue.

        Args:
            node (Node): The node whose priority should be updated.
            new_priority (float): The new priority value (f value) for the node.
        """
        self.queue = [(new_priority, x[1], node) if x[2] == node else x for x in self.queue]

    def __contains__(self, node):
        """
        Check if a node is present in the priority queue.

        Args:
            node (Node): The node to check for.

        Returns:
            bool: True if the node is in the queue, False otherwise.
        """
        return node in [n[-1] for n in self.queue]

    def __eq__(self, other):
        """
        Check if this priority queue is equal to another.

        Args:
            other (PriorityQueue): The other priority queue to compare with.

        Returns:
            bool: True if both queues are equal, False otherwise.
        """
        return self.queue == other.queue

    def __len__(self):
        """
        Return the number of nodes in the priority queue.

        Returns:
            int: The number of nodes in the queue.
        """
        return len(self.queue)

    def clear(self):
        """
        Remove all nodes from the priority queue.
        """
        self.queue = []