import { execFile } from 'child_process';
import { promisify } from 'util';
import { SandboxProvider, SandboxInfo, CommandResult } from '../types';
import { appConfig } from '@/config/app.config';

const execFileAsync = promisify(execFile);

const DOCKER_BUFFER = 50 * 1024 * 1024;

interface DockerResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

async function docker(args: string[], input?: string): Promise<DockerResult> {
  return new Promise((resolve) => {
    const child = execFile(
      'docker',
      args,
      { maxBuffer: DOCKER_BUFFER, encoding: 'utf8' },
      (error, stdout, stderr) => {
        let exitCode = 0;
        if (error) {
          const code = (error as NodeJS.ErrnoException).code;
          exitCode = typeof code === 'number' ? code : 1;
          if (typeof code === 'string') {
            stderr = `${stderr}\n${error.message}`;
          }
        }
        resolve({ stdout: stdout ?? '', stderr: stderr ?? '', exitCode });
      }
    );
    if (input !== undefined && child.stdin) {
      child.stdin.end(input);
    } else if (child.stdin) {
      child.stdin.end();
    }
  });
}

/**
 * Runs generated apps inside a local Docker container.
 * Requires the `docker` CLI on the host running this Next.js app.
 */
export class DockerProvider extends SandboxProvider {
  private existingFiles: Set<string> = new Set();
  private containerId: string | null = null;

  private get workDir(): string {
    return appConfig.docker.workingDirectory;
  }

  private exec(args: string[], input?: string): Promise<DockerResult> {
    if (!this.containerId) {
      throw new Error('No active sandbox');
    }
    return docker(['exec', '-i', '-w', this.workDir, this.containerId, ...args], input);
  }

  async createSandbox(): Promise<SandboxInfo> {
    await this.terminate();
    this.existingFiles.clear();

    const version = await docker(['version', '--format', '{{.Server.Version}}']);
    if (version.exitCode !== 0) {
      throw new Error(
        `Docker daemon is not reachable. Make sure Docker is installed and running. ${version.stderr.trim()}`
      );
    }

    const image = appConfig.docker.image;
    const port = appConfig.docker.vitePort;
    const bindHost = appConfig.docker.bindHost;

    const run = await docker([
      'run',
      '-d',
      '--rm',
      '--label', 'open-lovable-sandbox=true',
      '-p', `${bindHost}::${port}`,
      '-w', this.workDir,
      image,
      'sh', '-c', `mkdir -p ${this.workDir} && tail -f /dev/null`
    ]);
    if (run.exitCode !== 0) {
      throw new Error(`Failed to start Docker sandbox container: ${run.stderr.trim()}`);
    }
    this.containerId = run.stdout.trim();

    const portInfo = await docker(['port', this.containerId, `${port}/tcp`]);
    if (portInfo.exitCode !== 0) {
      throw new Error(`Failed to resolve mapped port for sandbox: ${portInfo.stderr.trim()}`);
    }
    const hostPort = portInfo.stdout.trim().split('\n')[0].split(':').pop();

    this.sandboxInfo = {
      sandboxId: this.containerId.slice(0, 12),
      url: `http://${appConfig.docker.publicHost}:${hostPort}`,
      provider: 'docker',
      createdAt: new Date()
    };

    const timeoutMs = appConfig.docker.timeoutMs;
    if (timeoutMs > 0) {
      const id = this.containerId;
      const timer = setTimeout(() => {
        docker(['rm', '-f', id]).catch(() => undefined);
      }, timeoutMs);
      timer.unref();
    }

    return this.sandboxInfo;
  }

  async runCommand(command: string): Promise<CommandResult> {
    const result = await this.exec(['sh', '-c', command]);
    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      success: result.exitCode === 0
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    const fullPath = path.startsWith('/') ? path : `${this.workDir}/${path}`;
    const result = await this.exec(
      ['sh', '-c', 'mkdir -p "$(dirname "$1")" && cat > "$1"', 'sh', fullPath],
      content
    );
    if (result.exitCode !== 0) {
      throw new Error(`Failed to write ${fullPath}: ${result.stderr.trim()}`);
    }
    this.existingFiles.add(path);
  }

  async readFile(path: string): Promise<string> {
    const fullPath = path.startsWith('/') ? path : `${this.workDir}/${path}`;
    const result = await this.exec(['cat', fullPath]);
    if (result.exitCode !== 0) {
      throw new Error(`Failed to read ${fullPath}: ${result.stderr.trim()}`);
    }
    return result.stdout;
  }

  async listFiles(directory?: string): Promise<string[]> {
    const dir = directory || this.workDir;
    const result = await this.exec([
      'sh', '-c',
      'cd "$1" && find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -not -path "*/dist/*" -not -path "*/build/*"',
      'sh', dir
    ]);
    if (result.exitCode !== 0) {
      return [];
    }
    return result.stdout
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => line.replace(/^\.\//, ''));
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    const args = ['npm', 'install'];
    if (appConfig.packages.useLegacyPeerDeps) {
      args.push('--legacy-peer-deps');
    }
    const result = await this.exec([...args, ...packages]);

    if (appConfig.packages.autoRestartVite && result.exitCode === 0) {
      await this.restartViteServer();
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      success: result.exitCode === 0
    };
  }

  async setupViteApp(): Promise<void> {
    const port = appConfig.docker.vitePort;

    const files: Record<string, string> = {
      'package.json': JSON.stringify({
        name: 'sandbox-app',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'vite --host',
          build: 'vite build',
          preview: 'vite preview'
        },
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0'
        },
        devDependencies: {
          '@vitejs/plugin-react': '^4.0.0',
          vite: '^4.3.9',
          tailwindcss: '^3.3.0',
          postcss: '^8.4.31',
          autoprefixer: '^10.4.16'
        }
      }, null, 2),
      'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: ${port},
    strictPort: true,
    hmr: false,
    allowedHosts: true
  }
})`,
      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
      'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
      'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      'src/App.jsx': `function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <p className="text-lg text-gray-400">
          Sandbox Ready<br/>
          Start building your React app with Vite and Tailwind CSS!
        </p>
      </div>
    </div>
  )
}

export default App`,
      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: rgb(17 24 39);
}`
    };

    for (const [path, content] of Object.entries(files)) {
      await this.writeFile(path, content);
    }

    const install = await this.exec(['npm', 'install']);
    if (install.exitCode !== 0) {
      console.error('[DockerProvider] npm install had issues:', install.stderr);
    }

    await this.restartViteServer();
  }

  async restartViteServer(): Promise<void> {
    if (!this.containerId) {
      throw new Error('No active sandbox');
    }
    await this.exec(['sh', '-c', 'pkill -f vite || true']);
    await docker([
      'exec', '-d', '-w', this.workDir, this.containerId,
      'sh', '-c', 'FORCE_COLOR=0 npm run dev > /tmp/vite.log 2>&1'
    ]);
    await new Promise(resolve => setTimeout(resolve, appConfig.docker.viteStartupDelay));
  }

  getSandboxUrl(): string | null {
    return this.sandboxInfo?.url || null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxInfo;
  }

  async terminate(): Promise<void> {
    if (this.containerId) {
      await docker(['rm', '-f', this.containerId]).catch(() => undefined);
      this.containerId = null;
      this.sandboxInfo = null;
    }
  }

  isAlive(): boolean {
    return !!this.containerId;
  }
}
