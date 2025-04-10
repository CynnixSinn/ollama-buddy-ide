
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import EditorLayout from "@/components/layout/EditorLayout";
import AIChat from "@/components/ai/AIChat";
import CodeEditor from "@/components/editor/CodeEditor";
import SettingsPanel from "@/components/settings/SettingsPanel";
import WelcomeBanner from "@/components/intro/WelcomeBanner";
import { ModelProvider, useModelContext } from "@/context/ModelContext";
import OllamaDetector from "@/components/mcp/OllamaDetector";
import { useNotifications } from "@/components/mcp/Notification";

const IndexContent = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { isConnected } = useModelContext();
  const { notificationsEnabled, sendNotification } = useNotifications();

  const dismissWelcome = () => {
    setShowWelcome(false);
    toast({
      title: "Welcome to Ollama Buddy IDE!",
      description: "Your AI-powered coding assistant is ready to help.",
    });
  };

  useEffect(() => {
    // If notifications are enabled, send a welcome notification
    if (notificationsEnabled) {
      sendNotification(
        "Ollama Buddy IDE",
        "Your AI-powered IDE is now connected and ready to assist you."
      );
    }
  }, [notificationsEnabled, sendNotification]);

  return (
    <EditorLayout 
      onSettingsClick={() => setShowSettings(!showSettings)}
    >
      {showWelcome && <WelcomeBanner onDismiss={dismissWelcome} />}
      {showSettings ? (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-grow overflow-hidden">
            <CodeEditor />
          </div>
          <div className="h-1/3 min-h-[250px] border-t border-border">
            <AIChat />
          </div>
        </div>
      )}
    </EditorLayout>
  );
};

const Index = () => {
  return (
    <ModelProvider>
      <OllamaDetector />
      <IndexContent />
    </ModelProvider>
  );
};

export default Index;
