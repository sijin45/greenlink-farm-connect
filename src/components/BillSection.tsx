
import { BillItem } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BillSectionProps {
  billItems: BillItem[];
  onProceedToPayment: (total: number) => void;
}

export const BillSection = ({ billItems, onProceedToPayment }: BillSectionProps) => {
  const grandTotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Card className="mt-8 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-green-700">Purchase Bill</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-green-700">Product</th>
                <th className="text-left py-2 text-green-700">Quantity</th>
                <th className="text-left py-2 text-green-700">Unit</th>
                <th className="text-left py-2 text-green-700">Price/kg</th>
                <th className="text-left py-2 text-green-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">{item.unit}</td>
                  <td className="py-2">₹{item.price}</td>
                  <td className="py-2">₹{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <p className="text-xl font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        </div>
        <Button 
          onClick={() => onProceedToPayment(grandTotal)}
          className="w-full mt-4 bg-green-600 hover:bg-green-700"
        >
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
};
