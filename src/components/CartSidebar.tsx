
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

interface CartSidebarProps {
  onProceedToPayment: (total: number) => void;
}

export const CartSidebar = ({ onProceedToPayment }: CartSidebarProps) => {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal, getCartItemsCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleProceedToPayment = () => {
    const total = getCartTotal();
    onProceedToPayment(total);
    setIsOpen(false);
    clearCart();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {getCartItemsCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getCartItemsCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getCartItemsCount()} items)</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 h-full flex flex-col">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.unit}`} className="flex items-center space-x-4 border-b pb-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.alt}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">₹{item.product.price}/{item.unit}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm">{item.quantity} {item.unit}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{((item.unit === 'g' ? item.quantity / 1000 : item.quantity) * item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total: ₹{getCartTotal().toFixed(2)}</span>
                </div>
                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Proceed to Payment
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
