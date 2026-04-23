import { useState, FormEvent, useEffect } from 'react';
import { Star, Quote, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Timestamp | null;
  userId?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  useEffect(() => {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewData);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!auth.currentUser) {
      setError("Please sign in to write a review.");
      return;
    }

    setSubmitLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: auth.currentUser.uid,
        name: newReview.name || auth.currentUser.displayName || 'Anonymous Guest',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setNewReview({ name: '', rating: 5, comment: '' });
    } catch (err) {
      console.error(err);
      handleFirestoreError(err, 'create', 'reviews');
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif text-bakery-brown mb-4">Customer Stories</h2>
          <p className="text-bakery-brown/60 max-w-lg italic">Read why our community loves BakeNest, and share your own experience with us.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="px-8 py-4 bg-bakery-brown text-white rounded-full font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg"
        >
          Write a Review
        </button>
      </div>

      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-bakery-border mb-16"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-bakery-soft-brown">How was your experience?</h3>
            <button onClick={() => setShowForm(false)} className="text-bakery-brown/40 hover:text-bakery-brown uppercase text-xs font-bold tracking-widest">Cancel</button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent">Your Name</label>
                <input 
                  required
                  placeholder="e.g., Alex Thompson"
                  className="w-full p-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none focus:ring-2 focus:ring-bakery-accent/20"
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent">Rating</label>
                <div className="flex gap-2 p-4 bg-bakery-cream rounded-xl border border-bakery-border">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setNewReview({...newReview, rating: star})}
                      className={newReview.rating >= star ? "text-bakery-brown" : "text-bakery-brown/20"}
                    >
                      <Star size={24} fill={newReview.rating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-bakery-accent">Review Content</label>
              <textarea 
                required
                placeholder="What did you think of our treats?"
                className="w-full p-4 bg-bakery-cream rounded-xl border border-bakery-border outline-none h-32 resize-none focus:ring-2 focus:ring-bakery-accent/20"
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              />
            </div>
            <button 
              type="submit" 
              disabled={submitLoading}
              className="px-12 py-4 bg-bakery-brown text-white rounded-full font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitLoading ? <Loader2 className="animate-spin" size={18} /> : "Post Review"}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-bakery-brown animate-spin mb-4" />
            <p className="text-bakery-brown/40 italic">Polishing the stories...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-sm border border-bakery-border relative"
            >
              <Quote className="absolute top-8 right-10 text-bakery-pink h-12 w-12 opacity-50" />
              <div className="flex text-bakery-accent mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "opacity-20"} />
                ))}
              </div>
              <p className="text-bakery-brown/80 mb-8 italic leading-relaxed">"{review.comment}"</p>
              <div className="flex items-center gap-4 border-t border-bakery-brown/5 pt-6">
                <div className="w-10 h-10 bg-bakery-pink text-bakery-soft-brown rounded-full flex items-center justify-center font-serif font-bold uppercase">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-serif font-bold text-bakery-brown">{review.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-bakery-brown/40">{formatDate(review.createdAt)}</p>
                </div>
                <CheckCircle size={14} className="ml-auto text-bakery-accent" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-bakery-brown/40 italic">Be the first to share your story!</p>
          </div>
        )}
      </div>
    </div>
  );
}
