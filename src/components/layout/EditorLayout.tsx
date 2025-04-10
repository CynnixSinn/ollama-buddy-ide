
import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { TopBar } from "./TopBar";
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { 
  AlertTriangle, 
  CheckCircle2 
} from "lucide-react";

interface EditorLayoutProps {
  children: React.ReactNode;
  onSettingsClick: () => void;
}

const EditorLayout = ({ children, onSettingsClick }: EditorLayoutProps) => {
  const { isConnected, ollamaEndpoint } = useModelContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleConnection = () => {
    toast({
      title: "Connection attempt",
      description: `Trying to connect to Ollama at ${ollamaEndpoint}`,
    });
    
    // Simulate connection attempt
    setTimeout(() => {
      toast({
        title: "Connection failed",
        description: "Ensure Ollama is running locally and try again",
        variant: "destructive"
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onSettingsClick={onSettingsClick} />
      
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav 
          isCollapsed={isSidebarCollapsed} 
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
        
        <main className="flex-1 overflow-hidden flex flex-col">
          {!isConnected && (
            <div className="bg-destructive/20 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <p className="text-sm">
                  Not connected to Ollama. Make sure Ollama is running locally.
                </p>
              </div>
              <Button size="sm" onClick={handleConnection}>
                Try connecting
              </Button>
            </div>
          )}
          
          {isConnected && (
            <div className="bg-accent/10 p-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <p className="text-xs text-muted-foreground">
                Connected to Ollama at {ollamaEndpoint}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorLayout;
