import * as vscode from 'vscode';
import axios from 'axios';
const util = require('./util');

let tokenPrice = ""; 
let statusBarItemsArray:[] = [];
let statusBarItems: vscode.StatusBarItem[] = [];
let cnt=0
let cnt2=0
let intervalId: NodeJS.Timeout |null = null;

export function activate(context: vscode.ExtensionContext){
	
	// testing code
	// let disposable = vscode.commands.registerCommand('monitor.init',init);
	// context.subscriptions.push(disposable);
	init(); // the main body of the application
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => handleConfigChange())); // make sure the change of configuration will reflect on the windows on time.
}

function handleConfigChange() {
    init();
}

function init(){
    console.log('Your extension is now active!');
    
    // clear the timer defined before.
    if (intervalId) {
        clearInterval(intervalId);
    }

    // dispose the old statusBar if any.
    for (const statusBarItem of statusBarItems) {
        statusBarItem.dispose();
    }
    statusBarItems.length = 0;

    // check the status of enable feature.
    const enable = util.getConfigurationEnable();
    if(!enable) return;

    // get the basic configuration.
    const updateInterval = util.getConfigurationUpdateInterval();
    const position =vscode.StatusBarAlignment[util.getConfigurationPosition()];

    statusBarItemsArray = util.getConfigurationToeknList();
    // cexTokenArray, dexTokenArray = tokenArrayClassification(util.getConfigurationToeknList());

    // create the items in status bar depends on the number of token.
    for (const item of statusBarItemsArray) {
        const statusBarItem = vscode.window.createStatusBarItem(position);
        statusBarItems.push(statusBarItem);
    }

    console.log(updateInterval);
    // update the token price.
    intervalId = setInterval(() => {
        updatePriceList();
    }, updateInterval); // the polling frequency.
}



function updatePriceList(){
    for (let i = 0; i < statusBarItemsArray.length; i++) {
        let token = statusBarItemsArray[i];
        if ( tokenType(token)){
            // Cex Token Price
            getCexPrice(statusBarItems[i], token);
            // getCexPrice2(statusBarItems[i], token);
        } else {
            // Dex Token Price
            getDexPrice(statusBarItems[i], token);
        }
        statusBarItems[i].show();
        // getCexPrice(statusBarItems[i],statusBarItemsArray[i]); 
    }
}

function tokenType(token:string){
    if (token.includes('-')) {
        return true;
    }
    return false;
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
async function getCexPrice(statusBarItem: vscode.StatusBarItem, tokenID:string){
    try {
        let price;
        const Cex = util.getCex();
        if (Cex === 'OKX') {
            var url =  util.getOKXURL() + tokenID;
            const response = await axios.get(url);
            price = response.data.data["0"].last;
        } else {
            var url =  util.getBinanceURL() + tokenID.replace('-','');
            const response = await axios.get(url);
            price = response.data.price;
        }

        tokenPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
        statusBarItem.text = util.convertTokenName(tokenID)+ priceOpt(tokenPrice); 
    } catch (error) {
        console.error("Failed to fetch token price:", error);
    }
}

// TODO: batch request
// function getCexPrice(statusBarItem: vscode.StatusBarItem, tokenID:string){
//     let price:any;
//     const Cex = util.getCex();
//     if (Cex ==='OKX'){
//         var url =  util.getOKXURL() + tokenID;
//         axios.get(url).then((res) =>{
//             price= res.data.data["0"].last;
//             tokenPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
//             statusBarItem.text = util.convertTokenName(tokenID)+ priceOpt(tokenPrice); 
//         }).catch((error)=>console.error("Failed to fetch token price:", error));
        
//     } else {
//         var url =  util.getBinanceURL() + tokenID.replace('-','');
//         axios.get(url).then((res) =>{
//             price= res.data.price;
//             tokenPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
//             statusBarItem.text = util.convertTokenName(tokenID)+ priceOpt(tokenPrice);
//         }).catch((error)=>console.error("Failed to fetch token price:", error));
        
//     }
// }

async function getDexPrice(statusBarItem: vscode.StatusBarItem, tokenID:string){
    try {
        var url =  util.getConfigurationDexURL() + tokenID;
        const response = await axios.get(url);
        const tokenName = response.data.pairs["0"].baseToken.symbol;
        const price = response.data.pairs["0"].priceUsd;
        tokenPrice = price.toLocaleString("en-US", { style: "currency", currency: "USD" });
        statusBarItem.text = util.convertTokenName(tokenName) + priceOpt(tokenPrice); 
    } catch(error){
        console.error("Failed to fetch token price:", error);
    }
}

function priceOpt(tokenPrice:string){
    return tokenPrice;
}