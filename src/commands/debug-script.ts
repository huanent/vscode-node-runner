import * as vscode from 'vscode';
import { getCurrentDoc, getFilePath } from '../utils';
import { getTypeSupportFlags, typescriptSupportCheck } from '../node-runtime';

export function registerDebugScriptCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('node-runner.debug-script', async (uri: vscode.Uri) => {
        let doc = await getCurrentDoc(uri);

        if (!doc) {
            return;
        }

        let filePath = await getFilePath(context, doc);

        if (doc.languageId === "typescript") {
            typescriptSupportCheck();
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

        if (!workspaceFolder) {
            vscode.window.showErrorMessage("No workspace folder open.");
            return;
        }

        const typeSupportFlags = getTypeSupportFlags();

        const debugConfig: vscode.DebugConfiguration = {
            type: 'node', // for newer versions of VS Code
            request: 'launch',
            name: 'Debug Node.js Script',
            cwd: '${workspaceFolder}',
            skipFiles: [
                "<node_internals>/**"
            ],
            args: [
                ...typeSupportFlags,
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