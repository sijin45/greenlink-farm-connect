
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      text: t("chatbot.welcome"),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      processMessage(input);
    }, 1000);
  };

  const processMessage = (message: string) => {
    // Simple response logic
    let botResponse = "";
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
      botResponse = "Hello! How can I help you today?";
    } else if (lowercaseMessage.includes("product") || lowercaseMessage.includes("buy")) {
      botResponse = "We offer a wide range of fresh agricultural products. You can browse our selection in the Buy section.";
    } else if (lowercaseMessage.includes("sell")) {
      botResponse = "To sell your products, please go to the Sell section and fill out the form with your product details.";
    } else if (lowercaseMessage.includes("price")) {
      botResponse = "Prices vary by product. You can find detailed pricing information on each product card in the Buy section.";
    } else if (lowercaseMessage.includes("payment") || lowercaseMessage.includes("pay")) {
      botResponse = "We offer secure payment through QR code-based UPI transactions.";
    } else if (lowercaseMessage.includes("contact") || lowercaseMessage.includes("help")) {
      botResponse = "You can reach out to us through the Contact section or continue chatting here for assistance.";
    } else {
      botResponse = "I'm not sure I understand. Could you please rephrase or ask another question?";
    }

    const botMessage: Message = {
      text: botResponse,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Button
        onClick={toggleChatbot}
        className="fixed bottom-5 right-5 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-5 bg-white rounded-lg shadow-xl w-80 sm:w-96 max-h-96 flex flex-col z-50 border border-green-200">
          <div className="bg-green-700 text-white p-3 rounded-t-lg">
            <h3 className="font-medium">{t('chatbot.title')}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 max-h-64">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.isUser
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="border-t p-2 flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 rounded-l-none"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
