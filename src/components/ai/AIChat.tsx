
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModelContext } from "@/context/ModelContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Code,
  Send,
  Mic,
  Eye,
  RefreshCw,
  CheckCircle,
  Copy,
  Glasses,
  Smartphone,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  hasNotification?: boolean;
}

interface ChatUIProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  isGenerating: boolean;
}

const ChatMessage = ({ message }: { message: Message }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCode = (content: string) => {
    if (message.role === "assistant" && content.includes("```")) {
      const parts = content.split(/```(?:python|js|javascript|typescript|tsx|html|css)?([\s\S]*?)```/);
      
      return (
        <>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              // Code block
              return (
                <div key={i} className="bg-secondary my-2 p-2 rounded relative group">
                  <pre className="text-sm font-mono whitespace-pre-wrap">{part.trim()}</pre>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 h-6 w-6"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              );
            } else {
              // Regular text
              return <p key={i}>{part}</p>;
            }
          })}
        </>
      );
    }
    
    return <p>{content}</p>;
  };

  return (
    <div className={`p-3 ${
      message.role === "assistant" ? "bg-card" : "bg-muted"
    } my-2 rounded-lg`}>
      <div className="flex items-start gap-2">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.role === "assistant" ? "bg-primary text-white" : "bg-secondary"
        }`}>
          {message.role === "assistant" ? (
            <Code className="h-3.5 w-3.5" />
          ) : (
            <MessageSquare className="h-3.5 w-3.5" />
          )}
        </div>
        <div className="flex-1 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">
              {message.role === "assistant" ? "Ollama Buddy" : "You"}
              {message.hasNotification && (
                <Badge variant="outline" className="ml-2 text-xs px-1.5">
                  <Smartphone className="h-3 w-3 mr-1" /> 
                  Notification sent
                </Badge>
              )}
            </span>
            <span className="text-xs text-muted-foreground">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="prose prose-sm dark:prose-invert">
            {message.isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span className="animate-pulse">Thinking...</span>
              </div>
            ) : (
              formatCode(message.content)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatUI = ({
  messages,
  onSendMessage,
  inputValue,
  setInputValue,
  isGenerating,
}: ChatUIProps) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Focus input when not generating
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isGenerating) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-3 py-2">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messageEndRef} />
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => toast({
              title: "Vision capture",
              description: "Screenshot functionality not implemented in this preview",
            })}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="flex-shrink-0"
            onClick={() => toast({
              title: "Voice input",
              description: "Voice recognition not implemented in this preview",
            })}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything or type / for commands..."
            disabled={isGenerating}
            className="flex-1"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isGenerating || !inputValue.trim()}
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

const AIChat = () => {
  const { selectedModel } = useModelContext();
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      const isNotificationRequest = content.toLowerCase().includes("notify") || 
                                   content.toLowerCase().includes("alert") ||
                                   content.toLowerCase().includes("message");
      
      const isCodeRequest = content.toLowerCase().includes("code") || 
                           content.toLowerCase().includes("function") ||
                           content.toLowerCase().includes("implement");
      
      let aiResponse = "";
      
      if (isCodeRequest) {
        aiResponse = `Here's a sample implementation:

\`\`\`python
def process_data(input_file, output_file):
    """
    Process data from input file and write results to output file.
    
    Args:
        input_file (str): Path to the input file
        output_file (str): Path to the output file
    """
    results = []
    
    try:
        with open(input_file, 'r') as f:
            data = f.readlines()
            
        # Process each line
        for line in data:
            # Extract values and transform
            processed = line.strip().upper()
            results.append(processed)
            
        # Write results
        with open(output_file, 'w') as f:
            for result in results:
                f.write(f"{result}\\n")
                
        return True
    except Exception as e:
        print(f"Error processing data: {str(e)}")
        return False
\`\`\`

You can call this function with your input and output file paths.`;
      } else if (isNotificationRequest) {
        aiResponse = "I've sent a notification to your phone with the information you requested. The notification contains a summary of the changes and will alert you when the process is complete.";
      } else {
        aiResponse = "I'm here to help with your coding tasks! I can assist with writing code, explaining concepts, debugging issues, or answering questions about programming. What would you like to work on today?";
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        hasNotification: isNotificationRequest,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
      
      if (isNotificationRequest) {
        toast({
          title: "Notification sent",
          description: "A notification has been sent to your mobile device",
        });
      }
    }, 1500);
  };

  return (
    <div className="h-full border-t border-border">
      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-border px-3">
          <TabsList className="h-9">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
            </TabsTrigger>
            <TabsTrigger value="commands" className="text-xs">
              <Code className="h-3.5 w-3.5 mr-1" /> Commands
            </TabsTrigger>
            <TabsTrigger value="vision" className="text-xs">
              <Glasses className="h-3.5 w-3.5 mr-1" /> Vision
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <ChatUI
            messages={messages}
            onSendMessage={handleSendMessage}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isGenerating={isGenerating}
          />
        </TabsContent>
        
        <TabsContent value="commands" className="p-4">
          <div className="text-center text-muted-foreground">
            <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Command Palette</p>
            <p className="text-sm mt-1">
              Quick access to AI commands and code actions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="vision" className="p-4">
          <div className="text-center text-muted-foreground">
            <Glasses className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Vision Interface</p>
            <p className="text-sm mt-1">
              Allow Ollama Buddy to see and understand your screen.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIChat;
