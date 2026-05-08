'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  File, 
  Folder, 
  Terminal, 
  Play, 
  Save,
  Share2,
  Settings,
  Plus,
  Code,
  Globe,
  Database,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  GitBranch,
  Package,
  Cpu,
  Zap
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  lastModified?: Date;
  size?: number;
}

interface Project {
  id: string;
  name: string;
  type: 'web' | 'python' | 'node' | 'react' | 'vue' | 'angular' | 'go' | 'rust' | 'docker';
  files: FileNode[];
  framework?: string;
  dependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  port?: number;
  buildCommand?: string;
  startCommand?: string;
}

const defaultProjects: Project[] = [
  {
    id: '1',
    name: 'React Web App',
    type: 'react',
    framework: 'Next.js',
    port: 3000,
    buildCommand: 'npm run build',
    startCommand: 'npm run dev',
    files: [
      {
        id: '1-1',
        name: 'src',
        type: 'folder',
        lastModified: new Date(),
        children: [
          {
            id: '1-1-1',
            name: 'App.js',
            type: 'file',
            language: 'javascript',
            content: `export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Welcome to Your React App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Built with Biz Boost Anything Builder
        </p>
        <button className="bg-bizboost-primary text-white px-6 py-3 rounded-lg hover:bg-bizboost-primary-90 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
}`,
            lastModified: new Date(),
            size: 456
          },
          {
            id: '1-1-2',
            name: 'styles.css',
            type: 'file',
            language: 'css',
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}`,
            lastModified: new Date(),
            size: 156
          }
        ]
      },
      {
        id: '1-2',
        name: 'package.json',
        type: 'file',
        language: 'json',
        content: JSON.stringify({
          name: 'my-react-app',
          version: '0.1.0',
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start'
          },
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0',
            next: '^14.0.0',
            tailwindcss: '^3.0.0'
          }
        }, null, 2),
        lastModified: new Date(),
        size: 234
      }
    ]
  },
  {
    id: '2',
    name: 'Python FastAPI',
    type: 'python',
    port: 8000,
    buildCommand: 'pip install -r requirements.txt',
    startCommand: 'uvicorn app:main --reload --host 0.0.0.0 --port 8000',
    files: [
      {
        id: '2-1',
        name: 'app.py',
        type: 'file',
        language: 'python',
        content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import json

app = FastAPI(title="Biz Boost API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    id: int
    name: str
    description: str = None

# Sample data
items = [
    {"id": 1, "name": "Biz Boost Service", "description": "AI-powered development platform"},
    {"id": 2, "name": "Code Generator", "description": "Generate code with AI assistance"},
]

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Biz Boost API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/items", response_model=List[Item])
def read_items():
    return items

@app.get("/items/{item_id}", response_model=Item)
def read_item(item_id: int):
    if item_id > len(items):
        return {"error": "Item not found"}
    return items[item_id - 1]

@app.post("/items")
def create_item(item: Item):
    new_id = len(items) + 1
    new_item = {"id": new_id, **item.dict()}
    items.append(new_item)
    return new_item

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
        lastModified: new Date(),
        size: 1234
      },
      {
        id: '2-2',
        name: 'requirements.txt',
        type: 'file',
        language: 'text',
        content: 'fastapi==0.104.1\nuvicorn[standard]==0.24.0\npydantic==2.5.0\ncors==0.0.0',
        lastModified: new Date(),
        size: 78
      }
    ]
  },
  {
    id: '3',
    name: 'Node.js Express API',
    type: 'node',
    port: 3001,
    buildCommand: 'npm install',
    startCommand: 'npm start',
    files: [
      {
        id: '3-1',
        name: 'server.js',
        type: 'file',
        language: 'javascript',
        content: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Biz Boost Node.js API',
    version: '1.0.0',
    endpoints: [
      'GET /health',
      'GET /api/users',
      'POST /api/users'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Biz Boost User', email: 'user@bizboost.com' },
    { id: 2, name: 'AI Assistant', email: 'ai@bizboost.com' }
  ];
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: Date.now(),
    name,
    email
  };
  res.status(201).json(newUser);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on port \${PORT}\`);
  console.log(\`📖 API documentation: http://localhost:\${PORT}\`);
});`,
        lastModified: new Date(),
        size: 1567
      },
      {
        id: '3-2',
        name: 'package.json',
        type: 'file',
        language: 'json',
        content: JSON.stringify({
          name: 'bizboost-node-api',
          version: '1.0.0',
          description: 'Node.js Express API built with Biz Boost',
          main: 'server.js',
          scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js',
            test: 'jest'
          },
          dependencies: {
            express: '^4.18.2',
            cors: '^2.8.5',
            helmet: '^7.1.0',
            'express-rate-limit': '^7.1.5'
          },
          devDependencies: {
            nodemon: '^3.0.2',
            jest: '^29.7.0'
          }
        }, null, 2),
        lastModified: new Date(),
        size: 345
      }
    ]
  }
];

export default function BuilderPage() {
  const [selectedProject, setSelectedProject] = useState<Project>(defaultProjects[0]);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview' | 'terminal' | 'ai'>('code');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFile?.content) {
      setFileContent(selectedFile.content);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleRunProject = async () => {
    setIsRunning(true);
    setTerminalOutput(prev => [...prev, `$ 🚀 Starting ${selectedProject.name}...`]);
    setTerminalOutput(prev => [...prev, `$ 📦 Installing dependencies...`]);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, `✅ Dependencies installed successfully`]);
      setTerminalOutput(prev => [...prev, `$ 🔨 Building project...`]);
    }, 1000);
    
    setTimeout(() => {
      setTerminalOutput(prev => [...prev, `✅ Build completed successfully`]);
      setTerminalOutput(prev => [...prev, `$ 🌐 Starting server on port ${selectedProject.port}...`]);
      
      // Set preview URL based on project type
      const urls = {
        react: 'http://localhost:3000',
        python: 'http://localhost:8000',
        node: 'http://localhost:3001',
        go: 'http://localhost:8080',
        vue: 'http://localhost:3002',
        angular: 'http://localhost:3003',
        web: 'http://localhost:3004',
        rust: 'http://localhost:3005',
        docker: 'http://localhost:3006'
      };
      
      setPreviewUrl(urls[selectedProject.type] || urls.web);
      setIsRunning(false);
      setTerminalOutput(prev => [...prev, `✅ Server running at ${urls[selectedProject.type] || urls.web}`]);
      setTerminalOutput(prev => [...prev, `🔗 Live preview available`]);
    }, 2000);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsAiGenerating(true);
    setTerminalOutput(prev => [...prev, `$ 🤖 AI generating code for: "${aiPrompt}"`]);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedCode = `// AI Generated Code for: ${aiPrompt}
// Generated by Biz Boost AI Builder

function ${aiPrompt.toLowerCase().replace(/\s+/g, '_')}() {
  console.log("Hello from AI-generated function!");
  
  // This code was generated based on your prompt
  const result = {
    message: "AI-powered development",
    timestamp: new Date().toISOString(),
    prompt: "${aiPrompt}"
  };
  
  return result;
}

// Export for use in your application
module.exports = { ${aiPrompt.toLowerCase().replace(/\s+/g, '_')} };`;
      
      setFileContent(generatedCode);
      setTerminalOutput(prev => [...prev, `✅ AI code generation completed`]);
      setIsAiGenerating(false);
      setAiPrompt('');
    }, 2000);
  };

  const renderFileTree = (files: FileNode[], level = 0) => {
    return files.map(file => (
      <div key={file.id} style={{ marginLeft: `${level * 16}px` }}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer transition-colors ${
            selectedFile?.id === file.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => {
            if (file.type === 'file') {
              setSelectedFile(file);
            }
          }}
        >
          {file.type === 'folder' ? (
            <Folder className="w-4 h-4 text-yellow-600" />
          ) : (
            <File className="w-4 h-4 text-blue-600" />
          )}
          <span className="text-sm font-mono">{file.name}</span>
          {file.size && (
            <span className="text-xs text-gray-500 ml-auto">{file.size}B</span>
          )}
        </div>
        {file.children && renderFileTree(file.children, level + 1)}
      </div>
    ));
  };

  const getLanguageIcon = (language?: string) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      html: '🌐',
      css: '🎨',
      json: '📋',
      go: '🐹',
      rust: '🦀',
      docker: '🐳',
      text: '📄'
    };
    return icons[language as keyof typeof icons] || '📄';
  };

  const filteredProjects = defaultProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-bizboost-primary" />
              Biz Boost Anything Builder
            </h1>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm w-48"
              />
              <select
                value={selectedProject.id}
                onChange={(e) => {
                  const project = defaultProjects.find(p => p.id === e.target.value);
                  if (project) setSelectedProject(project);
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white"
              >
                {filteredProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.type})
                  </option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-3 py-1 bg-bizboost-primary text-white rounded-md text-sm hover:bg-bizboost-primary-90 transition-colors">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <GitBranch className="w-4 h-4" />
              Git
            </button>
            <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - File Explorer */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Folder className="w-4 h-4" />
                {selectedProject.name}
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedProject.framework} • Port {selectedProject.port}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {renderFileTree(selectedProject.files)}
          </div>
          
          <div className="p-3 border-t border-gray-200 space-y-2">
            <button
              onClick={handleRunProject}
              disabled={isRunning}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Project
                </>
              )}
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'code'
                    ? 'border-bizboost-primary text-bizboost-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4" />
                Code
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'preview'
                    ? 'border-bizboost-primary text-bizboost-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'terminal'
                    ? 'border-bizboost-primary text-bizboost-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Terminal className="w-4 h-4" />
                Terminal
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'ai'
                    ? 'border-bizboost-primary text-bizboost-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Cpu className="w-4 h-4" />
                AI Assistant
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'code' && (
              <div className="h-full flex">
                {/* Code Editor */}
                <div className="flex-1 flex flex-col">
                  {selectedFile && (
                    <>
                      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm">{getLanguageIcon(selectedFile.language)}</span>
                          <span className="text-white text-sm font-medium">{selectedFile.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-white transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                        spellCheck={false}
                        placeholder="Start coding..."
                      />
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full bg-white">
                {previewUrl ? (
                  <div className="h-full flex flex-col">
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Live Preview</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Running</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <iframe
                      src={previewUrl}
                      className="flex-1 border-0"
                      title="Live Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">No Active Preview</p>
                      <p className="text-sm">Run your project to see live preview</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'terminal' && (
              <div className="h-full bg-black flex flex-col">
                <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                  <span className="text-green-400 text-sm font-medium">Terminal</span>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div
                  ref={terminalRef}
                  className="flex-1 p-4 font-mono text-sm text-green-400 overflow-y-auto"
                >
                  {terminalOutput.length === 0 ? (
                    <div className="text-gray-500">
                      $ Run your project to see terminal output...
                    </div>
                  ) : (
                    terminalOutput.map((line, index) => (
                      <div key={index} className="mb-1">{line}</div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="h-full bg-white p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-bizboost-primary" />
                      AI Code Assistant
                    </h3>
                    <p className="text-gray-600">
                      Generate code, get help with debugging, or refactor existing code using AI.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to create or modify?
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Example: Create a React component for a user profile card with avatar and details..."
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bizboost-primary focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleAiGenerate}
                        disabled={isAiGenerating || !aiPrompt.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-bizboost-primary text-white rounded-lg hover:bg-bizboost-primary-90 disabled:opacity-50 transition-colors"
                      >
                        {isAiGenerating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4" />
                            Generate Code
                          </>
                        )}
                      </button>
                      
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <Package className="w-4 h-4 inline mr-2" />
                        Templates
                      </button>
                    </div>
                  </div>
                  
                  {isAiGenerating && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-blue-800 text-sm">AI is generating your code...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}