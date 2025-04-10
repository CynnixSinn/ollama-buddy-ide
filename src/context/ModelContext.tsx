
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

export type OllamaModel = {
  id: string;
  name: string;
  size: string;
  description: string;
  installed: boolean;
  capabilities: string[];
};

type McpServer = {
  id: string;
  name: string;
  description: string;
  url: string;
  github: string;
  enabled: boolean;
  capabilities: string[];
  configOptions?: Record<string, any>;
};

type ModelContextType = {
  availableModels: OllamaModel[];
  selectedModel: OllamaModel | null;
  setSelectedModel: (model: OllamaModel) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  ollamaEndpoint: string;
  setOllamaEndpoint: (endpoint: string) => void;
  refreshModels: () => Promise<void>;
  mcpServers: McpServer[];
  toggleMcpServer: (id: string) => void;
  getMcpServer: (id: string) => McpServer | undefined;
  updateMcpServerConfig: (id: string, config: Record<string, any>) => void;
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

const defaultMcpServers: McpServer[] = [
  {
    id: "vision",
    name: "Computer Vision",
    description: "Visual understanding and screen analysis capabilities",
    url: "https://github.com/microsoft/autogen",
    github: "microsoft/autogen",
    enabled: false,
    capabilities: ["screenshot", "image-analysis", "code-visualization"],
    configOptions: {
      allowScreenCapture: true,
      processingQuality: "high",
      modelType: "clip"
    }
  },
  {
    id: "browser",
    name: "Web Browser",
    description: "Enables web browsing and research capabilities",
    url: "https://github.com/n4ze3m/page-assist/tree/main/server",
    github: "n4ze3m/page-assist",
    enabled: false,
    capabilities: ["web-search", "webpage-analysis", "information-retrieval"],
    configOptions: {
      searchEngine: "duckduckgo",
      resultLimit: 5,
      userAgent: "Mozilla/5.0 (compatible; OllamaBuddy/1.0)"
    }
  },
  {
    id: "file-io",
    name: "File System",
    description: "Read and write files on your local system",
    url: "https://github.com/jmorganca/ollama",
    github: "jmorganca/ollama",
    enabled: false,
    capabilities: ["file-read", "file-write", "directory-listing"],
    configOptions: {
      allowedDirectories: ["/home/user/projects"],
      readOnly: false,
      maxFileSize: 10 // MB
    }
  },
  {
    id: "voice",
    name: "Voice Assistant",
    description: "Speech recognition and voice synthesis",
    url: "https://github.com/coqui-ai/TTS",
    github: "coqui-ai/TTS",
    enabled: false,
    capabilities: ["speech-to-text", "text-to-speech", "voice-commands"],
    configOptions: {
      voiceModel: "default",
      language: "en-US",
      audioQuality: "high"
    }
  },
  {
    id: "notification",
    name: "Notifications",
    description: "Send notifications to mobile devices",
    url: "https://github.com/caronc/apprise",
    github: "caronc/apprise",
    enabled: false,
    capabilities: ["push-notifications", "email-alerts", "sms-messages"],
    configOptions: {
      notificationService: "telegram",
      contactInfo: "",
      priorityLevel: "normal"
    }
  },
  {
    id: "memory",
    name: "Long-term Memory",
    description: "Persistent memory storage for conversations",
    url: "https://github.com/langchain-ai/langchainjs",
    github: "langchain-ai/langchainjs",
    enabled: false,
    capabilities: ["conversation-history", "knowledge-persistence", "context-recall"],
    configOptions: {
      storageType: "local",
      retention: 30,
      vectorStore: "faiss"
    }
  },
  {
    id: "code-execution",
    name: "Code Execution",
    description: "Safely execute and test code snippets",
    url: "https://github.com/lablup/backend.ai",
    github: "lablup/backend.ai",
    enabled: false,
    capabilities: ["code-execution", "sandbox-environment", "test-runner"],
    configOptions: {
      languages: ["javascript", "python", "bash"],
      timeoutSeconds: 10,
      memoryLimit: 512 // MB
    }
  },
  {
    id: "tools",
    name: "Developer Tools",
    description: "Access to programming tools and utilities",
    url: "https://github.com/TomWright/dasel",
    github: "TomWright/dasel",
    enabled: false,
    capabilities: ["git-operations", "data-parsing", "format-conversion"],
    configOptions: {
      allowedTools: ["git", "docker", "npm"],
      restrictSudoCommands: true,
      environmentIsolation: "container"
    }
  },
  {
    id: "rag",
    name: "RAG Engine",
    description: "Retrieval-Augmented Generation for content generation",
    url: "https://github.com/jerryjliu/llama_index",
    github: "jerryjliu/llama_index",
    enabled: false,
    capabilities: ["document-indexing", "retrieval", "augmented-generation"],
    configOptions: {
      embeddingModel: "sentence-transformers",
      chunkSize: 512,
      maxResults: 5,
      similarityThreshold: 0.7
    }
  },
  {
    id: "vector-db",
    name: "Vector Database",
    description: "Semantic search and storage for embeddings",
    url: "https://github.com/milvus-io/milvus",
    github: "milvus-io/milvus",
    enabled: false,
    capabilities: ["vector-storage", "similarity-search", "knowledge-base"],
    configOptions: {
      dimensions: 1536,
      metricType: "cosine",
      persistData: true,
      dbPath: "./vector-db"
    }
  },
  {
    id: "image-gen",
    name: "Image Generation",
    description: "Generate images from text descriptions",
    url: "https://github.com/CompVis/stable-diffusion",
    github: "CompVis/stable-diffusion",
    enabled: false,
    capabilities: ["text-to-image", "image-editing", "style-transfer"],
    configOptions: {
      model: "stable-diffusion-xl",
      width: 512,
      height: 512,
      steps: 20,
      cfgScale: 7.0
    }
  },
  {
    id: "agents",
    name: "Autonomous Agents",
    description: "Self-directed AI agents that can complete complex tasks",
    url: "https://github.com/yoheinakajima/babyagi",
    github: "yoheinakajima/babyagi",
    enabled: false,
    capabilities: ["task-planning", "execution", "tool-usage"],
    configOptions: {
      maxIterations: 5,
      maxTasks: 10,
      objective: "Complete research tasks"
    }
  },
  {
    id: "function-calling",
    name: "Function Calling",
    description: "Allow models to call external functions",
    url: "https://github.com/langchain-ai/langchain",
    github: "langchain-ai/langchain",
    enabled: false,
    capabilities: ["tool-calling", "api-integration", "structured-output"],
    configOptions: {
      allowedFunctions: ["calculator", "weather", "search"],
      strictValidation: true,
      timeoutSeconds: 30
    }
  },
  {
    id: "text-to-sql",
    name: "Text to SQL",
    description: "Convert natural language queries to SQL statements",
    url: "https://github.com/defog-ai/sqlcoder",
    github: "defog-ai/sqlcoder",
    enabled: false,
    capabilities: ["natural-language-to-sql", "database-schema-understanding", "query-generation"],
    configOptions: {
      databaseDialect: "postgresql",
      explainQueries: true,
      includeSampleData: false
    }
  },
  {
    id: "chatbot",
    name: "Chatbot Builder",
    description: "Create and deploy customizable chatbots",
    url: "https://github.com/botpress/botpress",
    github: "botpress/botpress",
    enabled: false,
    capabilities: ["conversation-design", "intent-recognition", "multi-platform-deployment"],
    configOptions: {
      framework: "botpress",
      channels: ["web", "telegram", "slack"],
      nluEngine: "builtin"
    }
  },
  {
    id: "pdf-tools",
    name: "PDF Processor",
    description: "Extract information and convert PDF documents",
    url: "https://github.com/pymupdf/PyMuPDF",
    github: "pymupdf/PyMuPDF",
    enabled: false,
    capabilities: ["text-extraction", "pdf-parsing", "document-conversion"],
    configOptions: {
      extractImages: true,
      ocrEnabled: false,
      preserveFormatting: true
    }
  }
];

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider = ({ children }: { children: ReactNode }) => {
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>(defaultModels);
  const [selectedModel, setSelectedModel] = useState<OllamaModel | null>(defaultModels[0]);
  const [isConnected, setIsConnected] = useState(true);
  const [ollamaEndpoint, setOllamaEndpoint] = useState("http://localhost:11434");
  const [mcpServers, setMcpServers] = useState<McpServer[]>(defaultMcpServers);

  const detectLocalOllamaModels = async () => {
    try {
      const response = await fetch(`${ollamaEndpoint}/api/tags`);
      
      if (!response.ok) {
        throw new Error("Failed to connect to Ollama");
      }
      
      const data = await response.json();
      
      if (data.models) {
        const detectedModels: OllamaModel[] = data.models.map((model: any) => {
          const existingModel = availableModels.find(m => m.id === model.name);
          return {
            id: model.name,
            name: model.name.charAt(0).toUpperCase() + model.name.slice(1),
            size: model.size ? `${Math.round(model.size / 1000000000)}B` : "?B",
            description: model.details || `Local ${model.name} model`,
            installed: true,
            capabilities: existingModel?.capabilities || ["chat", "code", "completion"],
          };
        });
        
        setAvailableModels(detectedModels);
        
        if (detectedModels.length > 0 && !selectedModel) {
          setSelectedModel(detectedModels[0]);
        }
        
        setIsConnected(true);
        toast({
          title: "Ollama connected",
          description: `Found ${detectedModels.length} local models`
        });
      }
    } catch (error) {
      console.error("Failed to detect Ollama models:", error);
      setIsConnected(false);
    }
  };

  const refreshModels = async () => {
    await detectLocalOllamaModels();
  };

  const toggleMcpServer = (id: string) => {
    setMcpServers(servers => 
      servers.map(server => 
        server.id === id ? { ...server, enabled: !server.enabled } : server
      )
    );
    
    const server = mcpServers.find(s => s.id === id);
    if (server) {
      toast({
        title: server.enabled ? `${server.name} Disabled` : `${server.name} Enabled`,
        description: server.enabled 
          ? `${server.name} MCP server has been disabled` 
          : `${server.name} MCP server has been enabled`
      });
    }
  };

  const getMcpServer = (id: string) => {
    return mcpServers.find(server => server.id === id);
  };

  const updateMcpServerConfig = (id: string, config: Record<string, any>) => {
    setMcpServers(servers =>
      servers.map(server =>
        server.id === id ? { ...server, configOptions: { ...server.configOptions, ...config } } : server
      )
    );
  };

  useEffect(() => {
    // Auto-detect models on mount
    detectLocalOllamaModels();
  }, [ollamaEndpoint]);

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
        refreshModels,
        mcpServers,
        toggleMcpServer,
        getMcpServer,
        updateMcpServerConfig
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
