import React from 'react';
import clsx from 'clsx';
import { GRID_SIZE } from '../lib/constants';
import { getRow, getCol } from '../lib/logic';

interface CellProps {
  index: number;
  value: number | null;
  isInitial: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  isFlashing: boolean;
  notes: Set<number>;
  onClick: (index: number) => void;
}

const Cell: React.FC<CellProps> = ({
  index,
  value,
  isInitial,
  isSelected,
  isHighlighted,
  isError,
  isFlashing,
  notes,
  onClick,
}) => {
  const row = getRow(index);
  const col = getCol(index);

  // Determine block borders (every 3 cols, every 2 rows for 6x6)
  // Logic: 6x6 grid. Block width 3, height 2.
  // Vertical lines at col 2 (0-indexed).
  // Horizontal lines at row 1, 3 (0-indexed). 
  // NOTE: Logic assumes 2x3 blocks (2 rows, 3 cols per block) -> 3 blocks wide, 2 blocks high?
  // Standard 6x6 is usually 2 rows x 3 cols blocks. 
  // Let's stick to standard Mini Sudoku: 2 rows, 3 cols.
  // So horizontal divider after row 1, 3. Vertical after col 2.
  
  const thickRight = col === 2; 
  const thickBottom = row === 1 || row === 3; 

  return (
    <div
      onClick={() => onClick(index)}
      className={clsx(
        'cell',
        thickRight && 'thick-right',
        thickBottom && 'thick-bottom',
        isSelected && 'selected',
        !isSelected && isHighlighted && 'highlighted',
        isError && 'error',
        isFlashing && 'flash'
      )}
    >
      {value ? (
        <span className={isInitial ? 'val-initial' : 'val-input'}>
          {value}
        </span>
      ) : (
        notes.size > 0 && (
          <div className="notes-grid">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="note-num">
                {notes.has(n) ? n : ''}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default React.memo(Cell);