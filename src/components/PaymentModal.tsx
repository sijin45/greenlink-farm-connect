
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  grandTotal: number;
  onClose: () => void;
  onComplete: () => void;
}

export const PaymentModal = ({ isOpen, grandTotal, onClose, onComplete }: PaymentModalProps) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const generateTransactionId = () => {
        return 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
      };

      const transactionId = generateTransactionId();
      const upiUrl = `upi://pay?pa=greenlink@bank&pn=GreenLink&am=${grandTotal.toFixed(2)}&tn=${transactionId}&cu=INR`;

      QRCode.toCanvas(canvasRef.current, upiUrl, {
        width: 200,
        margin: 2
      }, (error) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [isOpen, grandTotal]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-700 text-center">{t('payment.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <canvas ref={canvasRef} className="border rounded-lg" />
          <p className="text-center text-gray-600">
            {t('payment.scan')} {grandTotal.toFixed(2)}
          </p>
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
