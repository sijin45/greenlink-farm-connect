
import { useState, useMemo } from "react";
import { Product } from "@/pages/Index";

export const useProductFilter = (products: Product[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("name");

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      // Price filter
      const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      
      // Only show products with quantity > 0
      const hasStock = product.quantity > 0;

      return matchesSearch && matchesCategory && matchesPrice && hasStock;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  return {
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
  };
};
