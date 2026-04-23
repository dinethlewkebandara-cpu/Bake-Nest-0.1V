import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Loader2 } from 'lucide-react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (!userCredential.user.emailVerified) {
          setError("Please verify your email address before logging in.");
        } else {
          onLogin();
        }
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Update Firebase Auth profile
        await updateProfile(user, { displayName: formData.fullName });
        
        // Send verification email
        await sendEmailVerification(user);

        // Create Firestore profile
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: formData.fullName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, 'create', `users/${user.uid}`);
        }

        setError("Registration successful! Please check your email and verify your account before logging in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setError("Sign-in method not enabled. Please enable 'Email/Password' in your Firebase Console Authentication settings.");
      } else {
        setError(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-white p-10 md:p-12 rounded-[50px] shadow-2xl border border-bakery-brown/5 relative overflow-hidden">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-bakery-pink opacity-20 rounded-full -mr-16 -mt-16" />
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-bakery-brown mb-2">
            {isLogin ? 'Hello Again!' : 'Join the Nest'}
          </h2>
          <p className="text-sm text-bakery-brown/60 italic">
            {isLogin ? 'Welcome back to your favorite bakery.' : 'Create an account for rewards and faster checkout.'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${error.includes('successful') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required={!isLogin}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:border-bakery-accent" 
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:border-bakery-accent" 
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:border-bakery-accent" 
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
            </div>
            {isLogin && (
              <button type="button" className="text-xs text-bakery-accent font-bold uppercase tracking-widest hover:underline block ml-auto">
                Forgot password?
              </button>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-bakery-brown text-white rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-full h-px bg-bakery-brown/10" />
            <span className="absolute bg-white px-4 text-xs text-bakery-brown/40 uppercase tracking-widest">Or continue with</span>
          </div>
          
          <button className="w-full py-3 border border-bakery-brown/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-bakery-cream transition-colors">
            <Github size={20} />
            <span className="text-sm font-medium">Github</span>
          </button>
        </div>

        <p className="mt-10 text-center text-sm text-bakery-brown/60">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-bakery-accent font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
