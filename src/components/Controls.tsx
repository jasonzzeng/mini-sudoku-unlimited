import React from 'react';

interface ControlsProps {
  notesMode: boolean;
  toggleNotes: () => void;
  autoCheck: boolean;
  toggleAutoCheck: () => void;
  onHint: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  notesMode,
  toggleNotes,
  autoCheck,
  toggleAutoCheck,
  onHint,
}) => {
  return (
    <div className="controls-row">
      <button
        onClick={toggleNotes}
        className={`control-btn ${notesMode ? 'active' : ''}`}
      >
        <span>✏️</span>
        Notes
      </button>

      <button
        onClick={toggleAutoCheck}
        className={`control-btn ${autoCheck ? 'active' : ''}`}
      >
        <span>👁️</span>
        Check
      </button>

      <button
        onClick={onHint}
        className="control-btn"
      >
        <span>💡</span>
        Hint
      </button>
    </div>
  );
};

export default Controls;