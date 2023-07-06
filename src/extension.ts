import * as vscode from 'vscode';
import axios from 'axios';
const util = require('./util');

let tokenPrice = ""; 
let statusBarItemsArray:[] = [];
let statusBarItems: vscode.StatusBarItem[] = [];

export function activate(context: vscode.ExtensionContext){
    init(); // the main body of the application
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => handleConfigChange())); // make sure the change of configuration will reflect on the windows on time.
}

function handleConfigChange() {
    init();
}

function init(){

    // dispose the old statusBar if any.
    for (const statusBarItem of statusBarItems) {
        statusBarItem.dispose();
    }
    statusBarItems.length = 0;

    // check the status of enable feature.
    const enable = util.getConfigurationEnable();
    if(!enable) return;

    // get the basic configuration.
    let intervalId = null;
    statusBarItemsArray = util.getConfigurationToeknList();
    const updateInterval = util.getConfigurationUpdateInterval();
    const position =vscode.StatusBarAlignment[util.getConfigurationPosition()];

    // create the items in status bar depends on the number of token.
    for (const item of statusBarItemsArray) {
        const statusBarItem = vscode.window.createStatusBarItem(position);
        statusBarItems.push(statusBarItem);
    }

    // update the token price.
    intervalId = setInterval(() => {
        updatePriceList();
    }, updateInterval); // the polling frequency.
}

function updatePriceList(){
    // TODO: support the search of the dex token price.
    // TODO: support the cluster search for the cex token.
    for (let i = 0; i < statusBarItemsArray.length; i++) {
        getCexPrice(statusBarItems[i],statusBarItemsArray[i]); 
        statusBarItems[i].show();
    }
}

export function deactivate() {
    // clearInterval(intervalId);

    for (const statusBarItem of statusBarItems) {
        statusBarItem.dispose();
    }
    statusBarItems.length = 0;
    console.log('extension released.');
}

//TODO: support a uniform function  
async function getCexPrice(statusBarItem: vscode.StatusBarItem, tokenID:"string"){
    try {
        var url =  util.getConfigurationCexURL() + tokenID;
        const response = await axios.get(url);
        const price = response.data.data["0"].last;
        tokenPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
        statusBarItem.text = util.convertCexTokenName(tokenID)+ ": " + tokenPrice; 
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
