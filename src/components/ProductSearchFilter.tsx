
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ProductSearchFilterProps {
  onSearch: (query: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterPriceRange: (min: number, max: number) => void;
  categories: string[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: { min: number; max: number };
}

export const ProductSearchFilter = ({
  onSearch,
  onFilterCategory,
  onFilterPriceRange,
  categories,
  searchQuery,
  selectedCategory,
  priceRange
}: ProductSearchFilterProps) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(priceRange.min);
  const [maxPrice, setMaxPrice] = useState(priceRange.max);

  const handlePriceFilter = () => {
    onFilterPriceRange(minPrice, maxPrice);
  };

  const clearFilters = () => {
    onSearch("");
    onFilterCategory("");
    onFilterPriceRange(0, 1000);
    setMinPrice(0);
    setMaxPrice(1000);
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder={t('search.placeholder') || "Search products..."}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter size={18} />
          {t('filter.toggle') || "Filters"}
        </Button>
        
        {(searchQuery || selectedCategory || priceRange.min > 0 || priceRange.max < 1000) && (
          <Button variant="ghost" onClick={clearFilters} className="text-red-600">
            {t('filter.clear') || "Clear All"}
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filter.category') || "Category"}
                </label>
                <Select value={selectedCategory} onValueChange={onFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('filter.selectCategory') || "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t('filter.allCategories') || "All Categories"}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filter.priceRange') || "Price Range (₹)"}
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-20"
                  />
                  <span className="flex items-center">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button onClick={handlePriceFilter} size="sm">
                    {t('filter.apply') || "Apply"}
                  </Button>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('filter.sortBy') || "Sort By"}
                </label>
                <Select defaultValue="name">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t('filter.sortName') || "Name A-Z"}</SelectItem>
                    <SelectItem value="price-low">{t('filter.sortPriceLow') || "Price: Low to High"}</SelectItem>
                    <SelectItem value="price-high">{t('filter.sortPriceHigh') || "Price: High to Low"}</SelectItem>
                    <SelectItem value="category">{t('filter.sortCategory') || "Category"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
