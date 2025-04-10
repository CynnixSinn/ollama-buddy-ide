
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const sampleCode = `import os
import sys
from typing import List, Dict, Any, Optional

class CodeAssistant:
    """
    AI-powered code assistant that helps with coding tasks.
    Leverages Ollama models for generating and completing code.
    """
    
    def __init__(self, model_name: str = "codellama"):
        self.model_name = model_name
        self.context: List[Dict[str, Any]] = []
        self.initialized = False
        
    def initialize(self) -> bool:
        """Initialize the code assistant with the selected model."""
        try:
            # Connect to local Ollama instance
            print(f"Initializing with model: {self.model_name}")
            self.initialized = True
            return True
        except Exception as e:
            print(f"Error initializing: {str(e)}")
            return False
    
    def complete_code(self, prompt: str) -> Optional[str]:
        """Generate code completion based on the prompt."""
        if not self.initialized:
            if not self.initialize():
                return None
                
        # This would call the Ollama API in a real implementation
        print(f"Generating completion for: {prompt[:30]}...")
        
        # Simulated response
        return "def analyze_data(data):\\n    results = {}\\n    # TODO: Implement data analysis\\n    return results"
        
    def explain_code(self, code: str) -> str:
        """Explain what the provided code does."""
        return "This code defines a function that analyzes data and returns results in a dictionary format."

# Example usage
if __name__ == "__main__":
    assistant = CodeAssistant()
    completion = assistant.complete_code("def sort_array(arr):")
    print(completion)`;

// Basic syntax highlighting for Python
const highlightPython = (code: string) => {
  return code.split('\n').map((line, index) => {
    const lineNumber = index + 1;
    
    // Replace Python keywords with styled spans
    let highlightedLine = line
      .replace(/(import|from|class|def|if|else|elif|try|except|return|for|in|as|with|self|print|and|or|not|None|True|False|str|int|float|bool|list|dict|tuple|set|Optional|Any|List|Dict)/g, '<span class="code-keyword">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="code-string">$1</span>')
      .replace(/(\d+)/g, '<span class="code-number">$1</span>')
      .replace(/(#.*$)/g, '<span class="code-comment">$1</span>');
    
    return (
      <div key={lineNumber} className="code-line group">
        <span className="code-line-number">{lineNumber}</span>
        <span 
          className="code-line-content"
          dangerouslySetInnerHTML={{ __html: highlightedLine }}
        />
      </div>
    );
  });
};

const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode);
  const [lines, setLines] = useState<JSX.Element[]>([]);

  useEffect(() => {
    setLines(highlightPython(code));
  }, [code]);

  return (
    <div className="h-full bg-card overflow-hidden flex flex-col">
      <div className="border-b border-border p-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">main.py</span>
          <span className="text-xs text-muted-foreground">- Python</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Syntax: Python 3.10
        </div>
      </div>
      
      <ScrollArea className="flex-1 editor-container">
        <div className="p-4">
          {lines}
          <div className="code-line">
            <span className="code-line-number">{lines.length + 1}</span>
            <span className="editor-cursor"></span>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeEditor;
