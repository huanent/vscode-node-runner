import * as vscode from 'vscode';

export function registerDebugScriptCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('node-runner.debug-script', async (uri: vscode.Uri) => {
        let filePath;

        if (uri?.path && uri.scheme !== "untitled") {
            filePath = uri?.path;
        }

        if (!filePath && vscode.window.activeTextEditor) {
            const document = vscode.window.activeTextEditor.document;
            if (document.isUntitled) {
                return;
            } else {
                filePath = document.uri.path;
            }
        }

        if (!filePath) {
            vscode.window.showErrorMessage('No file selected to run.');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder) {
            vscode.window.showErrorMessage("No workspace folder open.");
            return;
        }

        const debugConfig: vscode.DebugConfiguration = {
            type: 'node', // for newer versions of VS Code
            request: 'launch',
            name: 'Debug Node.js Script',
            cwd: '${workspaceFolder}',
            skipFiles: [
                "<node_internals>/**"
            ],
            args: [
                "--no-warnings",
                "--experimental-transform-types",
                filePath
            ]
        };

        const started = await vscode.debug.startDebugging(workspaceFolder, debugConfig);

        if (!started) {
            vscode.window.showErrorMessage('Failed to start debugging');
        }
    });

    context.subscriptions.push(disposable);
}