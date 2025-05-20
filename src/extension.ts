// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const terminalName = 'node-runner';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('node-runner.run-script', async (uri: vscode.Uri) => {
		let filePath;
		
		if (uri?.path && uri.scheme !== "untitled") {
			filePath = uri?.path;
		}

		if (!filePath && vscode.window.activeTextEditor) {
			const document = vscode.window.activeTextEditor.document;
			if (document.isUntitled) {
				const tempUri = vscode.Uri.joinPath(context.storageUri!, 'temp.ts');
				await vscode.workspace.fs.writeFile(tempUri, Buffer.from(document.getText()));
				filePath = tempUri.path;
			} else {
				filePath = document.uri.path;
			}
		}

		if (!filePath) {
			vscode.window.showErrorMessage('No file selected to run.');
			return;
		}

		let terminal = vscode.window.terminals.find(f => f.name === terminalName);

		if (terminal) {
			terminal.dispose();
		}

		terminal = vscode.window.createTerminal(terminalName);
		terminal.show();
		terminal.sendText(`node --no-warnings --experimental-transform-types "${filePath}"`);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
