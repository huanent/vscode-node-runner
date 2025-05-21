import * as vscode from 'vscode';
import { getTypeSupportFlags, typescriptSupportCheck } from '../node-runtime';
import { getCurrentDoc, getFilePath } from "../utils"

const terminalName = 'node-runner';

export function registerRunScriptCommand(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('node-runner.run-script', async (uri: vscode.Uri) => {
        let doc = await getCurrentDoc(uri);

        if (!doc) {
            return;
        }

        let filePath = await getFilePath(context, doc);

        if (doc.languageId === "typescript") {
            typescriptSupportCheck();
        }

        let terminal = vscode.window.terminals.find(f => f.name === terminalName);

        if (terminal) {
            terminal.dispose();
        }

        terminal = vscode.window.createTerminal(terminalName);
        terminal.show();
        const typeSupportFlags = getTypeSupportFlags();
        const command = ["node", ...typeSupportFlags, `"${filePath}"`];
        terminal.sendText(command.join(' '));
    });

    context.subscriptions.push(disposable);
}