import { Product } from './App';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Vanilla Cloud',
    price: 8500.00,
    category: 'Cakes',
    description: 'A light and airy vanilla sponge filled with fluffy cream.',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Velvety Chocolate Dream',
    price: 9800.00,
    category: 'Cakes',
    description: 'Deep cocoa cake with silky chocolate ganache icing.',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Artisan Sourdough',
    price: 1200.00,
    category: 'Breads',
    description: 'Traditionally fermented loaf with a crisp crust.',
    image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Butter Croissant',
    price: 650.00,
    category: 'Pastries',
    description: 'Flaky, buttery, golden French masterpiece.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Macaron Box (6pc)',
    price: 4500.00,
    category: 'Pastries',
    description: 'Assorted delicate French macarons.',
    image: 'https://images.unsplash.com/photo-1569864358642-9d16197022c3?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Lemon Tart',
    price: 1800.00,
    category: 'Pastries',
    description: 'Zesty lemon curd in a shortcrust pastry shell.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '7',
    name: 'Chocolate Chip Cookies',
    price: 350.00,
    category: 'Cookies',
    description: 'Chunks of dark chocolate in a soft-baked cookie.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&h=600&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Brioche Bun',
    price: 450.00,
    category: 'Breads',
    description: 'Rich, soft, eggs-and-butter enriched bread.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&h=600&auto=format&fit=crop'
  }
];

export const CATEGORIES = ['All', 'Cakes', 'Pastries', 'Breads', 'Cookies'];
