import { GRID_SIZE } from './constants';
import { isValidMove } from './logic';
import { BoardState, Difficulty } from '../types';
import { DIFFICULTIES } from './constants';

const shuffle = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const solve = (board: BoardState): boolean => {
  const emptyIndex = board.findIndex(cell => cell === null);
  if (emptyIndex === -1) return true;

  const candidates = shuffle([1, 2, 3, 4, 5, 6]);
  for (const num of candidates) {
    if (isValidMove(board, emptyIndex, num)) {
      board[emptyIndex] = num;
      if (solve(board)) return true;
      board[emptyIndex] = null;
    }
  }
  return false;
};

export const generatePuzzle = (difficulty: Difficulty) => {
  // 1. Generate full solution
  const solution = new Array(GRID_SIZE * GRID_SIZE).fill(null);
  solve(solution);
  
  // 2. Remove clues
  const cluesCount = DIFFICULTIES[difficulty].clues;
  const puzzle = [...solution];
  const indices = shuffle(Array.from({ length: puzzle.length }, (_, i) => i));
  
  let removed = 0;
  const toRemove = puzzle.length - cluesCount;

  for (const idx of indices) {
    if (removed >= toRemove) break;
    puzzle[idx] = null;
    removed++;
  }

  return {
    initial: puzzle.map(x => x), // Clone
    solution: solution,
  };
};
