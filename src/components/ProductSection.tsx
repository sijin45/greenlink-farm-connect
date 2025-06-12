
import { useTranslation } from "react-i18next";
import { Product, BillItem } from "@/types/product";
import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductSearchFilter } from "@/components/ProductSearchFilter";
import { ProductGrid } from "@/components/ProductGrid";
import { BillSection } from "@/components/BillSection";
import { CartSidebar } from "@/components/CartSidebar";

interface ProductSectionProps {
  products: Product[];
  billItems: BillItem[];
  onAddToBill: (productId: number, quantity: number, unit: string) => void;
  onProceedToPayment: (total: number) => void;
}

export const ProductSection = ({
  products,
  billItems,
  onAddToBill,
  onProceedToPayment
}: ProductSectionProps) => {
  const { t } = useTranslation();

  // Initialize product filtering
  const {
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    categories,
    filteredProducts,
    setSearchQuery,
    setSelectedCategory,
    setPriceRange,
    setSortBy
  } = useProductFilter(products);

  return (
    <section id="buy" className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-bold text-green-800">{t('buy.title')}</h2>
        <CartSidebar onProceedToPayment={onProceedToPayment} />
      </div>
      
      {/* Search and Filter Component */}
      <ProductSearchFilter
        onSearch={setSearchQuery}
        onFilterCategory={setSelectedCategory}
        onFilterPriceRange={setPriceRange}
        onSortBy={setSortBy}
        categories={categories}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        priceRange={priceRange}
        sortBy={sortBy}
      />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          {t('search.results') || `Showing ${filteredProducts.length} of ${products.length} products`}
        </p>
      </div>

      {/* Product Grid with filtered products */}
      <ProductGrid products={filteredProducts} onAddToBill={onAddToBill} />
      
      {/* No results message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {t('search.noResults') || "No products found matching your criteria."}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {t('search.tryDifferent') || "Try adjusting your search or filters."}
          </p>
        </div>
      )}

      {billItems.length > 0 && (
        <BillSection billItems={billItems} onProceedToPayment={onProceedToPayment} />
      )}
    </section>
  );
};
