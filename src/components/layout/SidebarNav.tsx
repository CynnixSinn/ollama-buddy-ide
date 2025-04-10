
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  FileCode,
  FolderTree,
  MessageSquareText,
  Settings,
  Eye,
  Mic,
  Globe,
  HardDrive,
  Bell,
  BellRing,
  Brain,
  Terminal,
  CodeXml,
  Database,
  Image,
  Bot,
  Function,
  Search,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarNavProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarNav({ isCollapsed, onToggleCollapse }: SidebarNavProps) {
  const { selectedModel, mcpServers } = useModelContext();

  const getMcpIcon = (id: string) => {
    switch (id) {
      case "vision":
        return Eye;
      case "browser":
        return Globe;
      case "file-io":
        return FileCode;
      case "voice":
        return Mic;
      case "notification":
        return Bell;
      case "memory":
        return Brain;
      case "code-execution":
        return CodeXml;
      case "tools":
        return Terminal;
      case "rag":
        return Search;
      case "vector-db":
        return Database;
      case "image-gen":
        return Image;
      case "agents":
        return Bot;
      case "function-calling":
        return Function;
      default:
        return Database;
    }
  };

  const NavItem = ({ 
    icon: Icon, 
    label, 
    active = false, 
    badge = false,
    bridgeIcon: BridgeIcon = null
  }: { 
    icon: any; 
    label: string; 
    active?: boolean;
    badge?: boolean;
    bridgeIcon?: any;
  }) => {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full justify-start mb-1 relative",
                active && "bg-accent/10 text-accent hover:bg-accent/20",
                !isCollapsed && "pl-8"
              )}
            >
              <Icon className={cn("h-5 w-5", isCollapsed ? "" : "mr-2")} />
              {!isCollapsed && <span>{label}</span>}
              {badge && <Badge variant="outline" className="ml-auto text-xs px-1 py-0">New</Badge>}
              {BridgeIcon && !isCollapsed && (
                <div className="absolute left-0 inset-y-0 flex items-center pl-2">
                  <BridgeIcon className="h-3 w-3 text-accent" />
                </div>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const McpSection = () => {
    const enabledMcpServers = mcpServers.filter(server => server.enabled);
    
    return (
      <>
        <div className={cn(
          "flex items-center px-3 py-2",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <h3 className="text-xs uppercase text-muted-foreground">
              MCP Servers ({enabledMcpServers.length}/{mcpServers.length})
            </h3>
          )}
          {isCollapsed && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-5 w-5 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">MCP</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">MCP Servers ({enabledMcpServers.length}/{mcpServers.length})</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        {enabledMcpServers.length > 0 ? (
          enabledMcpServers.map(server => {
            const Icon = getMcpIcon(server.id);
            let BridgeIcon;
            
            switch (server.id) {
              case "notification":
                BridgeIcon = BellRing;
                break;
              case "memory":
                BridgeIcon = Brain;
                break;
              case "rag":
                BridgeIcon = Search;
                break;
              case "vector-db":
                BridgeIcon = ArrowUpDown;
                break;
              default:
                BridgeIcon = HardDrive;
                break;
            }
            
            return (
              <NavItem 
                key={server.id}
                icon={Icon} 
                label={server.name}
                bridgeIcon={BridgeIcon}
                badge={["notification", "voice", "rag", "agents", "function-calling"].includes(server.id)}
              />
            );
          })
        ) : (
          <div className={cn(
            "text-xs text-muted-foreground",
            isCollapsed ? "text-center px-1" : "px-3 py-2"
          )}>
            {isCollapsed ? "0" : "No MCP servers enabled"}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        "bg-sidebar h-full border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <Code2 className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold">Ollama Buddy</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={onToggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className={cn(
        "bg-accent/5 mx-3 mb-4 px-3 py-2 rounded-md",
        isCollapsed && "mx-2"
      )}>
        {!isCollapsed && selectedModel ? (
          <div>
            <div className="flex items-center">
              <span className="text-sm font-medium">{selectedModel.name}</span>
              <Badge variant="outline" className="ml-auto">{selectedModel.size}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active model</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Badge className="bg-accent text-white">
              {selectedModel?.size || "?B"}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3">
        <NavItem icon={FolderTree} label="Explorer" active />
        <NavItem icon={MessageSquareText} label="Chat" />
        <NavItem icon={Settings} label="Settings" />
        
        <Separator className="my-4" />
        
        <McpSection />
      </div>
    </div>
  );
}
