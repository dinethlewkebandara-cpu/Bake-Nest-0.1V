import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Calendar, Cake, MessageSquare, Scale, CheckCircle2, Star, Loader2 } from 'lucide-react';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function CustomCakeForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cakeType: 'Birthday Celebration',
    flavor: 'Chocolate',
    weight: '1kg',
    message: '',
    deliveryDate: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("Please sign in or register to book a custom cake.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'custom_cakes'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, 'create', 'custom_cakes');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[40px] shadow-xl border border-bakery-accent/10"
        >
          <div className="w-20 h-20 bg-bakery-accent text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-4xl font-serif text-bakery-brown mb-4">Request Received!</h2>
          <p className="text-bakery-brown/60 mb-8 italic">
            Thank you for choosing BakeNest. Our pasty chefs will review your custom cake request and contact you within 24 hours to confirm the details.
          </p>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-bakery-accent font-semibold hover:underline"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-serif text-bakery-brown mb-4">Craft Your Dream Cake</h2>
        <p className="text-bakery-brown/60 max-w-lg mx-auto italic">Tell us your vision, and we'll bring it to life with the finest ingredients and artistic flair.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[50px] shadow-xl border border-bakery-brown/5">
        <div className="space-y-8">
          <img 
            src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop" 
            alt="Custom Cake Samples" 
            className="rounded-3xl h-full object-cover shadow-inner"
            referrerPolicy="no-referrer"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-tighter opacity-50 block mb-1">
              Cake Occasion
            </label>
            <select 
              className="w-full p-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm focus:ring-2 focus:ring-bakery-accent/20 outline-none"
              value={formData.cakeType}
              onChange={(e) => setFormData({...formData, cakeType: e.target.value})}
            >
              <option>Birthday Celebration</option>
              <option>Wedding Anniversary</option>
              <option>Corporate Event</option>
              <option>Other Event</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-tighter opacity-50 block mb-1">
                Base Flavor
              </label>
              <select 
                className="w-full p-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm focus:ring-2 focus:ring-bakery-accent/20 outline-none"
                value={formData.flavor}
                onChange={(e) => setFormData({...formData, flavor: e.target.value})}
              >
                <option>Dark Chocolate</option>
                <option>Classic Vanilla</option>
                <option>Red Velvet</option>
                <option>Lemon Raspberry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-tighter opacity-50 block mb-1">
                Weight
              </label>
              <select 
                className="w-full p-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm focus:ring-2 focus:ring-bakery-accent/20 outline-none"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              >
                <option>1.0 kg</option>
                <option>2.5 kg</option>
                <option>5.0 kg+</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-tighter opacity-50 block mb-1">
              Personal Message
            </label>
            <input 
              type="text"
              placeholder="e.g., Happy 25th Birthday, Sarah!"
              className="w-full p-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm placeholder:opacity-30 outline-none focus:ring-2 focus:ring-bakery-accent/20"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-tighter opacity-50 block mb-1">
              Delivery Date
            </label>
            <input 
              type="date"
              required
              className="w-full p-3 bg-bakery-cream border border-bakery-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-bakery-accent/20"
              value={formData.deliveryDate}
              onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#FFB7B2] hover:bg-[#FFD1DC] text-bakery-ink font-bold rounded-2xl mt-4 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Book My Cake"}
          </button>
        </form>
      </div>
    </div>
  );
}
