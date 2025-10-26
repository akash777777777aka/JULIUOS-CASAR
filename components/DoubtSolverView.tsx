import React, { useState } from 'react';
import { ViewProps, QuestionLevel } from '../types';
import { askDoubt } from '../services/geminiService';
import { saveHistoryItem } from '../services/historyService';
import Spinner from './common/Spinner';
import BackButton from './common/BackButton';

interface DoubtSolverViewProps extends ViewProps {
  level: QuestionLevel;
}

const DoubtSolverView: React.FC<DoubtSolverViewProps> = ({ navigateBack, user, level }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnswer('');
    try {
      const result = await askDoubt(question);
      setAnswer(result);
      saveHistoryItem({ type: 'doubt-solver', question, answer: result, level }, user.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setAnswer('');
    setError(null);
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6 relative">
      <BackButton onClick={navigateBack} />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Ask a Question</h2>
        <p className="text-sm text-gray-400">Get instant answers about Julius Caesar.</p>
      </div>

      <div className="mb-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., Why did Brutus join the conspiracy?"
          className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-gray-500 min-h-[80px] resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAsk}
          disabled={isLoading || !question.trim()}
          className="flex-grow bg-amber-500 text-gray-900 font-bold py-3 px-4 text-base sm:text-lg rounded-lg hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-amber-500/30 flex justify-center items-center h-12"
        >
          {isLoading ? <Spinner /> : 'Ask AI'}
        </button>
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="flex-shrink-0 bg-white/10 text-white font-bold py-3 px-5 rounded-lg hover:bg-white/20 transition-colors transform active:scale-95 disabled:opacity-50"
        >
          Clear
        </button>
      </div>

      {isLoading && (
        <div className="mt-6 text-center p-6 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-center"><Spinner /></div>
          <p className="mt-4 text-amber-300 font-semibold">The AI is thinking...</p>
        </div>
      )}

      {error && !isLoading && (
        <p className="text-red-400 text-center mt-6 p-4 bg-red-900/30 rounded-lg border border-red-500/50">
          🚨 {error}
        </p>
      )}

      {answer && !isLoading && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Answer:</h3>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 prose prose-invert prose-p:text-gray-200">
             <p>{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoubtSolverView;
