import AudioManager from './AudioManager.js';
const audioManager = new AudioManager();

// Mobile elements
const boardElement = document.getElementById('board');
const blackScoreElement = document.getElementById('black-score');
const whiteScoreElement = document.getElementById('white-score');
const blackPlayerArea = document.getElementById('black-player-area');
const whitePlayerArea = document.getElementById('white-player-area');
const messageBoxElement = document.getElementById('message-box');
const newGameBtn = document.getElementById('new-game-btn');
const resetBtn = document.getElementById('reset-btn');
const showHintsCheckbox = document.getElementById('show-hints-checkbox');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const soundToggleBtn = document.getElementById('sound-toggle-btn');
const soundIcon = document.getElementById('sound-icon');
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle-btn');
const fullscreenIcon = document.getElementById('fullscreen-icon');

// Desktop elements
const boardElementDesktop = document.getElementById('board-desktop');
const blackScoreElementDesktop = document.getElementById('black-score-desktop');
const whiteScoreElementDesktop = document.getElementById('white-score-desktop');
const blackPlayerAreaDesktop = document.getElementById('black-player-area-desktop');
const whitePlayerAreaDesktop = document.getElementById('white-player-area-desktop');
const messageBoxElementDesktop = document.getElementById('message-box-desktop');
const newGameBtnDesktop = document.getElementById('new-game-btn-desktop');
const resetBtnDesktop = document.getElementById('reset-btn-desktop');
const showHintsCheckboxDesktop = document.getElementById('show-hints-checkbox-desktop');
const undoBtnDesktop = document.getElementById('undo-btn-desktop');
const redoBtnDesktop = document.getElementById('redo-btn-desktop');
const soundToggleBtnDesktop = document.getElementById('sound-toggle-btn-desktop');
const soundIconDesktop = document.getElementById('sound-icon-desktop');

// No moves popup elements
const noMovesPopup = document.getElementById('no-moves-popup');
const popupOkBtn = document.getElementById('popup-ok-btn');
const popupTitleTop = document.getElementById('popup-title-top');
const popupTitleBottom = document.getElementById('popup-title-bottom');
const popupPlayerPieceTop = document.getElementById('popup-player-piece-top');
const popupPlayerPieceBottom = document.getElementById('popup-player-piece-bottom');

// Detect if we're in desktop mode
function isDesktopMode() {
    return window.innerWidth >= 1024;
}

// Get current elements based on screen size
function getCurrentElements() {
    const desktop = isDesktopMode();
    return {
        board: desktop ? boardElementDesktop : boardElement,
        blackScore: desktop ? blackScoreElementDesktop : blackScoreElement,
        whiteScore: desktop ? whiteScoreElementDesktop : whiteScoreElement,
        blackPlayerArea: desktop ? blackPlayerAreaDesktop : blackPlayerArea,
        whitePlayerArea: desktop ? whitePlayerAreaDesktop : whitePlayerArea,
        messageBox: desktop ? messageBoxElementDesktop : messageBoxElement,
        showHintsCheckbox: desktop ? showHintsCheckboxDesktop : showHintsCheckbox,
        undoBtn: desktop ? undoBtnDesktop : undoBtn,
        redoBtn: desktop ? redoBtnDesktop : redoBtn,
        soundToggleBtn: desktop ? soundToggleBtnDesktop : soundToggleBtn,
        soundIcon: desktop ? soundIconDesktop : soundIcon
    };
}

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let board = [];
let currentPlayer;
let showHints = true;
let gameHistory = []; // Store history of moves

let currentHistoryIndex = -1; // Track current position in history (-1 means no moves)

let noMovesPopupShown = false; // Track if popup is already shown for current turn


// Load sound preference from localStorage
function loadSoundPreference() {
    audioManager.loadSoundPreference();
}

// Save sound preference to localStorage
function saveSoundPreference() {
    audioManager.saveSoundPreference();
}

// Update sound icon based on current state
function updateSoundIcon() {
    const elements = getCurrentElements();
    const soundEnabled = audioManager.soundEnabled;
    const icon = soundEnabled ? '🔊' : '🔇';
    const title = soundEnabled ? 'Disable Sound' : 'Enable Sound';
    if (elements.soundIcon) {
        elements.soundIcon.textContent = icon;
        elements.soundIcon.title = title;
    }
}

// Toggle sound on/off
function toggleSound() {
    audioManager.toggleSound();
    updateSoundIcon();
}

// Fullscreen functionality
function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || 
                document.mozFullScreenElement || document.msFullscreenElement);
}

function toggleFullscreen() {
    if (isFullscreen()) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Play placement sound
function playPlacementSound() {
    audioManager.playPlacementSound();
}

// Play reverse sound for undo
function playUndoSound() {
    audioManager.playUndoSound();
}

function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function updateFullscreenIcon() {
    const icon = isFullscreen() ? '🔳' : '📱';
    const title = isFullscreen() ? 'Exit Fullscreen' : 'Enter Fullscreen';
    
    if (fullscreenIcon) {
        fullscreenIcon.textContent = icon;
    }
    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.title = title;
    }
}

// Listen for fullscreen changes to update the icon
function handleFullscreenChange() {
    updateFullscreenIcon();
}

// Save game state to localStorage
function saveGameState() {
    const gameState = {
        board: board.map(row => [...row]), // Deep copy
        currentPlayer: currentPlayer,
        gameHistory: [...gameHistory], // Deep copy
        currentHistoryIndex: currentHistoryIndex,
        showHints: showHints, // Save hints preference
        noMovesPopupShown: noMovesPopupShown, // Save popup state
        timestamp: Date.now()
    };
    localStorage.setItem('othello-game-state', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGameState() {
    try {
        const savedState = localStorage.getItem('othello-game-state');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            board = gameState.board || [];
            currentPlayer = gameState.currentPlayer || BLACK;
            gameHistory = gameState.gameHistory || [];
            currentHistoryIndex = gameState.currentHistoryIndex !== undefined ? gameState.currentHistoryIndex : -1;
            showHints = gameState.showHints !== undefined ? gameState.showHints : true; // Load hints preference with fallback
            noMovesPopupShown = gameState.noMovesPopupShown || false; // Load popup state with fallback
            return true;
        }
    } catch (e) {
        console.warn('Failed to load game state:', e);
    }
    return false;
}

// Clear saved game state
function clearSavedGameState() {
    localStorage.removeItem('othello-game-state');
}

// Update undo/redo button states
function updateUndoRedoButtons() {
    const canUndo = currentHistoryIndex >= 0;
    const canRedo = currentHistoryIndex < gameHistory.length - 1;
    
    // Update mobile buttons
    if (undoBtn) undoBtn.disabled = !canUndo;
    if (redoBtn) redoBtn.disabled = !canRedo;
    
    // Update desktop buttons
    if (undoBtnDesktop) undoBtnDesktop.disabled = !canUndo;
    if (redoBtnDesktop) redoBtnDesktop.disabled = !canRedo;
}

// Undo last move
async function undoMove() {
    if (currentHistoryIndex < 0) return;
    
    console.log('Undoing move at index:', currentHistoryIndex);
    const moveToUndo = gameHistory[currentHistoryIndex];
    const elements = getCurrentElements();
    
    // Disable board during animation
    elements.board.style.pointerEvents = 'none';
    
    // Restore board state before the move
    board = moveToUndo.boardBefore.map(row => [...row]);
    
    // Switch to the previous player
    currentPlayer = moveToUndo.player;
    
    // Move back in history
    currentHistoryIndex--;
    
    // Reset popup flag since game state changed
    noMovesPopupShown = false;
    
    // Play undo sound
    playUndoSound();
    
    // Update display with fast animation
    await renderBoardFastAnimated();
    updateUndoRedoButtons();
    saveGameState();
    
    // Re-enable board after animation
    elements.board.style.pointerEvents = 'auto';
}

// Redo next move
async function redoMove() {
    if (currentHistoryIndex >= gameHistory.length - 1) return;
    
    const elements = getCurrentElements();
    
    // Disable board during animation
    elements.board.style.pointerEvents = 'none';
    
    // Move forward in history
    currentHistoryIndex++;
    const moveToRedo = gameHistory[currentHistoryIndex];
    console.log('Redoing move at index:', currentHistoryIndex);
    
    // Restore board state after the move
    board = moveToRedo.boardAfter.map(row => [...row]);
    
    // Switch to the next player (opposite of the move player)
    currentPlayer = moveToRedo.player === BLACK ? WHITE : BLACK;
    
    // Reset popup flag since game state changed
    noMovesPopupShown = false;
    
    // No sound for redo as per requirements
    
    // Update display with fast animation
    await renderBoardFastAnimated();
    updateUndoRedoButtons();
    saveGameState();
    
    // Re-enable board after animation
    elements.board.style.pointerEvents = 'auto';
}

// Reset game by undoing all moves quickly without animation
async function resetGame() {
    if (currentHistoryIndex < 0) return; // Nothing to reset
    
    const elements = getCurrentElements();
    
    // Disable board during reset
    elements.board.style.pointerEvents = 'none';
    
    // Undo all moves quickly one by one
    while (currentHistoryIndex >= 0) {
        const moveToUndo = gameHistory[currentHistoryIndex];
        
        // Restore board state before the move
        board = moveToUndo.boardBefore.map(row => [...row]);
        
        // Switch to the previous player
        currentPlayer = moveToUndo.player;
        
        // Move back in history
        currentHistoryIndex--;
        
        // Reset popup flag since game state changed
        noMovesPopupShown = false;
    }
    
    // Update display with fast animation for final state
    await renderBoardFastAnimated();
    updateUndoRedoButtons();
    saveGameState();
    
    // Re-enable board after reset
    elements.board.style.pointerEvents = 'auto';
}

// All 8 directions to check for valid moves
const directions = [
    { r: -1, c: -1 }, { r: -1, c: 0 }, { r: -1, c: 1 },
    { r: 0, c: -1 },                  { r: 0, c: 1 },
    { r: 1, c: -1 }, { r: 1, c: 0 }, { r: 1, c: 1 }
];

function initGame() {
    // Create an 8x8 board filled with EMPTY
    board = Array(8).fill(null).map(() => Array(8).fill(EMPTY));
    
    // Initial setup for Othello
    board[3][3] = WHITE;
    board[3][4] = BLACK;
    board[4][3] = BLACK;
    board[4][4] = WHITE;
    
    currentPlayer = BLACK;
    gameHistory = []; // Reset move history
    currentHistoryIndex = -1; // Reset history index
    noMovesPopupShown = false; // Reset popup flag
    messageBoxElement.textContent = '';
    renderBoard();
    updateUndoRedoButtons(); // Update button states
    saveGameState(); // Save initial state
}

function renderBoard() {
    const elements = getCurrentElements();
    elements.board.innerHTML = '';
    let blackScore = 0;
    let whiteScore = 0;
    const validMoves = getValidMoves(currentPlayer);

    function createCell(r, c) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;

        const pieceValue = board[r][c];
        if (pieceValue !== EMPTY) {
            addPieceToCell(cell, pieceValue);
            if (pieceValue === BLACK) blackScore++;
            else if (pieceValue === WHITE) whiteScore++;
        } else if (showHints && isValidMove(validMoves, r, c)) {
            addHintToCell(cell);
        }
        return cell;
    }

    function addPieceToCell(cell, pieceValue) {
        const piece = document.createElement('div');
        piece.className = 'piece ' + (pieceValue === BLACK ? 'black' : 'white');
        cell.appendChild(piece);
    }

    function isValidMove(validMoves, r, c) {
        return validMoves.some(move => move.r === r && move.c === c);
    }

    function addHintToCell(cell) {
        const hint = document.createElement('div');
        hint.className = 'valid-move-hint ' + (currentPlayer === BLACK ? 'bg-gray-800' : 'bg-white');
        cell.appendChild(hint);
        setTimeout(() => {
            hint.classList.add('show');
        }, 50);
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            elements.board.appendChild(createCell(r, c));
        }
    }

    updateScoresAndTurn(blackScore, whiteScore);
}

function updateScoresAndTurn(blackScore, whiteScore) {
    const elements = getCurrentElements();
    elements.blackScore.textContent = blackScore;
    elements.whiteScore.textContent = whiteScore;

    // Update for both mobile and desktop
    if (blackScoreElement) blackScoreElement.textContent = blackScore;
    if (whiteScoreElement) whiteScoreElement.textContent = whiteScore;
    if (blackScoreElementDesktop) blackScoreElementDesktop.textContent = blackScore;
    if (whiteScoreElementDesktop) whiteScoreElementDesktop.textContent = whiteScore;

    updatePlayerAreas(currentPlayer);
}

// Helper function to update player area classes
function updatePlayerAreas(player) {
    const isBlack = player === BLACK;
    const blackAreas = [blackPlayerArea, blackPlayerAreaDesktop, getCurrentElements().blackPlayerArea];
    const whiteAreas = [whitePlayerArea, whitePlayerAreaDesktop, getCurrentElements().whitePlayerArea];

    blackAreas.forEach(area => {
        if (area) area.classList.toggle('active', isBlack);
    });
    whiteAreas.forEach(area => {
        if (area) area.classList.toggle('active', !isBlack);
    });
}

async function updateBoardAnimated(newPiecePos, piecesToFlip) {
    const elements = getCurrentElements();
    // Clear all valid move hints to prevent overlap with new pieces
    const allCells = elements.board.querySelectorAll('.cell');
    allCells.forEach(cell => {
        const existingHint = cell.querySelector('.valid-move-hint');
        if (existingHint) {
            existingHint.remove();
        }
    });

    // Place the new piece without scale animation to avoid conflicts with flip animations
    const newCell = elements.board.querySelector(`[data-r="${newPiecePos.r}"][data-c="${newPiecePos.c}"]`);
    if (newCell) {
        const piece = document.createElement('div');
        piece.className = 'piece gameplay ' + (currentPlayer === BLACK ? 'black' : 'white');
        newCell.appendChild(piece);
    }

    // Animate flipping pieces
    const flipPromises = piecesToFlip.map(pos => {
        return new Promise(resolve => {
            const cell = elements.board.querySelector(`[data-r="${pos.r}"][data-c="${pos.c}"]`);
            const piece = cell?.querySelector('.piece');
            if (piece) {
                piece.classList.add('flipping');
                
                // Change color at halfway point of animation
                setTimeout(() => {
                    piece.className = 'piece flipping gameplay ' + (currentPlayer === BLACK ? 'black' : 'white');
                }, 200); // Half of flip-piece animation duration
                
                // Remove flipping class when animation completes
                setTimeout(() => {
                    piece.classList.remove('flipping');
                    resolve();
                }, 400); // Full flip-piece animation duration
            } else {
                resolve();
            }
        });
    });

    // Wait for all flip animations to complete
    await Promise.all(flipPromises);
    
    // Update scores immediately after visual update, before switching turns
    updateScoresOnly();
}

// Fast animated rendering for undo/redo operations
async function renderBoardFastAnimated() {
    const elements = getCurrentElements();
    const animationPromises = [];

    clearAllHints(elements.board);

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = elements.board.querySelector(`[data-r="${r}"][data-c="${c}"]`);
            if (!cell) continue;
            animationPromises.push(
                handleCellFastAnimation(cell, r, c)
            );
        }
    }

    await Promise.all(animationPromises);
    updateScoresAndValidMoves();
}

function clearAllHints(boardElement) {
    const allCells = boardElement.querySelectorAll('.cell');
    allCells.forEach(cell => {
        const existingHint = cell.querySelector('.valid-move-hint');
        if (existingHint) {
            existingHint.remove();
        }
    });
}

function handleCellFastAnimation(cell, r, c) {
    const existingPiece = cell.querySelector('.piece');
    const boardValue = board[r][c];

    if (boardValue === EMPTY) {
        if (existingPiece) {
            existingPiece.remove();
        }
        removeHint(cell);
        return Promise.resolve();
    } else {
        const expectedColor = boardValue === BLACK ? 'black' : 'white';
        if (!existingPiece) {
            return animateNewPiece(cell, expectedColor);
        } else {
            const currentColor = existingPiece.classList.contains('black') ? 'black' : 'white';
            if (currentColor !== expectedColor) {
                return animateFlipPiece(existingPiece, expectedColor);
            }
        }
        removeHint(cell);
        return Promise.resolve();
    }
}

function removeHint(cell) {
    const existingHint = cell.querySelector('.valid-move-hint');
    if (existingHint) existingHint.remove();
}

function animateNewPiece(cell, color) {
    return new Promise(resolve => {
        const newPiece = document.createElement('div');
        newPiece.className = `piece fast-placing ${color}`;
        cell.appendChild(newPiece);
        setTimeout(() => {
            newPiece.classList.remove('fast-placing');
            resolve();
        }, 100);
    });
}

function animateFlipPiece(piece, color) {
    return new Promise(resolve => {
        piece.classList.add('fast-flipping');
        setTimeout(() => {
            piece.className = `piece fast-flipping gameplay ${color}`;
        }, 75);
        setTimeout(() => {
            piece.classList.remove('fast-flipping');
            resolve();
        }, 150);
    });
}

function updateScoresOnly() {
    let blackScore = 0;
    let whiteScore = 0;

    // Count scores
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === BLACK) blackScore++;
            else if (board[r][c] === WHITE) whiteScore++;
        }
    }

    updateScoresAndTurn(blackScore, whiteScore);
}

function updateScoresAndValidMoves() {
    let blackScore = 0;
    let whiteScore = 0;
    const validMoves = getValidMoves(currentPlayer);
    const elements = getCurrentElements();

    // Count scores
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === BLACK) blackScore++;
            else if (board[r][c] === WHITE) whiteScore++;
        }
    }

    // Update hints for valid moves
    const allCells = elements.board.querySelectorAll('.cell');
    allCells.forEach(cell => {
        const r = parseInt(cell.dataset.r);
        const c = parseInt(cell.dataset.c);
        const existingHint = cell.querySelector('.valid-move-hint');
        
        // Remove existing hint
        if (existingHint) {
            existingHint.remove();
        }
        
        // Add hint if this is a valid move and hints are enabled
        if (showHints && board[r][c] === EMPTY && validMoves.some(move => move.r === r && move.c === c)) {
            const hint = document.createElement('div');
            hint.className = 'valid-move-hint ' + (currentPlayer === BLACK ? 'bg-gray-800' : 'bg-white');
            cell.appendChild(hint);
            
            // Smooth fade-in after a brief delay to avoid flicker
            setTimeout(() => {
                hint.classList.add('show');
            }, 50);
        }
    });

    updateScoresAndTurn(blackScore, whiteScore);
}

function getPiecesToFlip(r, c, player) {
    if (board[r][c] !== EMPTY) return [];

    const opponent = player === BLACK ? WHITE : BLACK;
    const piecesToFlip = [];

    for (const dir of directions) {
        piecesToFlip.push(...getFlipsInDirection(r, c, player, opponent, dir));
    }
    return piecesToFlip;
}

function getFlipsInDirection(r, c, player, opponent, dir) {
    let flips = [];
    let row = r + dir.r;
    let col = c + dir.c;

    // Check if the adjacent piece is an opponent's piece
    if (row >= 0 && row < 8 && col >= 0 && col < 8 && board[row][col] === opponent) {
        flips.push({ r: row, c: col });

        // Continue in this direction
        while (true) {
            row += dir.r;
            col += dir.c;

            if (row < 0 || row >= 8 || col < 0 || col >= 8 || board[row][col] === EMPTY) {
                return [];
            }

            if (board[row][col] === player) {
                // Found a bracketing piece, this is a valid line
                return flips;
            }

            flips.push({ r: row, c: col });
        }
    }
    return [];
}

function getValidMoves(player) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === EMPTY) {
                if (getPiecesToFlip(r, c, player).length > 0) {
                    moves.push({ r, c });
                }
            }
        }
    }
    return moves;
}

async function handleCellClick(e) {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    
    const r = parseInt(cell.dataset.r);
    const c = parseInt(cell.dataset.c);
    
    const piecesToFlip = getPiecesToFlip(r, c, currentPlayer);
    const elements = getCurrentElements();
    
    if (piecesToFlip.length === 0) {
        elements.messageBox.textContent = "Invalid Move!";
        setTimeout(() => { 
            if(elements.messageBox.textContent === "Invalid Move!") elements.messageBox.textContent = ''; 
        }, 2000);
        return;
    }

    // Record the move in history before making changes
    const moveRecord = {
        moveNumber: gameHistory.length + 1,
        player: currentPlayer,
        position: { r, c },
        piecesFlipped: [...piecesToFlip], // Copy array
        timestamp: Date.now(),
        boardBefore: board.map(row => [...row]) // Deep copy of board before move
    };

    // Make the move
    elements.messageBox.textContent = '';
    board[r][c] = currentPlayer;
    piecesToFlip.forEach(p => {
        board[p.r][p.c] = currentPlayer;
    });
    
    // Add board state after move to the record
    moveRecord.boardAfter = board.map(row => [...row]);
    
    // If we're not at the end of history (after undo), truncate future moves
    if (currentHistoryIndex < gameHistory.length - 1) {
        gameHistory = gameHistory.slice(0, currentHistoryIndex + 1);
    }
    
    gameHistory.push(moveRecord);
    currentHistoryIndex = gameHistory.length - 1;
    
    // Save game state after each move
    saveGameState();
    
    // Play placement sound
    playPlacementSound();
    
    // Update undo/redo buttons
    updateUndoRedoButtons();
    
    // Disable board during animations
    elements.board.style.pointerEvents = 'none';
    
    // Use animated update instead of full board refresh
    await updateBoardAnimated({ r, c }, piecesToFlip);
    
    switchTurn();
}

function switchTurn() {
    currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

    const elements = getCurrentElements();
    
    const validMovesForNextPlayer = getValidMoves(currentPlayer);
    if (validMovesForNextPlayer.length > 0) {
            // Next player can move - reset popup flag for new turn
        noMovesPopupShown = false;
        updateScoresAndValidMoves();
        // Save game state and re-enable board
        saveGameState();
        elements.board.style.pointerEvents = 'auto';
    } else {
        // Next player must pass - check if game should end first
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK; // Switch back
        
        const validMovesForCurrentPlayer = getValidMoves(currentPlayer);
        if (validMovesForCurrentPlayer.length > 0) {
                // Current player gets to go again - show popup only once
                if (!noMovesPopupShown) {
                    const playerWhoMustPass = currentPlayer === BLACK ? WHITE : BLACK;
                    showNoMovesPopup(playerWhoMustPass);
                    noMovesPopupShown = true;
                }
                updateScoresAndValidMoves();
        } else {
                // Game over, neither player can move - don't show popup
                endGame();
                return;
        }
        // Save game state but don't re-enable board yet (popup will handle it)
        saveGameState();
    }
}

function endGame() {
    let blackScore = 0;
    let whiteScore = 0;
    const elements = getCurrentElements();

    // Count scores
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] === BLACK) blackScore++;
            if (board[r][c] === WHITE) whiteScore++;
        }
    }

    const winnerMessage = getWinnerMessage(blackScore, whiteScore);

    elements.messageBox.textContent = winnerMessage;
    // Update both mobile and desktop message boxes
    if (messageBoxElement) messageBoxElement.textContent = winnerMessage;
    if (messageBoxElementDesktop) messageBoxElementDesktop.textContent = winnerMessage;

    removeActivePlayerAreas();

    elements.board.style.pointerEvents = 'none';
}

// Helper to get winner message
function getWinnerMessage(blackScore, whiteScore) {
    if (blackScore > whiteScore) {
        return `Game Over! Black wins ${blackScore} to ${whiteScore}.`;
    } else if (whiteScore > blackScore) {
        return `Game Over! White wins ${whiteScore} to ${blackScore}.`;
    } else {
        return `Game Over! It's a draw, ${blackScore} to ${whiteScore}.`;
    }
}

// Helper to remove active states from all player areas
function removeActivePlayerAreas() {
    if (blackPlayerArea) blackPlayerArea.classList.remove('active');
    if (whitePlayerArea) whitePlayerArea.classList.remove('active');
    if (blackPlayerAreaDesktop) blackPlayerAreaDesktop.classList.remove('active');
    if (whitePlayerAreaDesktop) whitePlayerAreaDesktop.classList.remove('active');
}

// Theme initialization (system preference only)
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Shimmer animation function
async function playShimmerAnimation() {
    return new Promise((resolve) => {
        const elements = getCurrentElements();
        // Clear all valid move hints at the start of shimmer animation
        const allCells = elements.board.querySelectorAll('.cell');
        allCells.forEach(cell => {
            const existingHint = cell.querySelector('.valid-move-hint');
            if (existingHint) {
                existingHint.remove();
            }
        });
        
        // Create shimmer overlay
        const shimmerOverlay = document.createElement('div');
        shimmerOverlay.className = 'shimmer-overlay';
        elements.board.appendChild(shimmerOverlay);
        
        // Create pieces for diagonal animation (top-left to bottom-right)
        const totalDiagonals = 15; // Number of diagonal lines
        const animationDuration = 600; // Duration for each piece in ms
        const staggerDelay = 80; // Delay between diagonal lines
        
        let pieceCount = 0;
        
        // Create diagonal lines from top-left to bottom-right
        for (let diagonal = 0; diagonal < totalDiagonals; diagonal++) {
            setTimeout(() => {
                // Calculate pieces for this diagonal line
                // For diagonal d: row ranges from max(0, d-7) to min(d, 7)
                const startRow = Math.max(0, diagonal - 7);
                const endRow = Math.min(diagonal, 7);
                
                for (let row = startRow; row <= endRow; row++) {
                    const col = diagonal - row;
                    
                    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
                        const piece = document.createElement('div');
                        piece.className = 'shimmer-piece';
                        
                        // Hide the existing piece in this cell as the shimmer passes over it
                        const actualCell = elements.board.querySelector(`[data-r="${row}"][data-c="${col}"]`);
                        const existingPiece = actualCell?.querySelector('.piece');
                        if (existingPiece) {
                            existingPiece.style.opacity = '0';
                            existingPiece.style.transition = 'opacity 0.3s ease-out';
                        }
                        
                        // Position piece in the center of the cell
                        // Get the actual cell element to match its position exactly
                        if (actualCell) {
                            const cellRect = actualCell.getBoundingClientRect();
                            const boardRect = elements.board.getBoundingClientRect();
                            
                            // Calculate position relative to board
                            const leftPercent = ((cellRect.left - boardRect.left + cellRect.width / 2) / boardRect.width) * 100;
                            const topPercent = ((cellRect.top - boardRect.top + cellRect.height / 2) / boardRect.height) * 100;
                            
                            piece.style.left = `${leftPercent}%`;
                            piece.style.top = `${topPercent}%`;
                            
                            // Set piece size to 85% of cell size (matching regular pieces)
                            const pieceSize = cellRect.width * 0.85;
                            piece.style.width = `${pieceSize}px`;
                            piece.style.height = `${pieceSize}px`;
                        } else {
                            // Fallback to simple calculation
                            const cellSize = 100 / 8;
                            piece.style.left = `${col * cellSize + cellSize / 2}%`;
                            piece.style.top = `${row * cellSize + cellSize / 2}%`;
                            // Fallback size (approximate)
                            const boardWidth = elements.board.offsetWidth || 400;
                            const approxCellSize = boardWidth / 10; // Rough estimate
                            piece.style.width = `${approxCellSize * 0.85}px`;
                            piece.style.height = `${approxCellSize * 0.85}px`;
                        }
                        
                        // Animate piece with flipping effect
                        piece.style.animation = `shimmer-flip ${animationDuration}ms ease-in-out`;
                        
                        shimmerOverlay.appendChild(piece);
                        pieceCount++;
                        
                        // Remove piece after animation
                        setTimeout(() => {
                            piece.remove();
                            pieceCount--;
                            
                            // When all pieces are done, remove overlay and resolve
                            if (pieceCount === 0) {
                                shimmerOverlay.remove();
                                resolve();
                            }
                        }, animationDuration);
                    }
                }
            }, diagonal * staggerDelay);
        }
    });
}

// No Moves Popup Functions
function showNoMovesPopup(player) {
    const playerName = player === BLACK ? 'Black' : 'White';
    const playerColor = player === BLACK ? 'bg-gray-800 dark:bg-gray-700' : 'bg-white border border-gray-300';
    
    // Set content for both orientations
    popupTitleTop.textContent = playerName;
    popupTitleBottom.textContent = playerName;
    
    // Set player piece colors
    popupPlayerPieceTop.className = `w-8 h-8 rounded-full ${playerColor}`;
    popupPlayerPieceBottom.className = `w-8 h-8 rounded-full ${playerColor}`;
    
    // Show popup with animation
    noMovesPopup.classList.remove('hidden');
    // Force reflow to ensure the transition works
    noMovesPopup.classList.add('show');
    
    // Disable board interaction
    boardElement.style.pointerEvents = 'none';
}

function hideNoMovesPopup() {
    noMovesPopup.classList.remove('show');
    const elements = getCurrentElements();
    
    setTimeout(() => {
        noMovesPopup.classList.add('hidden');
        // Re-enable board interaction
        elements.board.style.pointerEvents = 'auto';
        // Don't reset popup flag - let switchTurn handle it when appropriate
    }, 300); // Match transition duration
}

// Event Listeners
function setupEventListeners() {
    // Board click handlers for both mobile and desktop
    if (boardElement) boardElement.addEventListener('click', handleCellClick);
    if (boardElementDesktop) boardElementDesktop.addEventListener('click', handleCellClick);
    
    // New game button handlers
    if (newGameBtn) {
        newGameBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to start a new game? This will reset the current game.')) {
                const elements = getCurrentElements();
                elements.board.style.pointerEvents = 'none';
                await playShimmerAnimation();
                elements.board.style.pointerEvents = 'auto';
                clearSavedGameState();
                initGame();
            }
        });
    }
    if (newGameBtnDesktop) {
        newGameBtnDesktop.addEventListener('click', async () => {
            if (confirm('Are you sure you want to start a new game? This will reset the current game.')) {
                const elements = getCurrentElements();
                elements.board.style.pointerEvents = 'none';
                await playShimmerAnimation();
                elements.board.style.pointerEvents = 'auto';
                clearSavedGameState();
                initGame();
            }
        });
    }
    
    // Undo/Redo button handlers
    if (undoBtn) undoBtn.addEventListener('click', undoMove);
    if (undoBtnDesktop) undoBtnDesktop.addEventListener('click', undoMove);
    if (redoBtn) redoBtn.addEventListener('click', redoMove);
    if (redoBtnDesktop) redoBtnDesktop.addEventListener('click', redoMove);
    
    // Reset button handlers
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    if (resetBtnDesktop) resetBtnDesktop.addEventListener('click', resetGame);
    
    // Show hints checkbox handlers
    if (showHintsCheckbox) {
        showHintsCheckbox.addEventListener('change', (e) => {
            showHints = e.target.checked;
            // Sync both checkboxes
            if (showHintsCheckboxDesktop) showHintsCheckboxDesktop.checked = showHints;
            updateScoresAndValidMoves();
            saveGameState();
        });
    }
    if (showHintsCheckboxDesktop) {
        showHintsCheckboxDesktop.addEventListener('change', (e) => {
            showHints = e.target.checked;
            // Sync both checkboxes
            if (showHintsCheckbox) showHintsCheckbox.checked = showHints;
            updateScoresAndValidMoves();
            saveGameState();
        });
    }
    
    // Sound toggle button handlers
    if (soundToggleBtn) soundToggleBtn.addEventListener('click', toggleSound);
    if (soundToggleBtnDesktop) soundToggleBtnDesktop.addEventListener('click', toggleSound);
    
    // Fullscreen toggle button handler
    if (fullscreenToggleBtn) fullscreenToggleBtn.addEventListener('click', toggleFullscreen);
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    // No moves popup handlers
    if (popupOkBtn) popupOkBtn.addEventListener('click', hideNoMovesPopup);
    
    // Close popup on overlay click
    if (noMovesPopup) {
        noMovesPopup.addEventListener('click', (e) => {
            if (e.target === noMovesPopup) {
                hideNoMovesPopup();
            }
        });
    }
}

// Initialize theme and start game
window.onload = () => {
    initializeTheme();
    audioManager.init();
    audioManager.loadSoundPreference();
    setupEventListeners();
    
    // Try to load saved game state, if not available start new game
    if (!loadGameState()) {
        initGame();
    } else {
        // If we loaded a saved state, render the board and update buttons and scores
        renderBoard();
        updateUndoRedoButtons();
        updateScoresAndValidMoves(); // Ensure scores are updated correctly
    }
    
    // Update checkboxes to reflect loaded showHints preference
    if (showHintsCheckbox) showHintsCheckbox.checked = showHints;
    if (showHintsCheckboxDesktop) showHintsCheckboxDesktop.checked = showHints;
    updateSoundIcon();
};