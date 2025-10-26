import React, { useState, useEffect } from 'react';
import { ViewProps, HistoryItem, ActSceneHistoryItem, CharacterHistoryItem, QuizHistoryItem, DoubtSolverHistoryItem } from '../types';
import { getHistory, clearHistory } from '../services/historyService';
import BackButton from './common/BackButton';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';
import { QuizIcon } from './icons/QuizIcon';
import { SearchIcon } from './icons/SearchIcon';
import Spinner from './common/Spinner';

const HistoryView: React.FC<ViewProps> = ({ navigateBack, user }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
        setIsLoading(true);
        const userHistory = await getHistory(user.uid);
        setHistory(userHistory);
        setIsLoading(false);
    }
    fetchHistory();
  }, [user.uid]);
  
  const handleClearHistory = async () => {
    if(user && window.confirm("Are you sure you want to delete all your study history? This action cannot be undone.")) {
      await clearHistory(user.uid);
      setHistory([]);
    }
  }

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  }

  const renderHistoryItemDetails = (item: HistoryItem) => {
    switch (item.type) {
      case 'act-scene':
      case 'character':
        return (
          <div className="space-y-3">
            {(item as ActSceneHistoryItem | CharacterHistoryItem).questions.map((q, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-lg">
                <p className="font-medium text-gray-300">{index + 1}. {q.question}</p>
                <p className="mt-1 text-amber-200 pl-4 border-l-2 border-amber-500 text-sm">{q.answer}</p>
              </div>
            ))}
          </div>
        );
      case 'quiz':
        const quizItem = item as QuizHistoryItem;
        return (
          <div className="space-y-3">
            {quizItem.questions.map((q, index) => (
              <div key={index} className="p-3 bg-black/30 rounded-lg">
                <p className="font-medium text-gray-300">{index + 1}. {q.question}</p>
                <ul className="mt-2 space-y-1 pl-4 text-sm">
                  {q.options.map((opt, i) => (
                    <li key={i} className={`${opt === q.answer ? 'text-green-400 font-semibold' : 'text-gray-400'}`}>
                      {opt} {opt === q.answer && '✓'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      case 'doubt-solver':
        const doubtItem = item as DoubtSolverHistoryItem;
        return (
          <div className="space-y-3">
            <div className="p-3 bg-black/30 rounded-lg">
                <p className="font-medium text-gray-300">Your Question:</p>
                <p className="mt-1 text-gray-400 pl-4 border-l-2 border-gray-500 text-sm">{doubtItem.question}</p>
              </div>
            <div className="p-3 bg-black/30 rounded-lg">
              <p className="font-medium text-gray-300">AI Answer:</p>
              <p className="mt-1 text-amber-200 pl-4 border-l-2 border-amber-500 text-sm">{doubtItem.answer}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderHistoryItemSummary = (item: HistoryItem) => {
    const date = new Date(item.timestamp).toLocaleString();
    const levelBadge = <span className="text-xs bg-white/10 text-amber-200 px-2 py-1 rounded-full">{item.level}</span>;

    let icon, title, details;
    
    switch (item.type) {
      case 'act-scene':
        const asItem = item as ActSceneHistoryItem;
        icon = <BookOpenIcon className="w-6 h-6 text-amber-300"/>;
        title = `Act ${asItem.act}, Scene ${asItem.scene}`;
        break;
      case 'character':
        const charItem = item as CharacterHistoryItem;
        icon = <UserIcon className="w-6 h-6 text-amber-300"/>;
        title = `${charItem.character} Questions`;
        break;
      case 'quiz':
        const quizItem = item as QuizHistoryItem;
        icon = <QuizIcon className="w-6 h-6 text-amber-300"/>;
        title = 'Quiz';
        details = <span className="font-bold text-lg text-white">{quizItem.score}/{quizItem.totalQuestions}</span>;
        break;
      case 'doubt-solver':
        icon = <SearchIcon className="w-6 h-6 text-amber-300"/>;
        title = 'Asked a Question';
        break;
      default:
        return 'Unknown History Item';
    }
    
    return (
       <div className="flex items-center w-full gap-4">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/10 rounded-lg">{icon}</div>
            <div className="flex-grow text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{title}</span>
                  {levelBadge}
                </div>
                <span className="block text-xs text-gray-400">{date}</span>
            </div>
            {details && <div className="flex-shrink-0">{details}</div>}
       </div>
    );
  };


  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6 relative">
      <BackButton onClick={navigateBack} />
      <h2 className="text-2xl font-bold text-center text-white mb-6">Study History</h2>
      {isLoading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : history.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Your study history is empty.</p>
      ) : (
        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="bg-white/5 rounded-lg border border-white/10 transition-all">
              <button onClick={() => toggleExpand(item.id)} className="w-full text-left p-3 hover:bg-white/10 transition-colors flex items-center justify-between">
                {renderHistoryItemSummary(item)}
                 <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedItem === item.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-4 border-t border-white/10 bg-black/20">
                  {renderHistoryItemDetails(item)}
                </div>
              </div>
            </div>
          ))}
          <div className="pt-6 text-center">
            <button onClick={handleClearHistory} className="bg-red-600/50 text-red-100 font-bold py-2 px-4 sm:py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-red-600/70 transition-colors border border-red-500/50 transform active:scale-95">
              Clear All History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;