import React, { useState, useRef, useEffect } from 'react';
import { View, QuestionAndAnswer, QuestionLevel, ViewProps } from '../types';
import { ACTS, SCENES_PER_ACT } from '../constants';
import { generateActSceneQuestions } from '../services/geminiService';
import { saveHistoryItem } from '../services/historyService';
import Spinner from './common/Spinner';
import BackButton from './common/BackButton';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface ActSceneQuestionsProps extends ViewProps {
  level: QuestionLevel;
}

const ActSceneQuestions: React.FC<ActSceneQuestionsProps> = ({ navigateBack, user, level }) => {
  const [act, setAct] = useState<number>(1);
  const [scene, setScene] = useState<number>(1);
  const [questions, setQuestions] = useState<QuestionAndAnswer[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const toggleAnswerVisibility = (index: number) => {
    setVisibleAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setVisibleAnswers({});
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    try {
      const result = await generateActSceneQuestions(act, scene, level);
      setQuestions(result);
      saveTimeoutRef.current = setTimeout(() => {
        saveHistoryItem({ type: 'act-scene', act, scene, questions: result, level }, user.uid);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleActChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newAct = parseInt(e.target.value, 10);
      setAct(newAct);
      setScene(SCENES_PER_ACT[newAct][0]);
  };

  const renderSelect = (id: string, label: string, value: number, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: number[]) => (
    <div className="flex-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative">
        <select id={id} value={value} onChange={onChange} className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all">
          {options.map(o => <option key={o} value={o} className="bg-gray-800 text-white">{o}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6 relative">
      <BackButton onClick={navigateBack} />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">Act & Scene Questions</h2>
        <p className="text-sm text-gray-400">Difficulty: {level}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {renderSelect("act", "Act", act, handleActChange, ACTS)}
        {renderSelect("scene", "Scene", scene, (e) => setScene(parseInt(e.target.value)), SCENES_PER_ACT[act])}
      </div>

      <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 text-base sm:text-lg rounded-lg hover:bg-amber-400 md:bg-amber-400 md:hover:bg-amber-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-amber-500/30">
        {isLoading ? 'Generating...' : 'Generate Questions'}
      </button>

      {isLoading && (
        <div className="mt-6 text-center p-6 bg-white/5 rounded-lg border border-white/10">
          <div className="flex justify-center"><Spinner /></div>
          <p className="mt-4 text-amber-300 font-semibold">Generating questions for Act {act}, Scene {scene}...</p>
        </div>
      )}
      
      {error && !isLoading && <p className="text-red-400 text-center mt-6 p-4 bg-red-900/30 rounded-lg border border-red-500/50">🚨 {error}</p>}
      
      {questions.length > 0 && !isLoading && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Questions:</h3>
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex justify-between items-start gap-4">
                  <p className="flex-1 text-gray-200">{i+1}. {q.question}</p>
                  <button onClick={() => toggleAnswerVisibility(i)} className="flex-shrink-0 flex items-center text-xs text-amber-400 hover:text-amber-300 transition-colors p-1 rounded-full bg-white/10 hover:bg-white/20">
                    {visibleAnswers[i] ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${visibleAnswers[i] ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                    <div className="p-3 bg-black/30 rounded-md border border-white/10 text-amber-200">
                        <p>{q.answer}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActSceneQuestions;