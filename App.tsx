
import React from 'react';
import { useState } from 'react';
import { useGame } from './hooks/useGame';
import GameCard from './components/GameCard';
import LeaderboardModal from './components/LeaderboardModal';

const App: React.FC = () => {
  const {
    currentPair,
    score,
    handleGuess,
    guessStatus,
    showAnswer,
    isGameOver,
    startGame,
    leaderboard,
    saveScore,
  } = useGame();

  const [isLeaderboardVisible, setLeaderboardVisible] = useState(false);

  const renderGameContent = () => {
    if (isGameOver) {
      return (
        <LeaderboardModal
          finalScore={score}
          leaderboard={leaderboard}
          onSave={saveScore}
          onPlayAgain={startGame}
          onClose={() => setLeaderboardVisible(false)}
        />
      );
    }

    if (!currentPair) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Higher or Lower</h1>
            <h2 className="text-xl md:text-2xl mb-8 text-slate-300">TikTok PH Edition</h2>
            <button
                onClick={startGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl transition-transform transform hover:scale-105 shadow-lg"
            >
                Start Game
            </button>
        </div>
      );
    }

    const [creatorA, creatorB] = currentPair;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <GameCard creator={creatorA} showFollowers={true} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-900 bg-opacity-80 backdrop-blur-sm p-3 rounded-full border-2 border-purple-500 shadow-lg">
          <span className="text-white font-bold text-2xl">VS</span>
        </div>
        
        <div className="absolute z-20 top-4 right-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm text-white py-2 px-4 rounded-lg shadow-md">
            <p className="font-bold text-lg">Streak: {score}</p>
        </div>

        <GameCard 
          creator={creatorB} 
          showFollowers={showAnswer} 
          onGuess={handleGuess}
          disabled={showAnswer}
          guessStatus={guessStatus}
        />
      </div>
    );
  };
  
  return (
    <div className="bg-gray-900 min-h-screen w-full flex flex-col items-center justify-center font-sans overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900/40 to-gray-900"></div>
      <main className="w-full max-w-7xl h-[80vh] md:h-[600px] relative text-center">
        {renderGameContent()}
      </main>
      {!isGameOver && currentPair && (
          <button 
            onClick={() => setLeaderboardVisible(true)}
            className="absolute bottom-4 right-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-105 z-30"
          >
            Leaderboard
          </button>
        )
      }
      {isLeaderboardVisible && !isGameOver && (
        <LeaderboardModal
          leaderboard={leaderboard}
          onClose={() => setLeaderboardVisible(false)}
        />
      )}
    </div>
  );
};

export default App;