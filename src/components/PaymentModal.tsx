
import { useEffect, useRef, useState } from "react";
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
  const [qrGenerated, setQrGenerated] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && !qrGenerated) {
      console.log('Generating QR code for payment:', grandTotal);
      
      const generateTransactionId = () => {
        return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      };

      const transactionId = generateTransactionId();
      const merchantName = "GreenLink";
      const merchantUPI = "greenlink@paytm";
      
      // Enhanced UPI URL with more details
      const upiUrl = `upi://pay?pa=${merchantUPI}&pn=${merchantName}&am=${grandTotal.toFixed(2)}&tn=Payment to ${merchantName} by ${user?.username}&tr=${transactionId}&cu=INR&mc=1234`;

      console.log('UPI URL:', upiUrl);

      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: 250,
        margin: 2,
        color: {
          dark: '#166534', // Green color
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          console.error('QR Code generation error:', error);
        } else {
          console.log('QR Code generated successfully');
          setQrGenerated(true);
        }
      });
    }
  }, [isOpen, grandTotal, user?.username, qrGenerated]);

  // Reset QR generation state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQrGenerated(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-center text-xl font-bold">
            {t('payment.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 p-4">
          <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-lg">
            <canvas ref={canvasRef} className="border rounded-lg" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-green-700">
              ₹{grandTotal.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              {t('payment.scan')} ₹{grandTotal.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              User: {user?.username}
            </p>
          </div>
          <Button 
            onClick={onComplete}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {t('payment.complete')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
