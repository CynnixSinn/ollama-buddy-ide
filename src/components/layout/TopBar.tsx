
import { useState } from "react";
import { useModelContext } from "@/context/ModelContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Braces,
  Download,
  ChevronDown,
  Settings,
  MonitorSmartphone,
} from "lucide-react";

interface TopBarProps {
  onSettingsClick: () => void;
}

export function TopBar({ onSettingsClick }: TopBarProps) {
  const { availableModels, selectedModel, setSelectedModel } = useModelContext();
  const [filePath, setFilePath] = useState("main.py");

  return (
    <header className="border-b border-border bg-sidebar flex items-center justify-between p-2 px-4">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5">
          <div className="flex items-center">
            <Braces className="h-4 w-4 text-muted-foreground mr-2" />
            <span className="text-sm">{filePath}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Input
          className="max-w-[400px] h-8 bg-secondary"
          placeholder="Search code or commands..."
          size={30}
        />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span className="text-xs font-medium">Model</span>
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            {availableModels.map((model) => (
              <DropdownMenuItem
                key={model.id}
                className="flex flex-col items-start py-2"
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-center w-full">
                  <span className={selectedModel?.id === model.id ? "font-medium" : ""}>
                    {model.name}
                  </span>
                  {!model.installed && (
                    <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <MonitorSmartphone className="h-5 w-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
