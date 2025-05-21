import * as vscode from 'vscode';
import { registerRunScriptCommand } from './commands/run-script';
import { registerDebugScriptCommand } from './commands/debug-script';

export function activate(context: vscode.ExtensionContext) {
	registerRunScriptCommand(context);
	registerDebugScriptCommand(context);
}

export function deactivate() { }
