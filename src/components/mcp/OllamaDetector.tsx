
import { useEffect, useState } from "react";
import { useModelContext } from "@/context/ModelContext";
import { toast } from "@/components/ui/use-toast";
import { useNotifications } from "./Notification";

/**
 * Component that handles auto-detection of Ollama models
 * Use this in the main Index.tsx to automatically detect models on app start
 */
export default function OllamaDetector() {
  const { refreshModels, isConnected, availableModels, ollamaEndpoint, setOllamaEndpoint } = useModelContext();
  const { sendNotification, notificationsEnabled } = useNotifications();
  const [initialDetectionDone, setInitialDetectionDone] = useState(false);
  const [detectingEndpoints, setDetectingEndpoints] = useState(false);
  
  useEffect(() => {
    // Try to detect Ollama models when component mounts
    const detectOllama = async () => {
      try {
        console.log("Attempting to connect to Ollama at:", ollamaEndpoint);
        await refreshModels();
        setInitialDetectionDone(true);
      } catch (error) {
        console.error("Failed to detect Ollama:", error);
        
        // Try alternative endpoints if the default one fails
        if (!initialDetectionDone && !detectingEndpoints) {
          await tryAlternativeEndpoints();
        }
      }
    };
    
    detectOllama();
    
    // Setup periodic checking
    const interval = setInterval(async () => {
      await refreshModels();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [ollamaEndpoint, refreshModels]);

  const tryAlternativeEndpoints = async () => {
    setDetectingEndpoints(true);
    
    const alternativeEndpoints = [
      "http://localhost:11434",
      "http://127.0.0.1:11434",
      "http://localhost:8000/ollama", // In case of proxy setup
      "http://host.docker.internal:11434", // For Docker environments
      "http://10.0.2.2:11434", // For Android emulator
      "http://172.17.0.1:11434", // Docker default bridge
      "http://192.168.1.1:11434", // Common local network IP
      "http://ollama:11434", // Container name in docker-compose
      "http://localhost:8080/api/ollama", // Common reverse proxy setup
      "http://host.containers.internal:11434" // podman/newer Docker
    ];
    
    console.log("Trying alternative Ollama endpoints...");
    
    for (const endpoint of alternativeEndpoints) {
      try {
        console.log(`Trying alternative endpoint: ${endpoint}`);
        const response = await fetch(`${endpoint}/api/tags`, {
          signal: AbortSignal.timeout(3000) // Timeout after 3 seconds
        });
        
        if (response.ok) {
          console.log(`Found working endpoint: ${endpoint}`);
          
          // Update the endpoint in the context
          setOllamaEndpoint(endpoint);
          
          toast({
            title: "Ollama connection successful",
            description: `Connected to Ollama at ${endpoint}`,
          });
          
          setInitialDetectionDone(true);
          break;
        }
      } catch (altError) {
        console.log(`Alternative endpoint ${endpoint} failed:`, altError);
      }
    }
    
    setDetectingEndpoints(false);
  };
  
  useEffect(() => {
    // When connection state changes, show appropriate notifications
    if (isConnected && availableModels.length > 0 && initialDetectionDone) {
      const message = `Found ${availableModels.length} models on your system.`;
      
      toast({
        title: "Connected to Ollama",
        description: message,
      });
      
      // Also send a notification if the notification system is enabled
      if (notificationsEnabled) {
        sendNotification(
          "Ollama Models Detected",
          message,
          "normal"
        );
      }
    }
  }, [isConnected, availableModels.length, initialDetectionDone, notificationsEnabled, sendNotification]);
  
  // This is a utility component, it doesn't render anything
  return null;
}
