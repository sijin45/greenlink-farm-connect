
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Features = () => {
  const features = [
    {
      title: "Direct Sales",
      description: "Farmers can list and sell their products directly to consumers, ensuring higher profits."
    },
    {
      title: "User-Friendly Interface",
      description: "Simple and intuitive dashboard for farmers and customers to manage listings and purchases."
    },
    {
      title: "Secure Payments",
      description: "Integrated payment gateway for safe and seamless transactions."
    },
    {
      title: "Chatbot Support",
      description: "Instant communication between farmers and customers for quick query resolution."
    },
    {
      title: "Weather Updates",
      description: "Real-time weather reports to help farmers plan crop production effectively."
    },
    {
      title: "Quality Assurance",
      description: "Reviews and ratings to build trust and ensure product quality."
    }
  ];

  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-800">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-green-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
