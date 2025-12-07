//how grid looks like
const ROWS = 20;
const COLS = 50;
const START_ROW = 10;
const START_COL = 5;
const TARGET_ROW = 10;
const TARGET_COL = 45;

let grid = []; // The logical grid (2D array)
let isMouseDown = false;

// --- INITIALIZATION ---
function initializeGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = ''; // Clear existing
    grid = [];

    for (let r = 0; r < ROWS; r++) {
        const rowArray = [];
        for (let c = 0; c < COLS; c++) {
            // Create HTML Element
            const nodeElement = document.createElement('div');
            nodeElement.id = `node-${r}-${c}`;
            nodeElement.className = 'node';
            
            // Set Start/Target CSS
            if (r === START_ROW && c === START_COL) {
                nodeElement.classList.add('node-start');
            } else if (r === TARGET_ROW && c === TARGET_COL) {
                nodeElement.classList.add('node-target');
            }

            // Add Mouse Listeners for Walls
            nodeElement.addEventListener('mousedown', () => handleMouseDown(r, c));
            nodeElement.addEventListener('mouseenter', () => handleMouseEnter(r, c));
            nodeElement.addEventListener('mouseup', handleMouseUp);

            gridContainer.appendChild(nodeElement);

            // Create Logical Node Object
            const node = {
                row: r,
                col: c,
                isStart: r === START_ROW && c === START_COL,
                isTarget: r === TARGET_ROW && c === TARGET_COL,
                isWall: false,
                isVisited: false,
                previousNode: null // Crucial for backtracking path
            };
            rowArray.push(node);
        }
        grid.push(rowArray);
    }
}

// --- MOUSE INTERACTION (DRAWING WALLS) ---
function handleMouseDown(row, col) {
    isMouseDown = true;
    toggleWall(grid[row][col]);
}

function handleMouseEnter(row, col) {
    if (!isMouseDown) return;
    toggleWall(grid[row][col]);
}

function handleMouseUp() {
    isMouseDown = false;
}

function toggleWall(node) {
    // Don't build walls on start or target
    if (node.isStart || node.isTarget) return;

    node.isWall = !node.isWall;
    const element = document.getElementById(`node-${node.row}-${node.col}`);
    
    if (node.isWall) {
        element.classList.add('node-wall');
    } else {
        element.classList.remove('node-wall');
    }
}

// --- ALGORITHM: BREADTH-FIRST SEARCH (BFS) ---
function visualizeAlgorithm() {
    const startNode = grid[START_ROW][START_COL];
    const targetNode = grid[TARGET_ROW][TARGET_COL];
    
    const visitedNodesInOrder = bfs(startNode, targetNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(targetNode);

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
}

function bfs(startNode, targetNode) {
    const visitedNodesInOrder = [];
    // Queue for BFS
    const queue = [startNode];
    startNode.isVisited = true;

    while (queue.length) {
        const currentNode = queue.shift();
        
        // Skip walls
        if (currentNode.isWall) continue;

        visitedNodesInOrder.push(currentNode);

        if (currentNode === targetNode) return visitedNodesInOrder;

        const neighbors = getUnvisitedNeighbors(currentNode);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode; // Store how we got here
            queue.push(neighbor);
        }
    }
    return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;
    
    // Check Up, Down, Left, Right
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < COLS - 1) neighbors.push(grid[row][col + 1]);

    // Return only unvisited neighbors
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

// --- BACKTRACKING THE PATH ---
function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    
    // Trace back from finish to start using 'previousNode'
    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

// --- ANIMATION ---
function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        // When we finish animating visited nodes, animate the shortest path
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
        }

        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            // Don't color Start or Target nodes (keep them Green/Red)
            if(!node.isStart && !node.isTarget) {
                 document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-visited');
            }
        }, 10 * i);
    }
}

function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            if(!node.isStart && !node.isTarget) {
                document.getElementById(`node-${node.row}-${node.col}`).classList.add('node-path');
            }
        }, 50 * i);
    }
}

// Start the app
initializeGrid();