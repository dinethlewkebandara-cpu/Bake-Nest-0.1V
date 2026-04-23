import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="px-12 py-8 bg-bakery-soft-brown text-bakery-cream flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-semibold gap-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-bakery-pink rounded-full flex items-center justify-center">
          <span className="text-bakery-brown font-bold text-lg">B</span>
        </div>
        <p>© 2024 BakeNest Artisanal Bakery</p>
      </div>
      <div className="flex gap-8">
        <span className="hover:text-bakery-pink cursor-pointer transition-colors">Instagram</span>
        <span className="hover:text-bakery-pink cursor-pointer transition-colors">Facebook</span>
        <span className="hover:text-bakery-pink cursor-pointer transition-colors">Contact Us</span>
      </div>
    </footer>
  );
}
