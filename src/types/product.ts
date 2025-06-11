
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
  alt: string;
}

export interface BillItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  totalPrice: number;
}
