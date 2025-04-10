
import { Button } from "@/components/ui/button";
import {
  Code2,
  X,
  MessageSquareText,
  Cpu,
  FileCode,
  Bell,
  ArrowRight,
} from "lucide-react";

interface WelcomeBannerProps {
  onDismiss: () => void;
}

const WelcomeBanner = ({ onDismiss }: WelcomeBannerProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6">
      <div className="bg-card border border-border shadow-lg rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center">
            <Code2 className="h-6 w-6 text-primary mr-3" />
            <h2 className="text-2xl font-bold">Welcome to Ollama Buddy IDE</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-lg">
              Your AI-powered coding assistant that runs entirely locally using Ollama models.
            </p>
            
            <div className="bg-accent/10 rounded-lg p-4 my-4 border border-accent/20">
              <h3 className="text-lg font-medium flex items-center text-accent">
                <Cpu className="h-5 w-5 mr-2" />
                Ollama Powered
              </h3>
              <p>
                Ollama Buddy IDE uses locally-run AI models through Ollama. All AI processing happens
                on your machine, ensuring privacy and security for your code.
              </p>
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-4">Key Features:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MessageSquareText className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">AI Chat Assistant</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Chat with your AI assistant to get help with coding tasks, debugging, and more.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FileCode className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Code Generation</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Generate code snippets, complete functions, and get suggestions as you type.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Bell className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">Mobile Notifications</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Stay updated with notifications on your mobile device about code issues and solutions.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Cpu className="h-5 w-5 text-primary mr-2" />
                  <h4 className="font-medium">MCP Servers</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Multimodal Capability Providers extend Ollama with vision, voice, browser, and file system capabilities.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="font-medium">Getting Started:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Make sure Ollama is installed and running on your machine</li>
                <li>Select your preferred AI model in the settings</li>
                <li>Start chatting with your AI assistant</li>
                <li>Explore the MCP capabilities in the settings panel</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            This is a concept demo of an Ollama-powered IDE
          </p>
          <Button onClick={onDismiss} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
