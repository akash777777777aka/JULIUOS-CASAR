import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import ActSceneQuestions from './components/ActSceneQuestions';
import CharacterQuestions from './components/CharacterQuestions';
import QuizView from './components/QuizView';
import ScoreView from './components/ScoreView';
import HistoryView from './components/HistoryView';
import DoubtSolverView from './components/DoubtSolverView';
import LoginView from './components/auth/LoginView';
import SignUpView from './components/auth/SignUpView';
import { View, User, QuestionLevel } from './types';
import * as authService from './services/authService';
import { LogoutIcon } from './components/icons/LogoutIcon';
import Spinner from './components/common/Spinner';
import { isFirebaseConfigured } from './firebaseConfig';
import FirebaseConfigNeeded from './components/auth/FirebaseConfigNeeded';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<View>(View.MENU);
  const [viewHistory, setViewHistory] = useState<View[]>([View.MENU]);
  const [showSignUp, setShowSignUp] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState<QuestionLevel>('High School');

  const navigateTo = (view: View) => {
    setViewHistory(prev => [...prev, view]);
    setCurrentView(view);
  };

  const navigateBack = () => {
    if (viewHistory.length <= 1) return;
    const history = [...viewHistory];
    history.pop();
    const prevView = history[history.length - 1] ?? View.MENU;
    setViewHistory(history);
    setCurrentView(prevView);
  };

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = authService.onAuthChange((user) => {
        setCurrentUser(user);
        setIsLoading(false);
        if (user) {
          setCurrentView(View.MENU);
          setViewHistory([View.MENU]);
          setShowSignUp(false);
        }
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    authService.signOutUser();
  };

  const renderView = () => {
    if (!currentUser && isFirebaseConfigured) return null;

    switch (currentView) {
      case View.ACT_SCENE:
        return <ActSceneQuestions setView={navigateTo} navigateBack={navigateBack} user={currentUser!} level={difficultyLevel} />;
      case View.CHARACTER:
        return <CharacterQuestions setView={navigateTo} navigateBack={navigateBack} user={currentUser!} level={difficultyLevel} />;
      case View.QUIZ:
        return <QuizView setView={navigateTo} navigateBack={navigateBack} user={currentUser!} level={difficultyLevel} />;
      case View.SCORE:
        return <ScoreView setView={navigateTo} navigateBack={navigateBack} user={currentUser!} />;
      case View.HISTORY:
        return <HistoryView setView={navigateTo} navigateBack={navigateBack} user={currentUser!} />;
      case View.DOUBT_SOLVER:
        return <DoubtSolverView setView={navigateTo} navigateBack={navigateBack} user={currentUser!} level={difficultyLevel} />;
      case View.MENU:
      default:
        return <MainMenu setView={navigateTo} level={difficultyLevel} setLevel={setDifficultyLevel} />;
    }
  };
  
  const isAuthView = !currentUser && isFirebaseConfigured;

  const renderContent = () => {
    if (!isFirebaseConfigured) {
      return <div className="p-4"><FirebaseConfigNeeded /></div>;
    }
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <Spinner />
          <p className="mt-4 text-gray-300">Loading Application...</p>
        </div>
      );
    }
    if (currentUser) {
        return (
          <div className="w-full">
            {renderView()}
          </div>
        );
    }
    
    // Auth Flow
    return showSignUp 
      ? <SignUpView onSwitchToLogin={() => setShowSignUp(false)} />
      : <LoginView onSwitchToSignUp={() => setShowSignUp(true)} />;
  };

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8 selection:bg-amber-500/30">
      <div className="max-w-xl mx-auto">
        <header className={`sticky top-0 z-20 transition-all duration-300 ${isAuthView ? 'mb-8' : 'mb-6'}`}>
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex justify-between items-center shadow-2xl">
              <div className="text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Julius Caesar Study
                  </h1>
                  <p className="text-xs text-gray-400">
                    {currentUser ? `Welcome, ${currentUser.email}` : 'Your Study Companion'}
                  </p>
              </div>
              {currentUser && isFirebaseConfigured && (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-10 w-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
                  aria-label="Logout"
                >
                  <LogoutIcon className="w-5 h-5"/>
                </button>
              )}
          </div>
        </header>
        <main>
          {renderContent()}
        </main>
        <footer className="text-center py-4 mt-8">
          <p className="text-sm text-gray-500 font-bold">King Brown</p>
        </footer>
      </div>
    </div>
  );
};

export default App;