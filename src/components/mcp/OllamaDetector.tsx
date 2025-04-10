
import { useEffect } from "react";
import { useModelContext } from "@/context/ModelContext";
import { toast } from "@/components/ui/use-toast";

/**
 * Component that handles auto-detection of Ollama models
 * Use this in the main Index.tsx to automatically detect models on app start
 */
export default function OllamaDetector() {
  const { refreshModels, isConnected, availableModels } = useModelContext();
  
  useEffect(() => {
    // Try to detect Ollama models when component mounts
    const detectOllama = async () => {
      try {
        await refreshModels();
      } catch (error) {
        console.error("Failed to detect Ollama:", error);
      }
    };
    
    detectOllama();
    
    // Setup periodic checking
    const interval = setInterval(async () => {
      await refreshModels();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // When connection state changes, show appropriate notifications
    if (isConnected && availableModels.length > 0) {
      toast({
        title: "Connected to Ollama",
        description: `Found ${availableModels.length} models on your system.`,
      });
    }
  }, [isConnected, availableModels.length]);
  
  // This is a utility component, it doesn't render anything
  return null;
}
