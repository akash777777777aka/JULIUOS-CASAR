import React, { useState, useEffect, useCallback } from 'react';
import { View, QuizQuestion, QuestionLevel, ViewProps } from '../types';
import { generateQuiz } from '../services/geminiService';
import { saveHistoryItem, saveLastScore } from '../services/historyService';
import Spinner from './common/Spinner';
import BackButton from './common/BackButton';

type QuizState = 'loading' | 'active' | 'feedback' | 'finished' | 'error';

interface QuizViewProps extends ViewProps {
  level: QuestionLevel;
}

const QuizView: React.FC<QuizViewProps> = ({ navigateBack, user, level }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const fetchQuiz = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    try {
      const quizQuestions = await generateQuiz(level);
      setQuestions(quizQuestions);
      setQuizState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuizState('error');
    }
  }, [level]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    if (user && currentQuestionIndex === questions.length - 1) {
      const calculatedFinalScore = score + (isCorrect ? 1 : 0);
      setFinalScore(calculatedFinalScore);
      
      const cleanQuestions = questions.map(({ question, options, answer }) => ({ question, options, answer }));

      saveLastScore(user.uid, calculatedFinalScore, questions.length);
      saveHistoryItem({
        type: 'quiz',
        score: calculatedFinalScore,
        totalQuestions: questions.length,
        questions: cleanQuestions,
        level,
      }, user.uid);
    }

    setQuizState('feedback');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setCurrentQuestionIndex(prev => prev + 1);
      setQuizState('active');
    } else {
      setQuizState('finished');
    }
  };
  
  const getOptionClass = (option: string) => {
      const baseClass = 'w-full text-left p-3 sm:p-4 rounded-lg border transition-all duration-300 font-medium transform active:scale-[0.98] focus:outline-none focus:ring-2';
      if (quizState !== 'feedback') {
          return `${baseClass} ${selectedAnswer === option 
            ? 'bg-amber-500/30 border-amber-400 text-white ring-2 ring-amber-400' 
            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`;
      }
      const isCorrect = option === questions[currentQuestionIndex].answer;
      const isSelected = option === selectedAnswer;

      if(isCorrect) return `${baseClass} bg-green-500/30 border-green-400 text-white ring-2 ring-green-400`;
      if(isSelected && !isCorrect) return `${baseClass} bg-red-500/30 border-red-400 text-white ring-2 ring-red-400`;
      return `${baseClass} bg-white/5 border-white/10 opacity-50 cursor-not-allowed`;
  }

  if (quizState === 'loading') {
    return (
      <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 relative">
        <BackButton onClick={navigateBack} />
        <div className="text-center py-8">
          <div className="flex justify-center"><Spinner /></div>
          <p className="mt-4 text-amber-300 font-semibold">Summoning a {level} quiz...</p>
        </div>
      </div>
    );
  }

  if (quizState === 'error') {
    return (
       <div className="text-center p-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl relative">
        <BackButton onClick={navigateBack} />
        <p className="text-red-400 mb-4 p-4 bg-red-900/30 rounded-lg border border-red-500/50">🚨 {error}</p>
        <button onClick={fetchQuiz} className="bg-amber-500 text-gray-900 font-bold py-2 px-6 rounded-lg hover:bg-amber-400 transition-colors transform active:scale-95">Try Again</button>
      </div>
    );
  }

  if (quizState === 'finished') {
    return (
      <div className="text-center p-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-sm text-gray-400 mb-4">({level} Level)</p>
        <p className="text-xl text-gray-300 mb-6">Your final score is:</p>
        <p className="text-6xl font-extrabold text-white mb-8">{finalScore} / {questions.length}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <button onClick={() => window.location.reload()} className="bg-white/10 text-white font-bold py-3 px-5 sm:px-6 rounded-lg hover:bg-white/20 transition-colors transform active:scale-95">Main Menu</button>
          <button onClick={fetchQuiz} className="bg-amber-500 text-gray-900 font-bold py-3 px-5 sm:px-6 rounded-lg hover:bg-amber-400 transition-colors transform active:scale-95">Try New Quiz</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Question {currentQuestionIndex + 1}/{questions.length}</h2>
          <p className="text-xs text-gray-400">{level} Level</p>
        </div>
        <span className="text-lg font-semibold text-white px-3 py-1 bg-white/10 rounded-lg">Score: {score}</span>
      </div>
      <div className="bg-black/20 p-4 rounded-lg border border-white/10 mb-6 min-h-[100px] flex items-center">
        <p className="text-lg text-gray-200">{currentQuestion.question}</p>
      </div>
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => (
          <button key={index} onClick={() => quizState === 'active' && setSelectedAnswer(option)} disabled={quizState !== 'active'} className={getOptionClass(option)}>
            {option}
          </button>
        ))}
      </div>
       
       {quizState === 'feedback' && (
        <div className="text-center my-4 p-4 rounded-lg border bg-black/30">
          {selectedAnswer === currentQuestion.answer ? (
            <p className="font-bold text-xl text-green-400">Correct!</p>
          ) : (
            <div>
              <p className="font-bold text-xl text-red-400">Incorrect!</p>
              <p className="text-gray-300 mt-2">
                Correct answer: <span className="font-semibold text-green-400">{currentQuestion.answer}</span>
              </p>
            </div>
          )}
        </div>
      )}

       {quizState === 'active' && (
          <button onClick={handleAnswerSubmit} disabled={selectedAnswer === null} className="w-full bg-amber-500 text-gray-900 font-bold py-3 rounded-lg hover:bg-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors transform active:scale-95 shadow-lg hover:shadow-amber-500/30">Submit</button>
        )}
        {quizState === 'feedback' && (
          <button onClick={handleNextQuestion} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-400 transition-colors transform active:scale-95 shadow-lg hover:shadow-blue-500/30">
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
    </div>
  );
};

export default QuizView;