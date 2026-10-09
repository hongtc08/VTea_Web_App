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
  {
    id: 'tran-chau-den',
    name: 'Trân châu đen',
    price: 5000,
    category: 'Topping',
    imageUrl: '/images/toppings/c-nng-1781544594063.jpg',
  },
  {
    id: 'tran-chau-olong',
    name: 'Trân châu olong',
    price: 8000,
    category: 'Topping',
    imageUrl: '/images/toppings/pudding-trng-1781636222883.png',
  },
  {
    id: 'tran-chau-trang',
    name: 'Trân châu trắng',
    price: 5000,
    category: 'Topping',
    imageUrl: '/images/toppings/pudding-chocolate-1781636241583.jpg',
  },
  {
    id: 'cu-nang',
    name: 'Củ năng',
    price: 6000,
    category: 'Topping',
    imageUrl: '/images/toppings/c-nng-1781544594063.jpg',
  },
  {
    id: 'pho-mai-man',
    name: 'Phô mai mặn',
    price: 7000,
    category: 'Topping',
    imageUrl: '/images/toppings/ph-mai-vin-1781544613359.jpg',
  },
  {
    id: 'pho-mai-vien',
    name: 'Phô mai viên',
    price: 8000,
    category: 'Topping',
    imageUrl: '/images/toppings/ph-mai-vin-1781544613359.jpg',
  },
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
