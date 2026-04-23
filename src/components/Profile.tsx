import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Save, Loader2, CheckCircle, Phone, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, verifyBeforeUpdateEmail, sendEmailVerification } from 'firebase/auth';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    phone: '',
    photoURL: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.currentUser) return;
      
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            displayName: data.displayName || '',
            email: auth.currentUser.email || '',
            phone: data.phone || '',
            photoURL: auth.currentUser.photoURL || data.photoURL || ''
          });
        } else {
          setProfileData({
            firstName: '',
            lastName: '',
            displayName: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            phone: '',
            photoURL: auth.currentUser.photoURL || ''
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim() || profileData.displayName;

      // 1. Update Email if changed
      if (profileData.email !== user.email) {
        await verifyBeforeUpdateEmail(user, profileData.email);
        setError("An email verification link has been sent to your new email. Please verify it to complete the change.");
      }

      // 2. Update Firebase Auth Profile
      await updateProfile(user, { 
        displayName: fullName,
        photoURL: profileData.photoURL
      });

      // 3. Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: fullName,
        phone: profileData.phone,
        photoURL: profileData.photoURL,
        updatedAt: serverTimestamp()
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setError("For security, please log out and log back in before changing your email.");
      } else {
        setError(err.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-bakery-brown animate-spin mb-4" />
        <p className="text-serif text-bakery-brown/60 italic">Opening the pantry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-xl border border-bakery-brown/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-bakery-pink opacity-20 rounded-full -mr-16 -mt-16" />
        
        <div className="mb-10">
          <h2 className="text-4xl font-serif text-bakery-brown mb-2">Your Profile</h2>
          <p className="text-sm text-bakery-brown/60 italic">Manage your account details and preferences.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 text-sm rounded-xl border border-green-100 flex items-center gap-2 font-medium">
            <CheckCircle size={18} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent ml-2">First Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="First Name"
                    required
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all" 
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent ml-2">Last Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Last Name"
                    required
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all" 
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent ml-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all" 
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/20" size={20} />
              </div>
              <p className="text-[10px] text-bakery-accent italic ml-2">Changing email requires re-verification.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent ml-2">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  placeholder="Enter phone number"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all" 
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent ml-2">Profile Picture URL</label>
              <div className="relative">
                <input 
                  type="url" 
                  placeholder="Paste image link"
                  value={profileData.photoURL}
                  onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20 focus:border-bakery-accent transition-all" 
                />
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-bakery-brown/30" size={20} />
              </div>
              {profileData.photoURL && (
                <div className="mt-2 text-center">
                  <img src={profileData.photoURL} alt="Preview" className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-bakery-accent" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={saving}
              className="w-full py-4 bg-bakery-brown text-white rounded-2xl font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  <Save size={18} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-10 border-t border-bakery-brown/5 text-center">
          <p className="text-xs text-bakery-brown/40 uppercase tracking-[0.2em] font-bold">
            Account Status: {auth.currentUser?.emailVerified ? 'Verified Nest Member' : 'Pending Verification'}
          </p>
          {!auth.currentUser?.emailVerified && (
            <p className="mt-2 text-xs text-bakery-accent italic">
              Please check your inbox to verify your account and unlock all features.
            </p>
          )}
        </div>

        {/* Admin Section */}
        {auth.currentUser?.email === 'dinethlewkebandara@gmail.com' && (
          <div className="mt-12 pt-10 border-t border-bakery-brown/10">
            <div className="flex items-center gap-2 mb-6">
              <ShieldAlert className="text-bakery-accent" />
              <h3 className="text-xl font-serif text-bakery-brown font-bold tracking-tight">Admin Controls</h3>
            </div>
            
            <div className="bg-bakery-cream/30 p-6 rounded-3xl border border-bakery-brown/5 space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-bakery-brown/40">Force Password Reset</p>
              <div className="space-y-4">
                <input 
                  id="admin-target-uid"
                  placeholder="Target User UID" 
                  className="w-full px-4 py-3 bg-white rounded-xl border border-bakery-border outline-none text-sm"
                />
                <input 
                  id="admin-new-password"
                  type="password"
                  placeholder="New Password" 
                  className="w-full px-4 py-3 bg-white rounded-xl border border-bakery-border outline-none text-sm"
                />
                <button 
                  onClick={async () => {
                    const targetUid = (document.getElementById('admin-target-uid') as HTMLInputElement).value;
                    const newPassword = (document.getElementById('admin-new-password') as HTMLInputElement).value;
                    if (!targetUid || !newPassword) return alert("Fill all fields");
                    
                    try {
                      const token = await auth.currentUser?.getIdToken();
                      const response = await fetch('/api/admin/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ targetUid, newPassword, adminToken: token })
                      });
                      const data = await response.json();
                      if (data.error) throw new Error(data.error);
                      alert("Password reset successfully!");
                    } catch (err: any) {
                      alert(err.message);
                    }
                  }}
                  className="w-full py-3 bg-bakery-accent text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
