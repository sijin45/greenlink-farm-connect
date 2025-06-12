
import { Product } from "@/types/product";

export const initialProducts: Product[] = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    description: "Organic red tomatoes from local farms",
    price: 40,
    quantity: 25.5,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1546470427-e2f300593277?w=300&h=200&fit=crop",
    alt: "Fresh red tomatoes",
    rating: 4.5,
    reviewCount: 23
  },
  {
    id: 2,
    name: "Green Leafy Vegetables",
    description: "Fresh spinach and other leafy greens",
    price: 30,
    quantity: 15.0,
    category: "Vegetables",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop",
    alt: "Fresh green leafy vegetables",
    rating: 4.2,
    reviewCount: 18
  },
  {
    id: 3,
    name: "Organic Milk",
    description: "Fresh organic milk from grass-fed cows",
    price: 60,
    quantity: 50.0,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop",
    alt: "Fresh organic milk",
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: 4,
    name: "Farm Fresh Eggs",
    description: "Free-range chicken eggs",
    price: 8,
    quantity: 100.0,
    category: "Dairy",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=200&fit=crop",
    alt: "Farm fresh eggs",
    rating: 4.6,
    reviewCount: 31
  },
  {
    id: 5,
    name: "Seasonal Fruits",
    description: "Mix of seasonal fresh fruits",
    price: 80,
    quantity: 20.0,
    category: "Fruits",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=200&fit=crop",
    alt: "Seasonal fresh fruits",
    rating: 4.3,
    reviewCount: 27
  },
  {
    id: 6,
    name: "Organic Fertilizer",
    description: "Natural compost fertilizer for plants",
    price: 25,
    quantity: 75.0,
    category: "Fertilizers",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
    alt: "Organic fertilizer",
    rating: 4.1,
    reviewCount: 15
  }
];
