"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const config_1 = require("./config");
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const RPC_URL = 'https://rpc.open-campus-codex.gelato.digital';
const privateKey = process.env.PRIVATE_KEY;
let provider;
let wallet;
let contract;
if (!privateKey) {
    console.error("Private key not found in environment variables");
    process.exit(1);
}
try {
    provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    contract = new ethers_1.ethers.Contract(config_1.contractAddress, config_1.ABI, wallet);
}
catch (error) {
    console.error("Failed to initialize blockchain connection:", error);
    process.exit(1);
}
function isRegistered() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tx = yield contract.isRegistered();
            console.log(tx);
            if (!tx) {
                const register = yield contract.registerAsAgent({ value: ethers_1.ethers.parseEther("0.1") });
                if (!tx) {
                    console.log("Error while registering as a agent , try again later");
                }
                else {
                    console.log("Welcome , Successfully registered as a new agent");
                }
            }
            console.log("Registered Agent");
            return;
        }
        catch (e) {
            console.log(e);
        }
    });
}
isRegistered();
function getEthPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data } = yield axios_1.default.get(`https://api.binance.com/api/v3/ticker/price?symbol=EDUUSDT`);
            if (!(data === null || data === void 0 ? void 0 : data.price)) {
                return { success: false, msg: "Invalid price data received" };
            }
            return { success: true, msg: String(data.price) };
        }
        catch (error) {
            console.error("Failed to get EDU price:", error);
            return { success: false, msg: "Failed to fetch EDU price" };
        }
    });
}
function updatePrice() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const priceResponse = yield getEthPrice();
            if (!priceResponse.success) {
                return priceResponse;
            }
            const tx = yield contract.submitPrice(ethers_1.ethers.parseEther(priceResponse.msg));
            if (!tx) {
                return { success: false, msg: "Transaction failed to initiate" };
            }
            const receipt = yield tx.wait();
            if (!receipt.status) {
                return { success: false, msg: "Transaction failed to confirm" };
            }
            return { success: true, msg: tx.hash };
        }
        catch (error) {
            console.error("Price update failed:", error);
            return { success: false, msg: "Failed to update price" };
        }
    });
}
setInterval(updatePrice, 16 * 60 * 1000);
const PORT = 3002;
app.listen(PORT, () => {
    const banner = `
     █████╗ ██╗     ██████╗ ██████╗  █████╗  ██████╗██╗     ███████╗
    ██╔══██╗██║    ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██║     ██╔════╝
    ███████║██║    ██║   ██║██████╔╝███████║██║     ██║     █████╗  
    ██╔══██║██║    ██║   ██║██╔══██╗██╔══██║██║     ██║     ██╔══╝  
    ██║  ██║██║    ╚██████╔╝██║  ██║██║  ██║╚██████╗███████╗███████╗
    ╚═╝  ╚═╝╚═╝     ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝                                                      
  `;
    console.log(banner);
    console.log('    Welcome To Agentic-Oracle     ');
});
