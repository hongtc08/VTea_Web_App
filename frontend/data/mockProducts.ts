import { Product, Topping } from '@/types/pos';

export const CATEGORIES = [
  'Tất cả',
  'Cà phê',
  'Trà',
  'Sinh tố',
  'Nước Ép',
  'Trà Trái Cây',
];

export const AVAILABLE_TOPPINGS: Topping[] = [
  { id: 'cu-nang', name: 'Củ năng', price: 6000 },
  { id: 'tran-chau-trang', name: 'Trân châu trắng', price: 6000 },
  { id: 'thach-dao', name: 'Thạch đào', price: 6000 },
  { id: 'kem-cheese', name: 'Kem cheese', price: 10000 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Cà phê Đen đá',
    category: 'Cà phê',
    price: 25000,
    imageUrl: '/images/products/bc-xu-1779541523944.png',
  },
  {
    id: 2,
    name: 'Cà phê Sữa đá',
    category: 'Cà phê',
    price: 29000,
    imageUrl: '/images/products/chocolate--xay-1781634858335.png',
  },
  {
    id: 3,
    name: 'Bạc xỉu',
    category: 'Cà phê',
    price: 35000,
    imageUrl: '/images/products/bc-xu-1779541523944.png',
  },
  {
    id: 4,
    name: 'Cappuccino',
    category: 'Cà phê',
    price: 35000,
    imageUrl: '/images/products/cappuccino-1781634027704.jpg',
  },
  {
    id: 5,
    name: 'Chocolate đá xay',
    category: 'Sinh tố',
    price: 45000,
    imageUrl: '/images/products/chocolate--xay-1781634858335.png',
  },
  {
    id: 6,
    name: 'Trà Đào Cam Sả',
    category: 'Trà Trái Cây',
    price: 45000,
    imageUrl: '/images/products/du--xay-1781634899714.png',
  },
  {
    id: 7,
    name: 'Dừa đá xay',
    category: 'Sinh tố',
    price: 42000,
    imageUrl: '/images/products/du--xay-1781634899714.png',
  },
  {
    id: 8,
    name: 'Trà Sữa Ô Long',
    category: 'Trà',
    price: 38000,
    imageUrl: '/images/products/chocolate--xay-1781634858335.png',
  },
];

