
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: Date;
}

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: "welcome",
      sender: "coach" as const,
      text: `Hi ${user?.name || "there"}! I'm your Goal Guru, ready to help you achieve your goals. How can I assist you today?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [user]);

  // Auto scroll to bottom when new messages come in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const mockResponses = [
        "That's a great goal! Let's break it down into smaller, actionable steps.",
        "I understand your challenge. What specific obstacles are you facing?",
        "Looking at your progress, you're doing really well! Keep up the momentum.",
        "Let's think about how we can make this habit more consistent in your routine.",
        "Have you considered approaching this from a different angle?",
        "What specifically would make you feel successful with this goal?",
        "Let's establish a clear metric to track your progress on this."
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const coachMessage = {
        id: Date.now().toString(),
        sender: "coach" as const,
        text: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, coachMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    // Toggle microphone state
    setIsListening(!isListening);
    
    if (!isListening) {
      // In a real implementation, this would activate speech recognition
      // For now, we'll just show a message
      setInputValue("I'm listening to you...");
      setTimeout(() => {
        setInputValue("This is simulated voice input");
      }, 2000);
    } else {
      // If we're turning off listening, send the current input
      if (inputValue.trim()) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Coach Chat</h1>
      
      <Card className="flex-1 flex flex-col glass-card">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="AI Coach" />
              <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
            </Avatar>
            <span>AI Coach</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p>{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-secondary">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <CardFooter className="p-3 border-t">
          <div className="flex items-center w-full gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </Button>
            
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                ref={inputRef}
                className="pr-10 h-11"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                onClick={toggleListening}
              >
                {isListening ? (
                  <MicOff size={18} className="text-destructive" />
                ) : (
                  <Mic size={18} />
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              className="rounded-full h-11 w-11 p-0"
            >
              <Send size={18} />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;
