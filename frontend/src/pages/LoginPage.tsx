import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../lib/auth';
import { ApiError } from '../lib/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate('/manga');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('發生未知錯誤，請稍後再試');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark px-4">
      <div className="w-full max-w-md bg-bg-card-light dark:bg-bg-card-dark border-2 border-text-light dark:border-text-dark rounded-pixel-lg shadow-pixel p-8">
        <h1 className="text-2xl font-pixel text-center text-text-light dark:text-text-dark mb-2">
          Pocketit
        </h1>
        <p className="text-center text-text-muted-light dark:text-text-muted-dark mb-8">
          {isRegister ? '建立新帳號' : '登入你的帳號'}
        </p>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300 px-4 py-2 rounded-pixel-sm mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text-light dark:text-text-dark mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-light dark:text-text-dark mb-1">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-2 rounded-pixel-sm border-2 border-text-muted-light dark:border-text-muted-dark focus:border-pixel-primary bg-white dark:bg-gray-800 text-text-light dark:text-text-dark"
              placeholder="至少 6 個字元"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full pixel-button pixel-button-primary disabled:opacity-50"
          >
            {loading ? '處理中...' : isRegister ? '註冊' : '登入'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-pixel-primary hover:underline text-sm"
          >
            {isRegister ? '已有帳號？登入' : '沒有帳號？註冊'}
          </button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-text-muted-light dark:text-text-muted-dark hover:text-pixel-primary text-sm"
          >
            ← 返回首頁
          </button>
        </div>
      </div>
    </div>
  );
};
