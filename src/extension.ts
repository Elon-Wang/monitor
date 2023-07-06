import * as vscode from 'vscode';
import axios from 'axios';
// import util from 'util';
const util = require('./util');

let ethPrice = ""; // 初始价格

let statusBarItemsArray:[] = [];
let statusBarItems: vscode.StatusBarItem[] = [];

export function activate(context: vscode.ExtensionContext){
    init();
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => handleConfigChange()));
}

function handleConfigChange() {
    init();
}

function init(){
    for (const statusBarItem of statusBarItems) {
        statusBarItem.dispose();
    }

    statusBarItems.length = 0;
    let intervalId = null;
    statusBarItemsArray = util.getConfigurationToeknList();
    const updateInterval = util.getConfigurationUpdateInterval();

    const enable = util.getConfigurationEnable();
    if(!enable) return;
    
    const position =vscode.StatusBarAlignment[util.getConfigurationPosition()];
    for (const item of statusBarItemsArray) {
        const statusBarItem = vscode.window.createStatusBarItem(position);
        statusBarItems.push(statusBarItem);
    }

    intervalId = setInterval(() => {
        updatePriceList();
    }, updateInterval); // 每隔一分钟更新一次
}

function updatePriceList(){
    for (let i = 0; i < statusBarItemsArray.length; i++) {
        // statusBarItems[i].text = getStatusBarItemText(i); // Define your logic to determine the text
        getCexPrice(statusBarItems[i],statusBarItemsArray[i]); 
        statusBarItems[i].show();
    }
}

export function deactivate() {
    // 插件停用时的清理逻辑
    // clearInterval(intervalId);

    for (const statusBarItem of statusBarItems) {
        statusBarItem.dispose();
    }

    statusBarItems.length = 0;
    console.log('extension released.');
}

async function getCexPrice(statusBarItem: vscode.StatusBarItem, tokenID:"string"){
    try {
        var url =  util.getConfigurationCexURL() + tokenID;
        const response = await axios.get(url);
        const price = response.data.data["0"].last;
        ethPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
        statusBarItem.text = util.convertCexTokenName(tokenID)+ ": " + ethPrice; // 更新价格
    } catch (error) {
        console.error("Failed to fetch token price:", error);
    }
}

async function getDexPrice(statusBarItem: vscode.StatusBarItem, tokenID:"string"){
    try {
        var url =  util.getConfigurationDexURL() + tokenID;
        const response = await axios.get(url);
        const price = response.data.pairs["0"].priceUsd;
        return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
    } catch(error){
        console.error("Failed to fetch token price:", error);
    }
}
