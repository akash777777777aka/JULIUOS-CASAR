import React, { useState } from 'react';
import * as authService from '../../services/authService';
import Spinner from '../common/Spinner';

interface LoginViewProps {
  onSwitchToSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await authService.signInWithEmailPassword(email, password);
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred.";
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMessage = "Incorrect email or password.";
      }
      setError(errorMessage);
      setIsLoading(false);
    }
  };
  
  const renderInput = (id: string, type: string, label: string, value: string, onChange: (val: string) => void) => (
      <div>
          <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
          <input
            type={type}
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all placeholder:text-gray-500"
            placeholder={type === 'email' ? 'you@example.com' : '••••••••'}
          />
      </div>
  );

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 sm:p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome Back</h2>
      
      <form onSubmit={handleLogin} className="space-y-6">
        {renderInput('email', 'email', 'Email', email, setEmail)}
        {renderInput('password', 'password', 'Password', password, setPassword)}
        
        {error && <p className="text-red-400 text-sm text-center p-3 bg-red-900/30 rounded-lg border border-red-500/50">🚨 {error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 text-base sm:text-lg rounded-lg hover:bg-amber-400 md:bg-amber-400 md:hover:bg-amber-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-amber-500/30 flex justify-center items-center h-12"
        >
          {isLoading ? <Spinner /> : 'Sign In'}
        </button>
      </form>
      
      <p className="text-center text-gray-400 mt-6 text-sm">
        Don't have an account?{' '}
        <button onClick={onSwitchToSignUp} className="font-semibold text-amber-400 hover:text-white underline">
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default LoginView;