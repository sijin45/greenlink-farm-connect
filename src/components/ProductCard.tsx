
import { useState } from "react";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StarRating } from "@/components/StarRating";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToBill: (productId: number, quantity: number, unit: string) => void;
}

export const ProductCard = ({ product, onAddToBill }: ProductCardProps) => {
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToBill = () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    onAddToBill(product.id, qty, unit);
    setQuantity("");
  };

  const handleAddToCart = () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    
    const requestedQuantityKg = unit === 'g' ? qty / 1000 : qty;
    if (requestedQuantityKg > product.quantity) {
      alert(`Sorry, only ${product.quantity.toFixed(2)}kg of ${product.name} is available.`);
      return;
    }
    
    addToCart(product, qty, unit);
    setQuantity("");
    alert(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.alt}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isInWishlist(product.id) 
              ? "bg-red-100 text-red-600" 
              : "bg-white/80 text-gray-600"
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart 
            className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} 
          />
        </Button>
      </div>
      
      <CardHeader>
        <CardTitle className="text-green-700">{product.name}</CardTitle>
        {product.rating && (
          <StarRating 
            rating={product.rating} 
            reviewCount={product.reviewCount}
            size={14}
          />
        )}
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
        
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
          </Button>
          
          <Button 
            onClick={handleAddToBill}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
