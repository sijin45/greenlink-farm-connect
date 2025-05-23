
import { Button } from "@/components/ui/button";

export const Hero = () => {
  const scrollToBuy = () => {
    const element = document.querySelector("#buy");
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center justify-center text-white mt-16"
      style={{
        backgroundImage: 'url("https://st3.depositphotos.com/4528771/34978/i/450/depositphotos_349781950-stock-photo-group-various-vegetables-background-agricultural.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 text-center bg-black bg-opacity-50 p-8 rounded-lg max-w-2xl mx-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">GreenLink</h1>
        <p className="text-xl md:text-2xl mb-8">Connecting Farmers Directly with Consumers</p>
        <Button 
          onClick={scrollToBuy}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-200"
        >
          Shop Now
        </Button>
      </div>
    </section>
  );
};
