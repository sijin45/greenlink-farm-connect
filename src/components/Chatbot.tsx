
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [apiKey, setApiKey] = useState<string>(() => {
    // Try to get API key from localStorage on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openai_api_key') || '';
    }
    return '';
  });
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
    setShowApiKeyDialog(false);
    toast.success("API Key saved successfully");
  };

  const processMessageWithAI = async (userMessage: string) => {
    if (!apiKey) {
      setShowApiKeyDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a helpful agricultural assistant for GreenLink, a platform that connects farmers with consumers. Provide concise, helpful responses about farming, produce, selling and buying agricultural products."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          max_tokens: 300
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from AI");
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      toast.error("Failed to get response from AI. Please check your API key.");
      return "I'm having trouble connecting to my AI services. Please check your API key or try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const userText = input;
    setInput("");

    // Get AI response
    let botResponse = "";
    
    if (!apiKey) {
      setShowApiKeyDialog(true);
      botResponse = "Please provide an OpenAI API key to enable AI responses.";
    } else {
      // Show typing indicator
      setIsLoading(true);
      botResponse = await processMessageWithAI(userText) || 
        "I'm having trouble connecting to my AI services. Please try again later.";
    }

    const botMessage: Message = {
      text: botResponse,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
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
          <div className="bg-green-700 text-white p-3 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">{t('chatbot.title')}</h3>
            <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white p-1 h-auto">
                  <Key size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set OpenAI API Key</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-500">
                  Enter your OpenAI API key to enable AI responses. The key will be stored in your browser's local storage.
                </p>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..." 
                  />
                  <Button onClick={() => saveApiKey(apiKey)}>Save</Button>
                </div>
                <p className="text-xs text-gray-400">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-blue-500 underline">OpenAI</a>
                </p>
              </DialogContent>
            </Dialog>
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
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className="border-t p-2 flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              disabled={isLoading}
            />
            <Button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 rounded-l-none"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
