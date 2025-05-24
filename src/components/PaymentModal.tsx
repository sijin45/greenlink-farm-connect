
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentModalProps {
  isOpen: boolean;
  grandTotal: number;
  onClose: () => void;
  onComplete: () => void;
}

export const PaymentModal = ({ isOpen, grandTotal, onClose, onComplete }: PaymentModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const generateTransactionId = () => {
        return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      };

      const transactionId = generateTransactionId();
      const merchantName = "GreenLink";
      const merchantUPI = "greenlink@paytm";
      
      // Enhanced UPI URL with more details
      const upiUrl = `upi://pay?pa=${merchantUPI}&pn=${merchantName}&am=${grandTotal.toFixed(2)}&tn=Payment to ${merchantName} by ${user?.username}&tr=${transactionId}&cu=INR&mc=1234`;

      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#166534', // Green color
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [isOpen, grandTotal, user?.username]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-center">{t('payment.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <canvas ref={canvasRef} className="border rounded-lg" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-green-700">
              ₹{grandTotal.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {t('payment.scan')} {grandTotal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              User: {user?.username}
            </p>
          </div>
          <Button 
            onClick={onComplete}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {t('payment.complete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
