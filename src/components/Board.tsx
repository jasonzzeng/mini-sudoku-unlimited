import React from 'react';
import Cell from './Cell';
import { BoardState } from '../types';
import { getConflicts } from '../lib/logic';

interface BoardProps {
  board: BoardState;
  initialBoard: BoardState;
  selectedCell: number | null;
  notes: Set<number>[];
  autoCheck: boolean;
  flashingCells: Set<number>;
  onCellClick: (index: number) => void;
}

const Board: React.FC<BoardProps> = ({
  board,
  initialBoard,
  selectedCell,
  notes,
  autoCheck,
  flashingCells,
  onCellClick,
}) => {
  // Conflicts for Auto Check
  const conflicts = autoCheck && selectedCell !== null
    ? new Set(getConflicts(board, selectedCell))
    : new Set<number>();

  const selectedValue = selectedCell !== null ? board[selectedCell] : null;

  return (
    <div className="board-container">
      <div className="sudoku-grid">
        {board.map((val, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={val}
            isInitial={initialBoard[idx] !== null}
            isSelected={selectedCell === idx}
            isHighlighted={val !== null && val === selectedValue}
            isError={conflicts.has(idx)}
            isFlashing={flashingCells.has(idx)}
            notes={notes[idx]}
            onClick={onCellClick}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;