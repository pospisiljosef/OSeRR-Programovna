import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ScoutLilieLogo } from './Header';
import { 
  X, 
  LogIn, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Compass
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    fastScoutLogin, 
    error, 
    clearError 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'fast'>('fast');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLocalErr(null);
    clearError();
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setLocalErr(err.message || 'Přihlášení přes Google se nezdařilo.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalErr(null);
    clearError();

    try {
      if (mode === 'fast') {
        if (!email.trim() || !displayName.trim()) {
          setLocalErr('Vyplňte prosím e-mail a přezdívku/jméno.');
          setLoading(false);
          return;
        }
        await fastScoutLogin(displayName, email, unitName);
        onClose();
      } else if (mode === 'login') {
        await loginWithEmail(email, password);
        onClose();
      } else {
        await registerWithEmail(email, password, displayName || email.split('@')[0], unitName);
        onClose();
      }
    } catch (err: any) {
      setLocalErr(err.message || 'Chyba při přihlašování.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn">
      <div className="relative bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with scout fleur-de-lis */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <ScoutLilieLogo className="w-14 h-14 mx-auto drop-shadow-md" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            Přihlášení do Programovny
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Pro vkládání nových programů, psaní hodnocení a ukládání oblíbených
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            onClick={() => { setMode('fast'); setLocalErr(null); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'fast'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Rychlé e-mailem
          </button>
          <button
            onClick={() => { setMode('login'); setLocalErr(null); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'login'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Přihlásit heslem
          </button>
          <button
            onClick={() => { setMode('register'); setLocalErr(null); }}
            className={`flex-1 py-2 rounded-lg transition ${
              mode === 'register'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Registrovat
          </button>
        </div>

        {/* Google One-Click Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Pokračovat s Google účtem</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-stone-400 font-medium uppercase">nebo e-mailem</span>
          <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
        </div>

        {/* Error message */}
        {(error || localErr) && (
          <div className="p-3 my-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error || localErr}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3 mt-2">
          
          {/* Display Name / Nickname for fast and register */}
          {(mode === 'fast' || mode === 'register') && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Skautská přezdívka nebo jméno
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="např. Javor, Bobr nebo Jana Nováková"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              E-mailová adresa
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="skaut@oddil.cz"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password for standard login/register */}
          {mode !== 'fast' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Heslo (min. 6 znaků)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Unit / Středisko (optional) */}
          {(mode === 'fast' || mode === 'register') && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Oddíl / středisko (nepovinné)
              </label>
              <div className="relative">
                <Compass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  placeholder="např. 5. oddíl Vlčat, Středisko Dvojka"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Připojuji se...</span>
            ) : mode === 'fast' ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Rychle vstoupit do aplikace</span>
              </>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Přihlásit se</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>Zaregistrovat a přihlásit</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[11px] text-stone-400 text-center mt-4">
          Data programu jsou uložena v zabezpečené cloudové databázi na vašem účtu.
        </p>

      </div>
    </div>
  );
};
