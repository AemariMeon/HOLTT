import React from 'react';
import { Creator, Guess, GuessStatus } from '../types';

interface GameCardProps {
  creator: Creator;
  showFollowers: boolean;
  onGuess?: (guess: Guess) => void;
  disabled?: boolean;
  guessStatus?: GuessStatus;
}

const formatFollowers = (followers: number): string => {
  if (followers >= 1_000_000) {
    return `${(followers / 1_000_000).toFixed(1)}M`;
  }
  if (followers >= 1_000) {
    return `${(followers / 1_000).toFixed(1)}k`;
  }
  return followers.toString();
};

const GameCard: React.FC<GameCardProps> = ({ creator, showFollowers, onGuess, disabled = false, guessStatus = 'pending' }) => {
  
  const glowOverlayClass = () => {
    if (guessStatus === 'correct') return 'bg-green-500/30';
    if (guessStatus === 'incorrect') return 'bg-red-500/30';
    return 'bg-gray-900/50';
  };

  const borderClass = () => {
    if (guessStatus === 'correct') return 'border-green-400';
    if (guessStatus === 'incorrect') return 'border-red-400';
    return 'border-gray-700';
  };

  return (
    <div className={`w-1/2 h-full flex flex-col items-center justify-center p-4 relative transition-all duration-500 border-2 ${borderClass()}`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${creator.imageUrl})`, filter: 'blur(20px) brightness(0.4)', transform: 'scale(1.1)' }}></div>
      
      {/* This new overlay shows the color tint on top of the blurred image */}
      <div className={`absolute inset-0 transition-colors duration-500 ${glowOverlayClass()}`}></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center w-full h-full">
        <img
          src={creator.imageUrl}
          alt={creator.name}
          className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg mb-4"
        />
        <h2 className="text-xl md:text-3xl font-bold">{creator.name}</h2>
        <p className="text-md md:text-xl text-slate-300">{creator.handle}</p>
        
        <div className="mt-6 md:mt-8 h-24 flex flex-col items-center justify-center">
          {showFollowers ? (
            <div className="animate-fade-in">
              <p className="text-lg md:text-2xl text-slate-400 mb-1">has</p>
              <p className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {formatFollowers(creator.followers)}
              </p>
              <p className="text-lg md:text-2xl text-slate-400 mt-1">followers</p>
            </div>
          ) : (
            <>
              <p className="text-lg md:text-2xl text-slate-400 mb-4">has</p>
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <button
                  onClick={() => onGuess && onGuess('higher')}
                  disabled={disabled}
                  className="w-32 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 disabled:transform-none"
                >
                  Higher
                </button>
                <button
                  onClick={() => onGuess && onGuess('lower')}
                  disabled={disabled}
                  className="w-32 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 disabled:transform-none"
                >
                  Lower
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
