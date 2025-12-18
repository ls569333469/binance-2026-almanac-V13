import { Plugin } from 'vite';
import { spawn, ChildProcess } from 'child_process';

let activeProcess: ChildProcess | null = null;

export function batchControlPlugin(): Plugin {
    return {
        name: 'frozen-light-batch-control',
        configureServer(server) {
            server.middlewares.use('/api/batch', (req, res, next) => {
                // Handle CORS just in case
                res.setHeader('Access-Control-Allow-Origin', '*');

                if (req.method === 'GET' && req.url === '/status') {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ status: activeProcess ? 'RUNNING' : 'IDLE' }));
                    return;
                }

                if (req.method === 'POST') {
                    if (req.url === '/start') {
                        if (activeProcess) {
                            res.statusCode = 409;
                            res.end(JSON.stringify({ status: 'ALREADY_RUNNING' }));
                            return;
                        }

                        console.log(':: UI TRIGGER :: Starting Batch Generator (Engine B)...');

                        // Spawn Node Process
                        // stdio: 'inherit' means the output appears in the main VSCode/Terminal console
                        activeProcess = spawn('node', ['scripts/batch-generate.js'], {
                            cwd: process.cwd(),
                            stdio: 'inherit',
                            shell: true
                        });

                        activeProcess.on('close', (code) => {
                            console.log(`:: UI TRIGGER :: Batch Generator exited with code ${code}`);
                            activeProcess = null;
                        });

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'STARTED' }));
                        return;
                    }

                    if (req.url === '/stop') {
                        if (activeProcess) {
                            console.log(':: UI TRIGGER :: Stopping Batch Generator...');

                            // Windows Force Kill (Recursive /T to kill shell and children)
                            if (process.platform === 'win32' && activeProcess.pid) {
                                spawn('taskkill', ['/pid', activeProcess.pid.toString(), '/f', '/t']);
                            } else {
                                activeProcess.kill();
                            }

                            activeProcess = null;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ status: 'STOPPED' }));
                        } else {
                            res.statusCode = 200;
                            res.end(JSON.stringify({ status: 'NOT_RUNNING' }));
                        }
                        return;
                    }
                }
                next();
            });
        }
    };
}
