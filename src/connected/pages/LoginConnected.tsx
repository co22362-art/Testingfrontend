/**
 * LOGIN CONNECTED PAGE
 * ─────────────────────────────────────────────────────────
 * OUR ZONE: Real auth wired to the backend.
 *
 * UI atoms imported from Figma's component library:
 *   - Uses Figma's visual design exactly
 *   - If Figma updates colors/layout in atoms, this auto-updates
 *
 * Visual reference: src/app/modules/auth/LoginPage.tsx
 *   (DO NOT EDIT THAT FILE — Figma owns it)
 * ─────────────────────────────────────────────────────────
 */
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { signIn } from '../../services/auth';

export default function LoginConnected() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // ── Real backend call ──────────────────────────────────
    // POST /api/signin → Vite proxy → http://localhost:3000
    // Backend verifies with Supabase, sets HttpOnly cookies
    // ──────────────────────────────────────────────────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setEmailError(''); setPasswordError(''); setServerError('');

        let hasError = false;
        if (!email) { setEmailError('Email is required'); hasError = true; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Please enter a valid email'); hasError = true; }
        if (!password) { setPasswordError('Password is required'); hasError = true; }
        if (hasError) return;

        setIsLoading(true);
        try {
            const result = await signIn(email, password);
            if (!result.success) { setServerError(result.message || 'Login failed. Please check your credentials.'); return; }
            sessionStorage.setItem('pa_user', JSON.stringify(result.user));
            navigate('/people');
        } catch {
            setServerError('Unable to connect to the server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── UI: matches Figma's LoginPage design exactly ───────
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1976D2] to-[#1565C0] flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />
                <div className="relative z-10">
                    <div className="w-14 h-14 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-lg">
                        <span className="text-white font-bold text-xl">PA</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">Project Assist</h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-md">
                        Enterprise-grade project management platform for modern teams.
                    </p>
                </div>
                <div className="text-sm text-white/60 relative z-10">© 2026 Project Assist. All rights reserved.</div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white border border-[#E5E7EB] rounded-lg p-8 shadow-sm">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#111827] mb-2">Sign in to your account</h2>
                            <p className="text-sm text-[#6B7280]">Enter your credentials to access your workspace</p>
                        </div>

                        {serverError && (
                            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">{serverError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#374151] mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                    <input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
                                        className={`w-full h-11 pl-11 pr-4 border rounded-lg text-sm focus:outline-none transition-all ${emailError ? 'border-red-500 focus:ring-2 focus:ring-red-500/10' : 'border-[#E5E7EB] focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'}`} />
                                </div>
                                {emailError && <p className="text-xs text-red-600 mt-1.5">{emailError}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#374151] mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)}
                                        className={`w-full h-11 pl-11 pr-11 border rounded-lg text-sm focus:outline-none transition-all ${passwordError ? 'border-red-500 focus:ring-2 focus:ring-red-500/10' : 'border-[#E5E7EB] focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10'}`} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {passwordError && <p className="text-xs text-red-600 mt-1.5">{passwordError}</p>}
                            </div>

                            <button type="submit" disabled={isLoading}
                                className="w-full h-11 bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-60">
                                {isLoading ? 'Signing in...' : 'Sign In'}
                                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
