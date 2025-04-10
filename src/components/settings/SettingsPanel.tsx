
import { useState, useEffect } from "react";
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Github,
  AlertCircle,
  Brain,
  CodeXml,
  Terminal,
  Database,
  SmartphoneNfc
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SettingsPanelProps {
  onClose: () => void;
}

const McpIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "vision":
      return <Eye className="h-5 w-5 mr-3 text-accent" />;
    case "browser":
      return <Globe className="h-5 w-5 mr-3 text-accent" />;
    case "file-io":
      return <HardDrive className="h-5 w-5 mr-3 text-accent" />;
    case "voice":
      return <Mic className="h-5 w-5 mr-3 text-accent" />;
    case "notification":
      return <Bell className="h-5 w-5 mr-3 text-accent" />;
    case "memory":
      return <Brain className="h-5 w-5 mr-3 text-accent" />;
    case "code-execution":
      return <CodeXml className="h-5 w-5 mr-3 text-accent" />;
    case "tools":
      return <Terminal className="h-5 w-5 mr-3 text-accent" />;
    default:
      return <Database className="h-5 w-5 mr-3 text-accent" />;
  }
};

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const { 
    availableModels, 
    selectedModel, 
    setSelectedModel,
    ollamaEndpoint,
    setOllamaEndpoint,
    refreshModels,
    isConnected,
    mcpServers,
    toggleMcpServer,
    updateMcpServerConfig
  } = useModelContext();
  
  const [endpoint, setEndpoint] = useState(ollamaEndpoint);
  const [isLoading, setIsLoading] = useState(false);
  const [openConfigs, setOpenConfigs] = useState<Record<string, boolean>>({});
  
  const handleSave = () => {
    setOllamaEndpoint(endpoint);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
    onClose();
  };

  const handleRefreshModels = async () => {
    setIsLoading(true);
    await refreshModels();
    setIsLoading(false);
  };

  const toggleConfigPanel = (id: string) => {
    setOpenConfigs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    // Pre-populate openConfigs state
    const configs: Record<string, boolean> = {};
    mcpServers.forEach(server => {
      configs[server.id] = false;
    });
    setOpenConfigs(configs);
  }, [mcpServers]);

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
                  onClick={handleRefreshModels}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Test Connection
                </Button>
                
                {isConnected && (
                  <div className="flex items-center text-sm text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Connected
                  </div>
                )}
                
                {!isConnected && (
                  <div className="flex items-center text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Not connected
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Ollama Models</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshModels}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Models
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {availableModels.length > 0 
                ? `${availableModels.filter(m => m.installed).length} installed models found on your system.`
                : "No models detected. Make sure Ollama is running and has models installed."}
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">MCP Servers</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  let enabledCount = 0;
                  mcpServers.forEach(server => {
                    if (server.enabled) enabledCount++;
                  });
                  
                  toast({
                    title: "MCP Servers",
                    description: `${enabledCount} MCP servers are currently enabled`
                  });
                }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Check Status
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Configure multimodal capability provider (MCP) servers that extend Ollama Buddy's abilities.
              Toggle switches to quickly enable or disable services.
            </p>

            <div className="space-y-6">
              <div className="space-y-4">
                {mcpServers.map((server) => (
                  <div key={server.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <McpIcon id={server.id} />
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{server.name}</h4>
                            {server.id === "notification" && <Badge className="ml-2 bg-accent text-white text-xs">New</Badge>}
                            {server.id === "voice" && <Badge className="ml-2 bg-accent text-white text-xs">New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {server.description}
                          </p>
                        </div>
                      </div>
                      <Switch 
                        checked={server.enabled}
                        onCheckedChange={() => toggleMcpServer(server.id)}
                      />
                    </div>
                    
                    <div className="ml-8 mt-2">
                      <Collapsible open={openConfigs[server.id]} onOpenChange={() => toggleConfigPanel(server.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            {openConfigs[server.id] ? "Hide configuration" : "Show configuration"}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-3 p-3 bg-secondary/10 rounded-md">
                          {server.configOptions && Object.entries(server.configOptions).map(([key, value]) => {
                            // Render different input types based on value type
                            if (typeof value === "boolean") {
                              return (
                                <div key={key} className="flex items-center justify-between">
                                  <Label htmlFor={`${server.id}-${key}`} className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                                  <Switch 
                                    id={`${server.id}-${key}`}
                                    checked={value as boolean}
                                    onCheckedChange={(checked) => updateMcpServerConfig(server.id, { [key]: checked })}
                                  />
                                </div>
                              );
                            } else if (typeof value === "number") {
                              return (
                                <div key={key} className="space-y-1">
                                  <Label htmlFor={`${server.id}-${key}`} className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                                  <Input 
                                    id={`${server.id}-${key}`}
                                    type="number"
                                    value={value}
                                    onChange={(e) => updateMcpServerConfig(server.id, { [key]: parseInt(e.target.value) })}
                                    className="h-8"
                                  />
                                </div>
                              );
                            } else if (Array.isArray(value)) {
                              return (
                                <div key={key} className="space-y-1">
                                  <Label className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                                  <div className="flex flex-wrap gap-1">
                                    {(value as string[]).map((item, i) => (
                                      <Badge key={i} variant="outline" className="bg-secondary/20">
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div key={key} className="space-y-1">
                                  <Label htmlFor={`${server.id}-${key}`} className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                                  {key.includes("engine") || key.includes("Service") || key.includes("Type") || key.includes("Model") || key.includes("language") ? (
                                    <Select 
                                      onValueChange={(val) => updateMcpServerConfig(server.id, { [key]: val })}
                                      defaultValue={value as string}
                                    >
                                      <SelectTrigger className="h-8">
                                        <SelectValue placeholder={value as string} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {key.includes("engine") && [
                                          <SelectItem key="google" value="google">Google</SelectItem>,
                                          <SelectItem key="duckduckgo" value="duckduckgo">DuckDuckGo</SelectItem>,
                                          <SelectItem key="bing" value="bing">Bing</SelectItem>
                                        ]}
                                        {key.includes("Service") && [
                                          <SelectItem key="telegram" value="telegram">Telegram</SelectItem>,
                                          <SelectItem key="discord" value="discord">Discord</SelectItem>,
                                          <SelectItem key="slack" value="slack">Slack</SelectItem>,
                                          <SelectItem key="email" value="email">Email</SelectItem>
                                        ]}
                                        {key.includes("Type") && [
                                          <SelectItem key="local" value="local">Local</SelectItem>,
                                          <SelectItem key="remote" value="remote">Remote</SelectItem>,
                                          <SelectItem key="hybrid" value="hybrid">Hybrid</SelectItem>
                                        ]}
                                        {key.includes("Model") && [
                                          <SelectItem key="default" value="default">Default</SelectItem>,
                                          <SelectItem key="female" value="female">Female</SelectItem>,
                                          <SelectItem key="male" value="male">Male</SelectItem>,
                                          <SelectItem key="neural" value="neural">Neural</SelectItem>
                                        ]}
                                        {key.includes("language") && [
                                          <SelectItem key="en-US" value="en-US">English (US)</SelectItem>,
                                          <SelectItem key="en-GB" value="en-GB">English (UK)</SelectItem>,
                                          <SelectItem key="es-ES" value="es-ES">Spanish</SelectItem>,
                                          <SelectItem key="fr-FR" value="fr-FR">French</SelectItem>,
                                          <SelectItem key="de-DE" value="de-DE">German</SelectItem>
                                        ]}
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <Input 
                                      id={`${server.id}-${key}`}
                                      value={value as string}
                                      onChange={(e) => updateMcpServerConfig(server.id, { [key]: e.target.value })}
                                      className="h-8"
                                      placeholder={`Enter ${key}`}
                                    />
                                  )}
                                </div>
                              );
                            }
                          })}
                          
                          <div className="pt-2 flex items-center justify-between">
                            <a 
                              href={server.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs flex items-center text-accent hover:underline"
                            >
                              <Github className="h-3.5 w-3.5 mr-1" />
                              View on GitHub
                            </a>
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              Reset Defaults
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    
                    <Separator className="my-4" />
                  </div>
                ))}
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
