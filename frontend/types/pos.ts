export interface Topping {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export interface SelectedTopping {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  description?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
  toppings: SelectedTopping[];
}
