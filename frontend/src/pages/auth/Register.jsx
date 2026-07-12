import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    // Form Field States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(''); // Fleet Manager, Driver, Safety Officer, Financial Analyst

    // Interactive UI States
    const [showPassword, setShowPassword] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [shouldShake, setShouldShake] = useState(false);

    const rolesList = [
        { id: 'fleet_manager', label: 'Fleet Manager' },
        { id: 'driver', label: 'Driver' },
        { id: 'safety_officer', label: 'Safety Officer' },
        { id: 'financial_analyst', label: 'Financial Analyst' }
    ];

    // Validation & Submission Handling
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setShouldShake(false);

        // Form Valdation Checks
        if (!name.trim()) {
            triggerError('Please enter your full legal name.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            triggerError('Please enter a valid corporate email address.');
            return;
        }
        if (!password || password.length < 6) {
            triggerError('Security password must be at least 6 characters.');
            return;
        }
        if (!selectedRole) {
            triggerError('Please select your dispatch grid operational role.');
            return;
        }
        console.log('Registering with:', { name, email, password, role_name: selectedRole });
        console.log('selectedRole: ', selectedRole);

        setIsLoading(true);
        try {
            // NOTE: role_name is sent as the human-readable label (e.g.
            // "Fleet Manager") to match constants/permissions.js. Confirm
            // this against what your FastAPI backend actually expects —
            // it may want the snake_case id (e.g. "fleet_manager") instead.
            await register({ name, email, password, role_name: selectedRole });
            navigate('/login', { state: { registered: true, registeredEmail: email } });
        } catch (err) {
            const message =
                err.response?.data?.detail ||
                'Could not create account. That email may already be registered.';
            triggerError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerError = (msg) => {
        setFormError(msg);
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
    };

    const selectRoleOption = (roleLabel) => {
        setSelectedRole(roleLabel);
        setIsDropdownOpen(false);
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

            {/* Enterprise Form Register Card (White & Orange) */}
            <section className="bg-white border border-slate-200/85 rounded-2xl w-full max-w-md p-6 sm:p-8 md:p-10 shadow-xl shadow-slate-900/5 transition-all relative overflow-hidden flex flex-col justify-between min-h-[640px]">

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
                            Create operator profile
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-medium">
                            Register your terminal credentials to request active network keys.
                        </p>
                    </div>

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

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">

                        {/* Input 1: Name */}
                        <div>
                            <label htmlFor="name-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name-input"
                                    name="name"
                                    type="text"
                                    required
                                    disabled={isLoading}
                                    placeholder="e.g. Alex Rivera"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                            </div>
                        </div>

                        {/* Input 2: Email */}
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

                        {/* Input 3: Password */}
                        <div>
                            <label htmlFor="password-input" className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Security Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password-input"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={isLoading}
                                    placeholder="Minimum 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-11 pr-12 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-medium transition-all"
                                />
                                <span className="absolute left-4 top-3 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </span>

                                {/* Reveal password button */}
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

                        {/* Input 4: Role Custom Dropdown */}
                        <div className="relative">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Assign System Role
                            </label>

                            {/* Dropdown Button */}
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                disabled={isLoading}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 text-left focus:outline-none focus:ring-4 focus:ring-orange-500/10 font-semibold transition-all flex items-center justify-between cursor-pointer"
                            >
                                <span className={selectedRole ? "text-slate-800" : "text-slate-400 font-normal"}>
                                    {selectedRole || 'Choose your role...'}
                                </span>

                                {/* Arrow Caret */}
                                <svg
                                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Panel Items */}
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop element to close the dropdown */}
                                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />

                                    <div className="absolute left-0 right-0 mt-2 z-20 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden py-1">
                                        {rolesList.map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => selectRoleOption(role.label)}
                                                className={`w-full px-4 py-2 text-xs font-bold text-slate-700 text-left hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center justify-between cursor-pointer ${selectedRole === role.label ? 'bg-orange-50/50 text-orange-600' : ''
                                                    }`}
                                            >
                                                <span>{role.label}</span>
                                                {selectedRole === role.label && (
                                                    <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Submit Button */}
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
                                    <span>Provisioning Operator Node...</span>
                                </>
                            ) : (
                                <span>Register Operator Account</span>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer links to navigate to login */}
                <div className="flex flex-col items-center gap-4 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-5 mt-6">
                    <p>
                        Already registered?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            Sign In to Console
                        </button>
                    </p>
                    <span>TransitOps Control Center</span>
                </div>

            </section>

        </div>
    );
}