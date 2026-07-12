import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // If we arrived here right after registering, prefill the email and
    // show a confirmation banner.
    const justRegistered = location.state?.registered;
    const registeredEmail = location.state?.registeredEmail || '';

    const [email, setEmail] = useState(registeredEmail);
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [shouldShake, setShouldShake] = useState(false);

    const triggerError = (msg) => {
        setFormError(msg);
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email.trim() || !email.includes('@')) {
            triggerError('Please enter a valid corporate email address.');
            return;
        }
        if (!password) {
            triggerError('Please enter your password.');
            return;
        }

        setIsLoading(true);
        try {
            const user = await login(email, password);
            // RBAC lands everyone on the dashboard; each page then reads
            // the role internally to decide what's visible/editable.
            navigate('/dashboard', { replace: true });
            void user;
        } catch (err) {
            const message =
                err.response?.data?.detail ||
                'Invalid email or password.';
            triggerError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 select-none font-sans">

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>

            <section className="bg-white border border-slate-200/85 rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5 transition-all relative overflow-hidden flex flex-col justify-between min-h-[560px]">

                {/* Brand block */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-slate-900 font-extrabold text-lg tracking-tight block">Transit<span className="text-orange-600">Ops</span></span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Odoo Smart Logistics</span>
                    </div>
                </div>

                <div className={`w-full ${shouldShake ? 'animate-shake' : ''}`}>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            Sign in to your console
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">
                            Enter your operator credentials to continue.
                        </p>
                    </div>

                    {/* Post-registration success banner */}
                    {justRegistered && !formError && (
                        <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                            <svg className="w-5 h-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <div className="text-xs font-semibold text-emerald-800 leading-relaxed">
                                Account created. Sign in with your new credentials below.
                            </div>
                        </div>
                    )}

                    {formError && (
                        <div className="mb-5 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                            <div className="text-orange-600 mt-0.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="text-xs font-semibold text-orange-800 leading-relaxed">
                                {formError}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label htmlFor="email-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Corporate Email Address
                            </label>
                            <div className="relative">
                                <input
                                    id="email-input"
                                    name="email"
                                    type="email"
                                    required
                                    disabled={isLoading}
                                    placeholder="user@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password-input"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-12 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/20 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Verifying credentials...</span>
                                </>
                            ) : (
                                <span>Sign In to Console</span>
                            )}
                        </button>
                    </form>

                </div>

                <div className="flex flex-col items-center gap-4 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-5 mt-6">
                    <p>
                        Don&apos;t have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            Register Operator Account
                        </button>
                    </p>
                    <span>TransitOps Control Center</span>
                </div>

            </section>

        </div>
    );
}