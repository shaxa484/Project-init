import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { input, select, confirm } from '@inquirer/prompts';

function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content.trim() + '\n');

    export default async function initCommand() {
        const targetDir = process.cwd();
        const defaultName = path.basename(targetDir);

        console.log(chalk.blue(`Let's initialize a new project in ${chalk.bold(targetDir)}...`));


        try {
            const projectName = await input({
                message: 'What is your project name?',
                default: defaultName,
            });
            const projectType = await select({
                message: 'Select the project type:',
                choices: [
                    {
                        name: 'Frontend (React + Vite)',
                        value: 'react',
                        description: 'A modern React project using Vite.',
                    },
                    {
                        name: 'Backend (Node.js + Express)',
                        value: 'node-backend',
                        description: 'A clean Express.js API server template.',
                    },
                    {
                        name: 'Vanilla JS (HTML + CSS + JS)',
                        value: 'vanilla',
                        description: 'A simple static website layout.',
                    }
                ]

            });

            const gitHubUrl = await input({
                message: 'Enter your GitHub repository URL (optional, leave blank to skip):',
                validate: (value) => {
                    if (value && !value.startsWith('http') && !value.startsWith('git@')) {
                        return 'Please enter a valid GitHub URL or leave blank.';
                    }
                    return true;
                }
            });


            const initGit = await confirm({
                message: 'Do you want to initialize a Git repository?',
                default: true,
            });

            console.log(chalk.gray('\n----------------------------------------'));
            console.log();
            console.log(chalk.blue('⚒ Creating your workspace...'));
            console.log();

            if (projectType === 'vanilla') {
                writeFile(path.join(targetDir, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to ${projectName}</h1>
    <div id="app"></div>
    <script src="app.js"></script>
</body>
</html>`);

                writeFile(path.join(targetDir, 'style.css'), `
body {
    font-family: sans-serif;
    background: #121212;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}`);

                writeFile(path.join(targetDir, 'app.js'), `
console.log("Welcome to ${projectName}!");
document.getElementById('app').innerText = "Vanilla JS Template initialized successfully!";`);

            } else if (projectType === 'node-backend') {
                
                writeFile(path.join(targetDir, 'package.json'), JSON.stringify({
                    name: projectName.toLowerCase().replace(/\s+/g, '-'),
                    version: '1.0.0',
                    type: 'module',
                    main: 'src/index.js',
                    scripts: { start: 'node src/index.js' },
                    dependencies: { express: '^4.19.2' }
                }, null, 2));


                writeFile(path.join(targetDir, 'src/index.js'), `
import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the ${projectName} API!" });
});

app.listen(PORT, () => {
    console.log(\`Server is running on http://localhost:\${PORT}\`);
});`);

            } else if (projectType === 'react') {

                writeFile(path.join(targetDir, 'package.json'), JSON.stringify({
                    name: projectName.toLowerCase().replace(/\s+/g, '-'),
                    version: '1.0.0',
                    type: 'module',
                    scripts: { dev: 'vite' },
                    dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
                    devDependencies: { vite: '^5.3.1' }
                }, null, 2));

                writeFile(path.join(targetDir, 'index.html'), `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

                writeFile(path.join(targetDir, 'src/main.jsx'), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

                writeFile(path.join(targetDir, 'src/App.jsx'), `
import React from 'react';

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>React App: ${projectName}</h1>
    </div>
  );
}`);
            }


            writeFile(path.join(targetDir, 'README.md'), `
# ${projectName}

Bootstrapped using the custom \`project\` CLI tool.

## Setup
If your template has a \`package.json\`, run:
\`\`\`bash
npm install
\`\`\`
`);

            console.log(chalk.green('✓ Generated template files successfully.'));





            if (initGit) {
                try {
                    execSync('git init', { stdio: 'ignore' });
                    console.log(chalk.green('✓ Git repository initialized.'));
                } catch (gitError) {
                    console.log(chalk.yellow('Could not initialize Git. Is git installed on your system?'));
                }
            }
            console.log(chalk.green('✓ Setup complete! Have fun coding!'));

        } catch (error) {
            if (error.name === 'ExitPromptError') {
                console.log(chalk.yellow('\n\n👋 Setup cancelled. See you next time!'));
            } else {
                console.error(chalk.red('\n❌ An error occurred:', error.message));
            }
        }
    }