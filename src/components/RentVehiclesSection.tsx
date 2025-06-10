
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vehicle {
  id: number;
  name: string;
  description: string;
  dailyRate: number;
  location: string;
  type: string;
  image: string;
  available: boolean;
}

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    name: "John Deere Tractor",
    description: "Heavy-duty tractor perfect for plowing and harvesting operations.",
    dailyRate: 2500,
    location: "Chennai",
    type: "Tractor",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3",
    available: true
  },
  {
    id: 2,
    name: "Harvester Combine",
    description: "Advanced combine harvester for efficient grain harvesting.",
    dailyRate: 4000,
    location: "Coimbatore",
    type: "Harvester",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
    available: true
  },
  {
    id: 3,
    name: "Irrigation Pump",
    description: "High-capacity water pump for field irrigation systems.",
    dailyRate: 800,
    location: "Madurai",
    type: "Irrigation Equipment",
    image: "https://images.unsplash.com/photo-1606381080687-d0d5c77e3b4c",
    available: false
  },
  {
    id: 4,
    name: "Seed Drill Machine",
    description: "Precision seed drilling machine for accurate planting.",
    dailyRate: 1500,
    location: "Salem",
    type: "Planting Equipment",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66",
    available: true
  }
];

export const RentVehiclesSection = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dailyRate: "",
    location: "",
    type: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVehicle: Vehicle = {
      id: vehicles.length + 1,
      name: formData.name,
      description: formData.description,
      dailyRate: Number(formData.dailyRate),
      location: formData.location,
      type: formData.type,
      image: `https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400`,
      available: true
    };
    
    setVehicles([...vehicles, newVehicle]);
    setFormData({ name: "", description: "", dailyRate: "", location: "", type: "" });
    setShowForm(false);
  };

  const handleBooking = (vehicleId: number) => {
    alert(`Booking vehicle ${vehicleId}. Redirecting to booking page...`);
  };

  return (
    <section id="rent" className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-green-800">{t('rent.title')}</h2>
        <p className="text-lg text-gray-600 mb-8">{t('rent.subtitle')}</p>
        
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white mb-8"
        >
          {showForm ? "Cancel" : "List Your Vehicle"}
        </Button>
      </div>

      {showForm && (
        <div className="max-w-2xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle>List Your Agricultural Vehicle</CardTitle>
              <CardDescription>Add your vehicle to the rental marketplace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="vehicle-name">{t('rent.form.name')}</Label>
                  <Input
                    id="vehicle-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="vehicle-description">{t('rent.form.description')}</Label>
                  <Textarea
                    id="vehicle-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-rate">{t('rent.form.price')}</Label>
                    <Input
                      id="daily-rate"
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">{t('rent.form.location')}</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="vehicle-type">{t('rent.form.type')}</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Tractor">Tractor</SelectItem>
                      <SelectItem value="Harvester">Harvester</SelectItem>
                      <SelectItem value="Irrigation Equipment">Irrigation Equipment</SelectItem>
                      <SelectItem value="Planting Equipment">Planting Equipment</SelectItem>
                      <SelectItem value="Tillage Equipment">Tillage Equipment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  {t('rent.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{vehicle.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600 mb-3">
                {vehicle.description}
              </CardDescription>
              <div className="space-y-2">
                <p className="text-sm"><strong>Type:</strong> {vehicle.type}</p>
                <p className="text-sm"><strong>Location:</strong> {vehicle.location}</p>
                <p className="text-lg font-bold text-green-600">
                  ₹{vehicle.dailyRate} <span className="text-sm font-normal">{t('rent.perDay')}</span>
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleBooking(vehicle.id)}
                disabled={!vehicle.available}
                className={`w-full ${
                  vehicle.available
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {vehicle.available ? t('rent.book') : "Not Available"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
