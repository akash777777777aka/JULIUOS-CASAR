import React, { useState } from 'react';
import * as authService from '../../services/authService';
import Spinner from '../common/Spinner';

interface SignUpViewProps {
  onSwitchToLogin: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authService.signUpWithEmailPassword(email, password);
    } catch (err: any) {
      let errorMessage = "An unexpected error occurred.";
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Please enter a valid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password must be at least 6 characters long.";
          break;
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
      <h2 className="text-2xl font-bold text-center text-white mb-6">Create an Account</h2>
      
      <form onSubmit={handleSignUp} className="space-y-6">
        {renderInput('signup-email', 'email', 'Email', email, setEmail)}
        {renderInput('signup-password', 'password', 'Password', password, setPassword)}
        {renderInput('confirm-password', 'password', 'Confirm Password', confirmPassword, setConfirmPassword)}
        
        {error && <p className="text-red-400 text-sm text-center p-3 bg-red-900/30 rounded-lg border border-red-500/50">🚨 {error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-gray-900 font-bold py-3 px-4 text-base sm:text-lg rounded-lg hover:bg-amber-400 md:bg-amber-400 md:hover:bg-amber-300 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform active:scale-95 shadow-lg hover:shadow-amber-500/30 flex justify-center items-center h-12"
        >
          {isLoading ? <Spinner /> : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center text-gray-400 mt-6 text-sm">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-semibold text-amber-400 hover:text-white underline">
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUpView;