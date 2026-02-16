import React from 'react';

interface ModalProps {
  isOpen: boolean;
  time: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, time, onPlayAgain, onHome }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-95 duration-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 Solved!</h2>
        <p className="text-gray-600 mb-6">
          You completed the puzzle in <br/>
          <span className="text-2xl font-mono font-bold text-blue-600">{time}</span>
        </p>
        
        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
          >
            Play Again
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
