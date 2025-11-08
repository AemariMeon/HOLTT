import { useState, useEffect, useCallback } from 'react';
import { Creator, Guess, GuessStatus, LeaderboardEntry } from '../types';
import { creators as initialCreators } from '../data/creators';

const LEADERBOARD_KEY = 'tiktok_ph_leaderboard';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const useGame = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [currentPair, setCurrentPair] = useState<[Creator, Creator] | null>(null);
  const [score, setScore] = useState(0);
  const [guessStatus, setGuessStatus] = useState<GuessStatus>('pending');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadedLeaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    setLeaderboard(loadedLeaderboard);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setGameOver(false);
    setGuessStatus('pending');
    setShowAnswer(false);
    const shuffled = shuffleArray(initialCreators);
    const firstPair: [Creator, Creator] = [shuffled[0], shuffled[1]];
    setCreators(shuffled.slice(2)); // Remove the first two creators from the pool
    setCurrentPair(firstPair);
  }, []);

  const handleNextRound = useCallback(() => {
    setShowAnswer(false);
    setGuessStatus('pending');

    if (currentPair && creators.length > 0) {
        const nextCreator = creators[0];
        const newPair: [Creator, Creator] = [currentPair[1], nextCreator];
        setCurrentPair(newPair);
        setCreators(prev => prev.slice(1));
    } else {
        // Not enough creators left, end the game
        setGameOver(true);
    }
  }, [creators, currentPair]);

  const handleGuess = useCallback((guess: Guess) => {
    if (!currentPair || showAnswer) return;

    const [creatorA, creatorB] = currentPair;
    const isHigher = creatorB.followers > creatorA.followers;
    let correct = false;

    if (guess === 'higher' && isHigher) {
      correct = true;
    } else if (guess === 'lower' && !isHigher) {
      correct = true;
    }
    
    setShowAnswer(true);

    if (correct) {
      setScore(prev => prev + 1);
      setGuessStatus('correct');
      setTimeout(() => {
        handleNextRound();
      }, 2000);
    } else {
      setGuessStatus('incorrect');
      setTimeout(() => {
        setGameOver(true);
      }, 2000);
    }
  }, [currentPair, showAnswer, handleNextRound]);

  const saveScore = useCallback((alias: string) => {
    const newEntry: LeaderboardEntry = { alias, score, date: new Date().toISOString() };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedLeaderboard));
  }, [score, leaderboard]);

  return {
    currentPair,
    score,
    handleGuess,
    guessStatus,
    showAnswer,
    isGameOver,
    startGame,
    leaderboard,
    saveScore,
  };
};