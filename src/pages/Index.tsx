
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Product, BillItem } from "@/types/product";
import { initialProducts } from "@/data/initialProducts";
import { AuthPage } from "@/components/AuthPage";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Features } from "@/components/Features";
import { ProductSection } from "@/components/ProductSection";
import { SellForm } from "@/components/SellForm";
import { RentVehiclesSection } from "@/components/RentVehiclesSection";
import { Contact } from "@/components/Contact";
import { PaymentModal } from "@/components/PaymentModal";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useSupabaseAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);

  // Show loading state while checking authentication with improved UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading GreenLink...</p>
          <p className="text-gray-500 text-sm">Connecting to your account</p>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const addToBill = (productId: number, quantity: number, unit: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const requestedQuantityKg = unit === 'g' ? quantity / 1000 : quantity;

    if (requestedQuantityKg > product.quantity) {
      alert(`Sorry, only ${product.quantity.toFixed(2)}kg of ${product.name} is available.`);
      return;
    }

    // Update product quantity
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, quantity: p.quantity - requestedQuantityKg }
        : p
    ));

    const totalPrice = requestedQuantityKg * product.price;

    setBillItems(prev => [...prev, {
      name: product.name,
      quantity: quantity,
      unit: unit,
      price: product.price,
      totalPrice: totalPrice
    }]);
  };

  const addProduct = (newProduct: Omit<Product, 'id'>) => {
    const product: Product = {
      ...newProduct,
      id: products.length + 1,
      image: `https://source.unsplash.com/random/300x200/?${newProduct.category.toLowerCase()}`,
      alt: `Fresh ${newProduct.name.toLowerCase()} from local farms`
    };
    setProducts(prev => [...prev, product]);
  };

  const proceedToPayment = (total: number) => {
    setGrandTotal(total);
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    setShowPaymentModal(false);
    setBillItems([]);
    alert("Payment completed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <Hero />
        <About />
        <Features />
        
        <ProductSection 
          products={products}
          billItems={billItems}
          onAddToBill={addToBill}
          onProceedToPayment={proceedToPayment}
        />

        <SellForm onAddProduct={addProduct} />
        <RentVehiclesSection />
        <Contact />
      </main>

      <footer className="bg-green-800 text-white text-center py-8">
        <p>{t('footer.copyright')}</p>
      </footer>

      <PaymentModal 
        isOpen={showPaymentModal}
        grandTotal={grandTotal}
        onClose={() => setShowPaymentModal(false)}
        onComplete={completePayment}
      />
      
      <Chatbot />
    </div>
  );
};

export default Index;
