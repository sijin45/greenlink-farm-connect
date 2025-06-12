
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  alt: string;
  rating?: number;
  reviewCount?: number;
}

export interface BillItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
