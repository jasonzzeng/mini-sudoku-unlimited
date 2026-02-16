import React, { useState, useEffect, useCallback, useRef } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import NumPad from './components/NumPad';
import Modal from './components/Modal';
import { generatePuzzle } from './lib/generator';
import { BoardState, Difficulty } from './types';
import { isGameWon, getValidCompletedRegions, getIndicesForRegion } from './lib/logic';

type Screen = 'home' | 'game';

function App() {
  // Navigation State
  const [screen, setScreen] = useState<Screen>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  
  // Game State
  const [board, setBoard] = useState<BoardState>(Array(36).fill(null));
  const [initialBoard, setInitialBoard] = useState<BoardState>(Array(36).fill(null));
  const [solution, setSolution] = useState<BoardState>([]);
  const [notes, setNotes] = useState<Set<number>[]>(Array.from({length: 36}, () => new Set()));
  const [history, setHistory] = useState<{board: BoardState, notes: Set<number>[]}[]>([]);
  const [timer, setTimer] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Flash Logic State
  const [completedRegions, setCompletedRegions] = useState<Set<string>>(new Set());
  const [flashingCells, setFlashingCells] = useState<Set<number>>(new Set());

  // UI State
  const [selected, setSelected] = useState<number | null>(null);
  const [notesMode, setNotesMode] = useState(false);
  const [autoCheck, setAutoCheck] = useState(false);

  // Timer
  useEffect(() => {
    let interval: number;
    if (screen === 'game' && !isWon) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isWon]);

  // Check for Completed Regions to Flash
  useEffect(() => {
    if (screen !== 'game') return;
    
    // Get currently valid completed regions
    const currentValidRegions = getValidCompletedRegions(board);
    
    // Find newly completed regions
    const newRegions = [...currentValidRegions].filter(r => !completedRegions.has(r));
    
    if (newRegions.length > 0) {
        const cellsToFlash = new Set<number>();
        newRegions.forEach(regionId => {
            const indices = getIndicesForRegion(regionId);
            indices.forEach(idx => cellsToFlash.add(idx));
        });

        // Trigger Flash
        setFlashingCells(prev => {
            const next = new Set(prev);
            cellsToFlash.forEach(idx => next.add(idx));
            return next;
        });

        // Remove Flash after 400ms
        setTimeout(() => {
            setFlashingCells(prev => {
                const next = new Set(prev);
                cellsToFlash.forEach(idx => next.delete(idx));
                return next;
            });
        }, 400);
    }

    // Update tracked regions
    setCompletedRegions(currentValidRegions);

  }, [board, screen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startGame = (diff: Difficulty) => {
    const { initial, solution: sol } = generatePuzzle(diff);
    setDifficulty(diff);
    setBoard([...initial]);
    setInitialBoard([...initial]);
    setSolution(sol);
    setNotes(Array.from({length: 36}, () => new Set()));
    setHistory([]);
    setTimer(0);
    setIsWon(false);
    setSelected(null);
    setCompletedRegions(new Set());
    setFlashingCells(new Set());
    setScreen('game');
  };

  const saveToHistory = useCallback(() => {
    setHistory(prev => [
      ...prev.slice(-20), 
      { 
        board: [...board], 
        notes: notes.map(n => new Set(n)) 
      }
    ]);
  }, [board, notes]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setNotes(last.notes);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleInput = useCallback((num: number) => {
    if (selected === null || initialBoard[selected] !== null || isWon) return;

    saveToHistory();

    if (notesMode) {
      setNotes(prev => {
        const next = [...prev];
        const cellNotes = new Set(prev[selected]);
        if (cellNotes.has(num)) cellNotes.delete(num);
        else cellNotes.add(num);
        next[selected] = cellNotes;
        return next;
      });
    } else {
      setBoard(prev => {
        const next = [...prev];
        // Toggle if same number, otherwise set
        next[selected] = next[selected] === num ? null : num;
        
        // Check win condition
        if (isGameWon(next)) {
          setIsWon(true);
        }
        return next;
      });
      // Clear notes in this cell
      setNotes(prev => {
        const next = [...prev];
        next[selected] = new Set();
        return next;
      });
    }
  }, [selected, notesMode, initialBoard, isWon, saveToHistory]);

  const handleErase = () => {
    if (selected === null || initialBoard[selected] !== null || isWon) return;
    saveToHistory();
    setBoard(prev => {
      const next = [...prev];
      next[selected] = null;
      return next;
    });
  };

  const handleHint = () => {
    if (isWon) return;
    let target = selected;
    if (target === null || board[target] !== null) {
      target = board.findIndex(c => c === null);
      if (target === -1) {
        target = board.findIndex((c, i) => c !== null && c !== solution[i]);
      }
    }
    
    if (target !== -1 && target !== null) {
      saveToHistory();
      const correctVal = solution[target];
      setBoard(prev => {
        const next = [...prev];
        next[target!] = correctVal;
        if (isGameWon(next)) setIsWon(true);
        return next;
      });
      setSelected(target);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== 'game') return;

      if (e.key >= '1' && e.key <= '6') handleInput(parseInt(e.key));
      if (e.key === 'Backspace' || e.key === 'Delete') handleErase();
      if (e.key.toLowerCase() === 'n') setNotesMode(p => !p);
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
      if (e.key === 'ArrowUp') setSelected(p => p === null ? 0 : (p - 6 + 36) % 36);
      if (e.key === 'ArrowDown') setSelected(p => p === null ? 0 : (p + 6) % 36);
      if (e.key === 'ArrowLeft') setSelected(p => p === null ? 0 : (p - 1 + 36) % 36);
      if (e.key === 'ArrowRight') setSelected(p => p === null ? 0 : (p + 1) % 36);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, selected, handleInput]);

  if (screen === 'home') {
    return (
      <div className="home-screen">
        <h1 className="home-title">
          MINI<br/>SUDOKU<br/><span>UNLIMITED</span>
        </h1>
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(d => (
              <button key={d} onClick={() => startGame(d)} className="diff-btn">
                {d}
              </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="title-group">
            <div className="title">Mini Sudoku</div>
            <div className="subtitle">Unlimited</div>
        </div>
        <div className="stats-pill">
            <span className="difficulty-badge">{difficulty}</span>
            <div className="timer">{formatTime(timer)}</div>
        </div>
      </div>

      <Board
        board={board}
        initialBoard={initialBoard}
        selectedCell={selected}
        notes={notes}
        autoCheck={autoCheck}
        flashingCells={flashingCells}
        onCellClick={setSelected}
      />

      <Controls
        notesMode={notesMode}
        toggleNotes={() => setNotesMode(p => !p)}
        autoCheck={autoCheck}
        toggleAutoCheck={() => setAutoCheck(p => !p)}
        onHint={handleHint}
      />

      <NumPad
        onInput={handleInput}
        onErase={handleErase}
        onUndo={handleUndo}
      />
      
      <div style={{marginTop: 'auto', marginBottom: '1rem'}}>
         <button onClick={() => setScreen('home')} style={{color: '#94a3b8', background:'none', fontSize: '0.9rem'}}>Exit Game</button>
      </div>

      <Modal
        isOpen={isWon}
        time={formatTime(timer)}
        onPlayAgain={() => startGame(difficulty)}
        onHome={() => setScreen('home')}
      />
    </div>
  );
}

export default App;