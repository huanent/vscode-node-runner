import * as vscode from 'vscode';

export async function getCurrentDoc(uri: vscode.Uri) {
    let doc: vscode.TextDocument | undefined;
    if (uri) {
        doc = await vscode.workspace.openTextDocument(uri);
    }

    if (!doc && vscode.window.activeTextEditor) {
        doc = vscode.window.activeTextEditor.document;
    }

    return doc;
}

export async function getFilePath(context: vscode.ExtensionContext, doc: vscode.TextDocument) {
    let filePath = doc.uri.path;

    if (doc.uri.scheme === "untitled") {
        const tempUri = vscode.Uri.joinPath(context.storageUri!, 'temp.ts');
        await vscode.workspace.fs.writeFile(tempUri, Buffer.from(doc.getText()));
        filePath = tempUri.path;
    }

    return filePath;
}