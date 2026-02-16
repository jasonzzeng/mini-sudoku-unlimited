import React from 'react';

interface NumPadProps {
  onInput: (num: number) => void;
  onErase: () => void;
  onUndo: () => void;
}

const NumPad: React.FC<NumPadProps> = ({ onInput, onErase, onUndo }) => {
  return (
    <div className="numpad">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button
          key={num}
          onClick={() => onInput(num)}
          className="num-btn"
        >
          {num}
        </button>
      ))}
      <button onClick={onErase} className="action-btn btn-erase">
        Erase
      </button>
      <button onClick={onUndo} className="action-btn btn-undo">
        Undo
      </button>
    </div>
  );
};

export default NumPad;