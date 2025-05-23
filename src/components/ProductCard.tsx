
import { useState } from "react";
import { Product } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductCardProps {
  product: Product;
  onAddToBill: (productId: number, quantity: number, unit: string) => void;
}

export const ProductCard = ({ product, onAddToBill }: ProductCardProps) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");

  const handleAddToBill = () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    onAddToBill(product.id, qty, unit);
    setQuantity("");
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-green-700">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{product.description}</p>
        <p className="font-semibold">Price: ₹{product.price}/kg</p>
        <p className="text-sm text-gray-500">Available: {product.quantity.toFixed(2)}kg</p>
        
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="flex-1"
            min="0"
            step="0.001"
          />
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleAddToBill}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Add to Bill
        </Button>
      </CardContent>
    </Card>
  );
};
