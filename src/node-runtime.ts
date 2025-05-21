import { execSync } from 'child_process';

function getNodeVersion() {
    try {
        return execSync("node -v", { encoding: "utf-8" }).toLowerCase().trim();
    } catch (error) {
        throw new Error('Node.js SDK not installed!');
    }
}

export function getTypeSupportFlags() {
    const help = execSync("node -h", { encoding: "utf-8" });
    const result = [];
    if (help.includes("--experimental-strip-types")) {
        result.push("--experimental-strip-types");
    }

    if (help.includes("--experimental-transform-types")) {
        result.push("--experimental-transform-types");
    }

    if (result.length) {
        result.push("--no-warnings");
    }

    return result;
}

function compareVersions(a: string, b: string): number {
    const pa = a.replace(/^v/, '').split('.').map(Number);
    const pb = b.replace(/^v/, '').split('.').map(Number);

    for (let i = 0; i < 3; i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff !== 0) {
            return diff
        }
    }
    return 0;
}

export function typescriptSupportCheck() {
    var result = compareVersions(getNodeVersion(), "v22.6.0");
    if (result < 0) {
        throw new Error("Not support typescript, current Node.js version < v22.6.0");
    }
}
