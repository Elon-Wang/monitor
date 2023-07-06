import * as vscode from 'vscode';
const util = {
    
    getConfigurationEnable() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.enable');
    },

    getConfigurationUpdateInterval() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.updateInterval')
    },

    getConfigurationPosition() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.Position')
    },

    convertCexTokenName(tokenID: "string"){
        const config = vscode.workspace.getConfiguration();
        const displayMode = config.get('monitor.DisplayMode');
        const text =    displayMode === 'Full'? tokenID:
                        displayMode === 'Token'? tokenID.replace('-USDT',''):
                        displayMode === 'Initials'? tokenID.slice(0,1):''
        return text
    },

    getConfigurationToeknList() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.tokenList',[])
    },

    getConfigurationCexURL() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.CexURL')
    },

    getConfigurationDexURL() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.DexURL')
    }
}

module.exports = util;