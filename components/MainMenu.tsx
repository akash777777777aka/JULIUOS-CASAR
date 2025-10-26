import React from 'react';
import { View, BaseViewProps, QuestionLevel } from '../types';
import { QUESTION_LEVELS } from '../constants';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';
import { QuizIcon } from './icons/QuizIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SearchIcon } from './icons/SearchIcon';

interface MainMenuProps extends BaseViewProps {
  level: QuestionLevel;
  setLevel: (level: QuestionLevel) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ setView, level, setLevel }) => {
  const menuItems = [
    { view: View.ACT_SCENE, text: 'Act & Scene Questions', icon: <BookOpenIcon /> },
    { view: View.CHARACTER, text: 'Character Questions', icon: <UserIcon /> },
    { view: View.QUIZ, text: 'Take a Quiz', icon: <QuizIcon /> },
    { view: View.DOUBT_SOLVER, text: 'Ask a Question', icon: <SearchIcon /> },
    { view: View.SCORE, text: 'View Last Score', icon: <TrophyIcon /> },
    { view: View.HISTORY, text: 'Study History', icon: <HistoryIcon /> },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6">
      <div className="mb-6">
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2 text-center">Difficulty Level</label>
          <div className="relative">
             <select 
              id="difficulty" 
              value={level} 
              onChange={(e) => setLevel(e.target.value as QuestionLevel)} 
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg py-2 px-3 sm:py-3 sm:px-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
            >
              {QUESTION_LEVELS.map(l => <option key={l} value={l} className="bg-gray-800 text-white">{l}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
            </div>
      </div>
      </div>

      <div className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className="group w-full flex items-center text-left p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-amber-400 active:scale-[0.98]"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md mr-3 sm:mr-4 text-amber-300 group-hover:text-white transition-colors">{item.icon}</div>
            <span className="text-base sm:text-lg font-medium text-gray-200 group-hover:text-white transition-colors">{item.text}</span>
            <svg className="w-5 h-5 ml-auto text-gray-500 group-hover:text-gray-300 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;