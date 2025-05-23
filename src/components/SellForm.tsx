
import { useState } from "react";
import { Product } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SellFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

export const SellForm = ({ onAddProduct }: SellFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseFloat(formData.quantity),
      category: formData.category,
      image: `https://source.unsplash.com/random/300x200/?${formData.category.toLowerCase()}`,
      alt: `Fresh ${formData.name.toLowerCase()} from local farms`
    };

    onAddProduct(product);
    alert(`Product "${product.name}" listed successfully!`);
    
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: ""
    });
  };

  return (
    <section id="sell" className="py-16 px-4 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-800">Sell Your Products</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">List Your Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              
              <Textarea
                placeholder="Product Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                required
              />
              
              <Input
                type="number"
                placeholder="Price (INR)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                step="0.01"
                required
              />
              
              <Input
                type="number"
                placeholder="Quantity (kg)"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                step="0.1"
                required
              />
              
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Vegetables">Vegetables</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                  <SelectItem value="Manure">Manure</SelectItem>
                </SelectContent>
              </Select>
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                List Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
