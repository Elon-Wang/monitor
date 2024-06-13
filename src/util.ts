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

    convertTokenName(tokenID: "string"){
        const config = vscode.workspace.getConfiguration();
        const Mode = config.get('monitor.DisplayMode');

        // console.log(config.monitor);
        
        const text =    Mode === 'Full'? tokenID+": ":
                        Mode === 'Token'? tokenID.replace('USDT','').replace('-','')+": ":
                        Mode === 'Initials'? tokenID.slice(0,1)+": " : ''
        return text
    },

    getConfigurationToeknList() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.tokenList',[])
    },

    getConfigurationCexURL() {
        const config = vscode.workspace.getConfiguration();
        const Cex = config.get('monitor.Cex');
        if ( Cex== 'OKX'){
            return config.get('monitor.OKXApiURL')
        } else {
            return config.get('monitor.BinanceApiURL')
        }
    },

    getCex(){
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.Cex');
    },

    getOKXURL() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.OKXApiURL')
    },

    getBinanceURL() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.BinanceApiURL')
    },

    getConfigurationDexURL() {
        const config = vscode.workspace.getConfiguration();
        return config.get('monitor.DexURL')
    }
}

module.exports = util;