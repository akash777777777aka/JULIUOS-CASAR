import React, { useState, useEffect } from 'react';
import { ViewProps } from '../types';
import { getLastScore } from '../services/historyService';
import BackButton from './common/BackButton';
import { TrophyIcon } from './icons/TrophyIcon';
import Spinner from './common/Spinner';

const ScoreView: React.FC<ViewProps> = ({ navigateBack, user }) => {
  const [lastScore, setLastScore] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScore = async () => {
      setIsLoading(true);
      const score = await getLastScore(user.uid);
      setLastScore(score);
      setIsLoading(false);
    }
    fetchScore();
  }, [user.uid]);

  const renderContent = () => {
    if(isLoading) {
      return <div className="h-20 flex items-center justify-center"><Spinner /></div>;
    }
    if (lastScore) {
        return <p className="text-6xl font-extrabold text-white">{lastScore}</p>;
    }
    return <p className="text-xl text-gray-400">No quiz score found.</p>
  }

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-8 text-center relative">
      <BackButton onClick={navigateBack} />
      <div className="flex justify-center items-center flex-col">
        <TrophyIcon className="w-20 h-20 text-amber-300 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-6">Last Quiz Score</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default ScoreView;