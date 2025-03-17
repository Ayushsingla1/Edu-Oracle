import express from "express";
import { ethers } from "ethers";
import { ABI , contractAddress } from "./config";
import 'dotenv/config';
import axios from "axios";
const app = express();

const RPC_URL = 'https://rpc.open-campus-codex.gelato.digital';
const privateKey = process.env.PRIVATE_KEY;


let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contract: ethers.Contract;

if (!privateKey) {
    console.error("Private key not found in environment variables");
    process.exit(1);
}
interface ResponseType {
    success: boolean;
    msg: string | number | object;
}


try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress,ABI, wallet);
} catch (error) {
    console.error("Failed to initialize blockchain connection:", error);
    process.exit(1);
}


async function isRegistered() {
    try{
        const tx = await contract.isRegistered();
        console.log(tx);
        if(!tx) {
            const register = await contract.registerAsAgent({value : ethers.parseEther("0.1")});
            if(!tx){
                console.log("Error while registering as a agent , try again later")
            }
            else{
                console.log("Welcome , Successfully registered as a new agent")
            }
        }
        console.log("Registered Agent")
        return
    }
    catch(e){
        console.log(e);
    }
}

isRegistered();

async function getEthPrice(): Promise<ResponseType> {
    try {
        const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=EDUUSDT`);
        if (!data?.price) {
            return { success: false, msg: "Invalid price data received" };
        }
        return { success: true, msg: String(data.price) };
    } catch (error) {
        console.error("Failed to get EDU price:", error);
        return { success: false, msg: "Failed to fetch EDU price" };
    }
}

async function updatePrice(): Promise<ResponseType> {
    try {
        const priceResponse = await getEthPrice();
        if (!priceResponse.success) {
            return priceResponse;
        }

        const tx = await contract.submitPrice(ethers.parseEther(priceResponse.msg as string));
        if (!tx) {
            return { success: false, msg: "Transaction failed to initiate" };
        }

        const receipt = await tx.wait();
        if (!receipt.status) {
            return { success: false, msg: "Transaction failed to confirm" };
        }

        return { success: true, msg: tx.hash };
    } catch (error) {
        console.error("Price update failed:", error);
        return { success: false, msg: "Failed to update price" };
    }
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

  console.log(banner)
  console.log('    Welcome To Agentic-Oracle     ')
});
