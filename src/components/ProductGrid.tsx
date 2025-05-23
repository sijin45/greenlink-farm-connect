
import { useState } from "react";
import { Product } from "@/pages/Index";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToBill: (productId: number, quantity: number, unit: string) => void;
}

export const ProductGrid = ({ products, onAddToBill }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToBill={onAddToBill}
        />
      ))}
    </div>
  );
};
