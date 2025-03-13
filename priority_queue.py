import heapq

class PriorityQueue(object):
    """
    A queue structure where each element is served in order of priority.
    Higher priority elements are popped before lower priority elements.  
    If two elements have the same priority, they pop in the order they were added to the queue.

    Attributes:
        queue (list): List of nodes added to the priority queue.
    """

    def __init__(self):
        """
        Initialize a new Priority Queue.
        """
        self.queue = []
        self.counter = 0

    def __iter__(self):
        """
        Iterate through the sorted queue.
        """
        return iter(sorted(self.queue))

    def __str__(self):
        return f"{self.queue}"
    
    def pop(self):
        """
        Remove top priority node from queue and return it.
        """
        while self.queue:
            heapq.heapify(self.queue)
            _, _, node = heapq.heappop(self.queue)
            return node
        raise KeyError('This priority queue is empty')

    def insert(self, node):
        """
        Insert node to the queue.
        """
        self.queue.append((node.f, self.counter, node))
        self.counter += 1

    def update_priority(self, node, new_priority):
        """
        Update a single node's priority in the queue
        """
        self.queue = [(new_priority, x[1], node) if x[2] == node else x for x in self.queue]

    def __contains__(self, node):
        return node in [n[-1] for n in self.queue]

    def __eq__(self, other):
        return self.queue == other.queue

    def __len__(self):
        return len(self.queue)

    def clear(self):
        """
        Empty out queue.
        """
        self.queue = []