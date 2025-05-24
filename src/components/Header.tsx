
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#features", label: t("nav.features") },
    { href: "#buy", label: t("nav.buy") },
    { href: "#sell", label: t("nav.sell") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-green-800 text-white fixed w-full top-0 z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">GreenLink</div>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="hover:text-green-200 transition-colors duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* User info and controls */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.username}</span>
            <LanguageSelector />
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-green-800 border-green-200 hover:bg-green-100"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-green-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <ul className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 hover:text-green-200 transition-colors duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li className="pt-2 border-t border-green-700">
              <div className="flex items-center justify-between">
                <span className="text-sm">Welcome, {user?.username}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-green-800 border-green-200 hover:bg-green-100"
                >
                  Logout
                </Button>
              </div>
            </li>
            <li className="pt-2">
              <LanguageSelector />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};
