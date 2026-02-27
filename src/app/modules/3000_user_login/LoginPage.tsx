import { useState, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import structIQeLogo from 'figma:asset/1ef35a9403b2d1d301197ac61939f562bd4cdc8e.png';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginPageProps {
  logoUrl?: string;
  onSubmit?: (credentials: LoginCredentials) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface Slide {
  id: number;
  image: string;
  headline: string;
  subtext: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/engineering-team/1920/1080',
    headline: 'Built for engineering teams.',
    subtext: 'Manage projects, people, and timelines in one place.'
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/construction-aerial/1920/1080',
    headline: 'Every project. Every detail.',
    subtext: 'From kickoff to delivery — nothing falls through the cracks.'
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/cad-architect/1920/1080',
    headline: 'Your designs, tracked precisely.',
    subtext: 'CAD files, revisions, and approvals — all in one workflow.'
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/team-structure/1920/1080',
    headline: 'From blueprint to reality.',
    subtext: 'Project Assist powers the teams that build the world.'
  }
];

export default function LoginPage({
  logoUrl,
  onSubmit,
  isLoading = false,
  error = null
}: LoginPageProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    
    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (!hasError) {
      if (onSubmit) {
        onSubmit({ email, password });
      } else {
        // Default behavior for Figma preview
        console.log('Login attempt:', { email, password });
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Company Logo - Top Right Corner */}
      <div className="absolute top-6 right-6 z-20">
        <div className="inline-block px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
          <img 
            src={structIQeLogo} 
            alt="structIQe Logo" 
            className="h-10 w-auto"
          />
        </div>
      </div>

      {/* LEFT PANEL - Image Slider */}
      <div className="relative w-1/2 h-full hidden lg:block">
        {/* Slides */}
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[600ms] ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.headline}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-12">
              <h2 className="text-4xl font-bold text-white mb-2">
                {slide.headline}
              </h2>
              <p className="text-base text-white/80 mb-12">
                {slide.subtext}
              </p>
            </div>
          </div>
        ))}

        {/* Logo and Branding - Top Left */}
        <div className="absolute top-12 left-24 z-10">
          <h1 className="text-5xl font-bold text-white mb-4">PROJECT Assist</h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-md">
            Enterprise-grade project management platform for modern teams.
          </p>
        </div>

        {/* Dot Indicators - Bottom Left */}
        <div className="absolute bottom-20 left-12 flex gap-2 z-10">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Copyright - Bottom Left */}
        <div className="absolute bottom-8 left-12 text-sm text-white/60 z-10">
          © 2026 structiQe Technologies Pvt Ltd. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          {logoUrl && (
            <div className="mb-8 flex justify-center lg:justify-start">
              <img
                src={logoUrl}
                alt="Company Logo"
                className="w-[140px] h-auto"
              />
            </div>
          )}

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your workspace
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={`w-full h-11 px-4 border rounded-lg text-sm bg-input-background text-foreground placeholder-muted-foreground focus:outline-none transition-all ${
                  emailError
                    ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                    : 'border-border focus:border-primary focus:ring-2 focus:ring-ring/20'
                } ${isLoading ? 'bg-muted cursor-not-allowed' : ''}`}
              />
              {emailError && (
                <p className="text-xs text-destructive mt-1.5">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`w-full h-11 px-4 pr-11 border rounded-lg text-sm bg-input-background text-foreground placeholder-muted-foreground focus:outline-none transition-all ${
                    passwordError
                      ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20'
                      : 'border-border focus:border-primary focus:ring-2 focus:ring-ring/20'
                  } ${isLoading ? 'bg-muted cursor-not-allowed' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-destructive mt-1.5">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                disabled={isLoading}
                className="text-sm text-primary hover:opacity-80 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 group ${
                isLoading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-white hover:opacity-90 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}