
import { useState } from "react";
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  Settings,
  X,
  Server,
  MessageSquareText,
  Bell,
  Mic,
  Eye,
  Globe,
  HardDrive,
  RefreshCw,
  Download,
  CheckCircle2,
} from "lucide-react";

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { 
    availableModels, 
    selectedModel, 
    setSelectedModel,
    ollamaEndpoint,
    setOllamaEndpoint
  } = useModelContext();
  
  const [endpoint, setEndpoint] = useState(ollamaEndpoint);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [visionEnabled, setVisionEnabled] = useState(true);
  const [browserEnabled, setBrowserEnabled] = useState(true);
  const [fileSystemEnabled, setFileSystemEnabled] = useState(true);
  
  const handleSave = () => {
    setOllamaEndpoint(endpoint);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-semibold">Settings</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Tabs defaultValue="connection" className="flex-1 overflow-hidden">
        <div className="border-b border-border">
          <TabsList className="w-full justify-start px-6">
            <TabsTrigger value="connection" className="text-sm">
              <Server className="h-4 w-4 mr-2" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="models" className="text-sm">
              <MessageSquareText className="h-4 w-4 mr-2" />
              Models
            </TabsTrigger>
            <TabsTrigger value="mcp" className="text-sm">
              <HardDrive className="h-4 w-4 mr-2" />
              MCP Servers
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          <TabsContent value="connection" className="p-6">
            <h3 className="text-lg font-medium mb-4">Ollama Connection</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endpoint">Ollama Endpoint</Label>
                <Input
                  id="endpoint"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="http://localhost:11434"
                />
                <p className="text-sm text-muted-foreground">
                  The URL where your Ollama instance is running
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Button 
                  variant="outline"
                  className="flex items-center"
                  onClick={() => {
                    toast({
                      title: "Connection test",
                      description: "Testing connection to Ollama...",
                    });
                    
                    // Simulate connection test
                    setTimeout(() => {
                      toast({
                        title: "Connection successful",
                        description: "Successfully connected to Ollama",
                      });
                    }, 1500);
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="p-6">
            <h3 className="text-lg font-medium mb-4">Ollama Models</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your Ollama models and select which one to use for code generation and assistance.
            </p>

            <div className="space-y-4">
              {availableModels.map((model) => (
                <div 
                  key={model.id}
                  className={`p-4 rounded-lg border ${
                    selectedModel?.id === model.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{model.name}</h4>
                        {model.installed && (
                          <div className="ml-2 flex items-center text-xs text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Installed
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {model.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {model.capabilities.map((capability) => (
                          <span 
                            key={capability}
                            className="text-xs bg-secondary px-2 py-0.5 rounded"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!model.installed ? (
                      <Button variant="outline" size="sm">
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Install
                      </Button>
                    ) : (
                      <Button 
                        variant={selectedModel?.id === model.id ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setSelectedModel(model)}
                      >
                        {selectedModel?.id === model.id ? "Selected" : "Select"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mcp" className="p-6">
            <h3 className="text-lg font-medium mb-4">MCP Servers</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure multimodal capability provider (MCP) servers that extend Ollama Buddy's abilities.
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-3 text-accent" />
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Send notifications to your mobile device
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mic className="h-5 w-5 mr-3 text-accent" />
                    <div>
                      <h4 className="font-medium">Voice Input/Output</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable voice interaction with Ollama models
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={voiceEnabled}
                    onCheckedChange={setVoiceEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-3 text-accent" />
                    <div>
                      <h4 className="font-medium">Computer Vision</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to see and analyze your screen
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={visionEnabled}
                    onCheckedChange={setVisionEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-accent" />
                    <div>
                      <h4 className="font-medium">Browser Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to perform web searches and access online resources
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={browserEnabled}
                    onCheckedChange={setBrowserEnabled}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-3 text-accent" />
                    <div>
                      <h4 className="font-medium">File System Access</h4>
                      <p className="text-sm text-muted-foreground">
                        Allow AI to read and write files on your system
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={fileSystemEnabled}
                    onCheckedChange={setFileSystemEnabled}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <div className="border-t border-border p-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
