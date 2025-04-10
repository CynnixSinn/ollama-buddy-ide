
import { createContext, useContext, useState, ReactNode } from "react";

export type OllamaModel = {
  id: string;
  name: string;
  size: string;
  description: string;
  installed: boolean;
  capabilities: string[];
};

type ModelContextType = {
  availableModels: OllamaModel[];
  selectedModel: OllamaModel | null;
  setSelectedModel: (model: OllamaModel) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  ollamaEndpoint: string;
  setOllamaEndpoint: (endpoint: string) => void;
};

const defaultModels: OllamaModel[] = [
  {
    id: "llama3",
    name: "Llama 3 8B",
    size: "8B",
    description: "Meta's latest open model, great for code generation",
    installed: true,
    capabilities: ["chat", "code", "completion"],
  },
  {
    id: "codellama",
    name: "Code Llama 15B",
    size: "15B",
    description: "Specialized for code generation and completion",
    installed: true,
    capabilities: ["chat", "code", "completion", "debug"],
  },
  {
    id: "phi3",
    name: "Phi-3 14B",
    size: "14B",
    description: "Microsoft's latest model with strong coding abilities",
    installed: false,
    capabilities: ["chat", "code", "reasoning"],
  },
  {
    id: "llava",
    name: "LLaVa 34B",
    size: "34B",
    description: "Multimodal model with vision capabilities",
    installed: false,
    capabilities: ["chat", "code", "vision"],
  },
];

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [availableModels] = useState<OllamaModel[]>(defaultModels);
  const [selectedModel, setSelectedModel] = useState<OllamaModel | null>(defaultModels[0]);
  const [isConnected, setIsConnected] = useState(true);
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434");

  return (
    <ModelContext.Provider
      value={{
        availableModels,
        selectedModel,
        setSelectedModel,
        isConnected,
        setIsConnected,
        ollamaEndpoint,
        setOllamaEndpoint,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModelContext must be used within a ModelProvider");
  }
  return context;
};
