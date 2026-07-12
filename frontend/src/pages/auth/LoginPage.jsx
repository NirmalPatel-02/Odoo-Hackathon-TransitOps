import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    // State Management
    const [operatorId, setOperatorId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [shouldShake, setShouldShake] = useState(false);
    const [registrationSuccessMsg, setRegistrationSuccessMsg] = useState('');

    // Check for navigation states (registration success callback)
    useEffect(() => {
        if (location.state?.registered) {
            setRegistrationSuccessMsg(`Operator Profile created successfully for ${location.state.registeredEmail}. Enter security key below to sync your terminal connection.`);
            // Clear navigation history state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Field validation and submit simulation
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        setRegistrationSuccessMsg('');
        setShouldShake(false);

        // Basic Validation
        if (!operatorId.trim()) {
            triggerError('Operator ID or Email is required.');
            return;
        }
        if (!password || password.length < 4) {
            triggerError('Security password must be at least 4 characters.');
            return;
        }

        setIsLoading(true);

        // Simulate authentic latency check (SaaS loading states)
        setTimeout(() => {
            // Mock credentials check
            const idStr = operatorId.toLowerCase();
            if (
                (idStr.includes('admin') && password === 'admin') ||
                (idStr.includes('dispatch') && password === 'dispatch') ||
                (idStr.includes('transit') && password === 'transitops')
            ) {
                setIsLoading(false);
                navigate('/dashboard');
            } else {
                setIsLoading(false);
                triggerError('Verification Failure: Invalid Operator ID or Security Password.');
            }
        }, 1200);
    };

    const triggerError = (msg) => {
        setFormError(msg);
        setShouldShake(true);
        // Remove shake class after animation completes so it can trigger again on next failure
        setTimeout(() => setShouldShake(false), 500);
    };

    // Quick fill helper for hackathon judges
    const fillCredentials = (role) => {
        if (role === 'admin') {
            setOperatorId('admin@transitops.com');
            setPassword('admin');
        } else if (role === 'dispatcher') {
            setOperatorId('dispatcher.ops@transitops.com');
            setPassword('dispatch');
        }
        setFormError('');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 select-none font-sans">

            {/* Dynamic inline styles for premium micro-animations (shake) */}
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

            {/* Enterprise Form Login (White & Orange) */}
            <section className="bg-white border border-slate-200/85 rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5 transition-all relative overflow-hidden flex flex-col justify-between min-h-[580px]">

                {/* Top company brand logo block */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                        {/* SVG Logo: route node + direction caret */}
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <span className="text-slate-900 font-extrabold text-lg tracking-tight block">Transit<span className="text-orange-600">Ops</span></span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">Odoo Smart Logistics</span>
                    </div>
                </div>

                {/* Core Form Card */}
                <div className={`w-full ${shouldShake ? 'animate-shake' : ''}`}>

                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">
                            Enter your control room credentials to access real-time dispatch systems.
                        </p>
                    </div>

                    {/* Registration Success Alert */}
                    {registrationSuccessMsg && (
                        <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                            <div className="text-emerald-600 mt-0.5">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                                </svg>
                            </div>
                            <div className="text-xs font-semibold text-emerald-800 leading-relaxed">
                                {registrationSuccessMsg}
                            </div>
                        </div>
                    )}

                    {/* Form Error Notice Box */}
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

                        {/* Input 1: Operator ID */}
                        <div>
                            <label htmlFor="operator-id" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Operator ID / Corporate Email
                            </label>
                            <div className="relative">
                                <input
                                    id="operator-id"
                                    name="operatorId"
                                    type="text"
                                    autoComplete="username"
                                    spellCheck="false"
                                    required
                                    disabled={isLoading}
                                    placeholder="e.g. dispatcher.ops@transitops.com"
                                    value={operatorId}
                                    onChange={(e) => setOperatorId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3.5 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Input 2: Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="security-key" className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Security Passkey
                                </label>
                                <button
                                    type="button"
                                    onClick={() => alert('Operational Note: Please contact system coordinator to reset hardware MFA passkey tokens.')}
                                    className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    Forgot Key?
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    id="security-key"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    disabled={isLoading}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-12 py-3 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3.5 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>

                                {/* Reveal password button */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
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

                        {/* Checkbox settings */}
                        <div className="flex items-center justify-between text-xs py-1">
                            <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500/20"
                                />
                                Remember this terminal session
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-orange-500/20 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Authenticating Operator Connection...</span>
                                </>
                            ) : (
                                <span>Establish Secure Session</span>
                            )}
                        </button>
                    </form>

                    {/* Quick-Login profile helper cards for hackathon judging */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block mb-3 font-mono text-center">
                            Developer & Judge Quick Authentication Profiles
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => fillCredentials('admin')}
                                className="flex flex-col p-2.5 rounded-xl border border-slate-200 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/10 text-left transition-all group focus:outline-none cursor-pointer text-slate-700"
                            >
                                <span className="text-[10px] font-extrabold text-slate-800 block group-hover:text-orange-600 transition-colors">Admin / Fleet Director</span>
                                <span className="text-[9px] text-slate-500 mt-0.5 font-mono">ID: admin | Pass: admin</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fillCredentials('dispatcher')}
                                className="flex flex-col p-2.5 rounded-xl border border-slate-200 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/10 text-left transition-all group focus:outline-none cursor-pointer text-slate-700"
                            >
                                <span className="text-[10px] font-extrabold text-slate-800 block group-hover:text-orange-600 transition-colors">Dispatcher / Ops</span>
                                <span className="text-[9px] text-slate-500 mt-0.5 font-mono">ID: dispatch | Pass: dispatch</span>
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer info links */}
                <div className="flex flex-col items-center gap-4 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-5 mt-6">
                    <p>
                        Don't have an operator profile?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-orange-600 hover:text-orange-700 transition-colors font-extrabold cursor-pointer"
                        >
                            Request Access
                        </button>
                    </p>
                    <div className="flex justify-between w-full">
                        <span>TransitOps Control Center</span>
                        <button
                            type="button"
                            onClick={() => alert('Support Telemetry: TransitOps secure systems administrator line is reachable at support@transitops.com')}
                            className="hover:text-orange-600 transition-colors"
                        >
                            System Support
                        </button>
                    </div>
                </div>

            </section>

        </div>
    );
}

export default Login;