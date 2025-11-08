
import React from 'react';
import { useState } from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  finalScore?: number;
  leaderboard: LeaderboardEntry[];
  onSave?: (alias: string) => void;
  onPlayAgain?: () => void;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ finalScore, leaderboard, onSave, onPlayAgain, onClose }) => {
  const [alias, setAlias] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (alias.trim() && onSave && finalScore !== undefined) {
      onSave(alias.trim());
      setIsSaved(true);
    }
  };

  const isGameOver = finalScore !== undefined;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 text-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative border border-purple-500">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl">&times;</button>
        
        {isGameOver && (
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-purple-400">Game Over!</h2>
            <p className="text-xl mt-2">Your final score is</p>
            <p className="text-6xl font-bold my-3">{finalScore}</p>
          </div>
        )}

        {!isGameOver && (
          <h2 className="text-3xl font-bold text-center mb-6 text-purple-400">Leaderboard</h2>
        )}

        {isGameOver && !isSaved && (
          <form onSubmit={handleSave} className="flex flex-col gap-4 mb-6">
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Enter your alias"
              maxLength={15}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
            />
            <button
              type="submit"
              disabled={!alias.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Save to Leaderboard
            </button>
          </form>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                        <span className="font-bold text-lg">
                            {index + 1}. {entry.alias}
                        </span>
                        <span className="text-xl font-bold text-purple-400">{entry.score}</span>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400 py-4">No scores yet. Be the first!</p>
            )}
        </div>
        
        {isGameOver && onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-6 transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;
