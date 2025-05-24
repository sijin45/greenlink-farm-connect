
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User, Lock, Leaf } from 'lucide-react';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 800);
  };

  const backgroundStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 opacity-50" style={backgroundStyle}></div>
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Welcome to GreenLink
          </CardTitle>
          <p className="text-gray-600 text-sm mt-2">
            Connecting farmers directly with customers
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          
          <div className="mt-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <p className="text-sm font-semibold mb-3 text-gray-700 text-center">Demo Credentials</p>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border">
                <span className="font-medium text-gray-600">Admin:</span>
                <span className="text-green-600 font-mono">admin / admin123</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border">
                <span className="font-medium text-gray-600">Farmer:</span>
                <span className="text-green-600 font-mono">farmer / farmer123</span>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-lg border">
                <span className="font-medium text-gray-600">Customer:</span>
                <span className="text-green-600 font-mono">customer / customer123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
