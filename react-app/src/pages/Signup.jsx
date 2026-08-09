import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Signup = () => {
  const [step, setStep] = useState(1); // Tracks which form to show
  
  // Form Data
  const [email, setEmail] = useState('');
  const [secondaryEmail, setSecondaryEmail] = useState('');
  const [chessUsername, setChessUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [primaryOtp, setPrimaryOtp] = useState('');
  const [secondaryOtp, setSecondaryOtp] = useState('');

  // 💡 NEW STATE HOOKS: Added tracking states for core profile fields
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [contact, setContact] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- STEP 1: Send the OTP ---
  const handleSendDualOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (email.toLowerCase() === secondaryEmail.toLowerCase()) {
      setError("Secondary email must be different from your primary IITK email.");
      setIsLoading(false);
      return;
    }

    if (!chessUsername.trim()) {
      setError("Please enter your Chess.com username.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          secondary_email: secondaryEmail.trim(),
          chess_username: chessUsername.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
      } else {
        setSuccess('Verification code sent to your IITK email!');
        setStep(2); // Move to the OTP screen
      }
    } catch (err) {
      console.error("OTP Error:", err);
      setError('Cannot connect to the server. Is your Python backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  // --- STEP 2: Verify OTP & Register ---
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/verify-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          secondary_email: secondaryEmail,
          primary_otp: primaryOtp,
          secondary_otp: secondaryOtp,
          password: password,
          chess_username: chessUsername,
          name: name,
          rollNo: rollNo,
          contact: contact
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error("Registration Error:", err);
      setError('Cannot connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-surface-container-low p-10 rounded-3xl border border-outline-variant/10 shadow-2xl">
        <div>
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-surface-container-high border border-outline-variant/20 shadow-inner mb-6">
            <span className="material-symbols-outlined text-3xl text-primary font-light">
              {step === 1 ? 'person_add' : 'stacked_email'}
            </span>
          </div>
          <h2 className="text-center text-3xl font-serif font-bold tracking-tight text-on-surface">
            {step === 1 ? (
              <>
                Sign <span className="italic text-primary">Up</span>
              </>
            ) : (
              <>
                Dual Verify <span className="italic text-primary">Email</span>
              </>
            )}
          </h2>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center font-semibold bg-red-500/10 p-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 text-sm text-center font-semibold bg-green-500/10 p-3 rounded-lg">
            {success}
          </div>
        )}

        {/* --- FORM STEP 1: Details --- */}
        {step === 1 && (
          <form className="mt-8 space-y-5" onSubmit={handleSendDualOtp}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1.5 ml-1" htmlFor="full-name">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1.5 ml-1" htmlFor="roll-number">Roll Number</label>
                  <input
                    id="roll-number"
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="220123"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1.5 ml-1" htmlFor="contact-number">Contact No</label>
                  <input
                    id="contact-number"
                    type="tel"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="email-address">Email Address</label>
                <input
                  id="email-address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                  placeholder="student@iitk.ac.in"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-1.5 ml-1" htmlFor="secondary-email-address">Secondary Recovery Email</label>
                <input
                  id="secondary-email-address"
                  type="email"
                  required
                  value={secondaryEmail}
                  onChange={(e) => setSecondaryEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="personal_mail@gmail.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="chess-username">Chess.com ID</label>
                <input
                  id="chess-username"
                  type="text"
                  required
                  value={chessUsername}
                  onChange={(e) => setChessUsername(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                  placeholder="grandmaster_123"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 pr-12 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? 'Sending Codes...' : 'Create Account'}
              </button>
              <p className="text-center text-sm text-on-surface-variant mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:underline transition-all">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* --- FORM STEP 2: Dual OTP Verification --- */}
        {step === 2 && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyAndRegister}>
            <div className="space-y-5 rounded-md shadow-sm">
              <p className="text-center text-sm text-on-surface-variant mb-6">
                We sent two different 6-digit verification code to both your primary and secondary emails. Check both mails to continue.
              </p>
              {/* Primary Email OTP field */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 ml-1">
                  Primary Code ({email})
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={primaryOtp}
                  onChange={(e) => setPrimaryOtp(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-2.5 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-center tracking-[0.4em] font-mono font-bold transition-colors"
                  placeholder="000000"
                />
              </div>

              {/* Secondary Email OTP field */}
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-2 ml-1">
                  Secondary Code ({secondaryEmail})
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={secondaryOtp}
                  onChange={(e) => setSecondaryOtp(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-2.5 border border-outline-variant/20 bg-surface-container-lowest placeholder-on-surface-variant/30 text-on-surface rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-center tracking-[0.4em] font-mono font-bold transition-colors"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(242,202,80,0.3)] disabled:opacity-50 transition-all duration-300"
              >
                {isLoading ? 'Verifying...' : 'Verify & Join'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-sm font-bold text-on-surface-variant hover:text-primary transition-all"
              >
                ← Back to Edit Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;