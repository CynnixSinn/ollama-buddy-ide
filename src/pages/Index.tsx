
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import EditorLayout from "@/components/layout/EditorLayout";
import AIChat from "@/components/ai/AIChat";
import CodeEditor from "@/components/editor/CodeEditor";
import SettingsPanel from "@/components/settings/SettingsPanel";
import WelcomeBanner from "@/components/intro/WelcomeBanner";
import { ModelProvider } from "@/context/ModelContext";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const dismissWelcome = () => {
    setShowWelcome(false);
    toast({
      title: "Welcome to Ollama Buddy IDE!",
      description: "Your AI-powered coding assistant is ready to help.",
    });
  };

  return (
    <ModelProvider>
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
    </ModelProvider>
  );
};

export default Index;
