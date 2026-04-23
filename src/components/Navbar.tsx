import { ShoppingCart, User, Cake, Home, Tag, Star, Menu, X, LogOut } from 'lucide-react';
import { Page } from '../App';
import { useState } from 'react';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  cartCount: number;
  user: FirebaseUser | null;
}

export default function Navbar({ activePage, setActivePage, cartCount, user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setActivePage('home');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems: { id: Page; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: Tag },
    { id: 'custom', label: 'Custom Cake', icon: Cake },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-bakery-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex-shrink-0 cursor-pointer flex items-center space-x-3"
            onClick={() => setActivePage('home')}
          >
            <div className="w-10 h-10 bg-bakery-pink rounded-full flex items-center justify-center">
              <span className="text-bakery-brown font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-serif font-bold text-bakery-brown tracking-tight">BakeNest</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-1.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  activePage === item.id 
                    ? 'text-bakery-brown border-b-2 border-bakery-pink' 
                    : 'text-bakery-brown hover:text-bakery-accent'
                } py-1`}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setActivePage('cart')}
              className="relative p-2 text-bakery-brown hover:text-bakery-accent transition-colors"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-bakery-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-bakery-cream px-4 py-2 rounded-full border border-bakery-border">
                  <User size={16} className="text-bakery-brown" />
                  <span className="text-sm font-semibold text-bakery-brown truncate max-w-[100px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="p-2 text-bakery-brown hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActivePage('login')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-bakery-brown text-white text-sm font-medium hover:bg-bakery-soft-brown transition-all shadow-md"
              >
                <User size={16} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={() => setActivePage('cart')}
              className="relative p-2 text-bakery-brown"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-bakery-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-bakery-brown"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-bakery-cream border-t border-bakery-brown/10 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActivePage(item.id); setIsOpen(false); }}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-lg font-serif ${
                  activePage === item.id ? 'text-bakery-accent bg-bakery-pink/30' : 'text-bakery-brown'
                } rounded-xl`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
            {user ? (
              <button 
                onClick={() => { handleSignOut(); setIsOpen(false); }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-lg font-serif text-red-500 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={20} />
                <span>Sign Out ({user.displayName || 'Me'})</span>
              </button>
            ) : (
              <button 
                onClick={() => { setActivePage('login'); setIsOpen(false); }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-lg font-serif text-bakery-brown"
              >
                <User size={20} />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
