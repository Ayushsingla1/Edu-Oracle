import express from "express";
import axios from "axios";
import { HfInference } from "@huggingface/inference";
import cors from "cors";
import { ethers } from "ethers";
import { ABI } from "./config.js";
import 'dotenv/config';
const app = express();
app.use(express.json());
app.use(cors());
const hf = new HfInference(process.env.HUGGING_FACE);
const COINGECKO_API = "https://api.coingecko.com/api/v3";
const contractABI = ABI;
const RPC_URL = 'https://rpc.blaze.soniclabs.com';
const contractAddress = "0x7306E946d1E94cD984B5aBfccC07527Bad21B3EC";
const privateKey = process.env.PRIVATE_KEY;
let provider;
let wallet;
let contract;
if (!privateKey) {
    console.error("Private key not found in environment variables");
    process.exit(1);
}
try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    wallet = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, contractABI, wallet);
}
catch (error) {
    console.error("Failed to initialize blockchain connection:", error);
    process.exit(1);
}
async function getCryptoPrices() {
    try {
        const { data: bitData } = await axios.get("https://api.bitget.com/api/v2/spot/market/tickers?symbol=SUSDT");
        const { data: binData } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=SUSDT`);
        if (!binData && !bitData) {
            return { success: false, msg: "No price data received" };
        }
        const finalPrice = (parseFloat(bitData?.data[0].lastPr) + parseFloat(binData?.price)) / 2;
        console.log(finalPrice);
        return { success: true, price: finalPrice };
    }
    catch (error) {
        console.error("Failed to fetch crypto prices:", error);
        return { success: false, msg: "Failed to fetch crypto prices" };
    }
}
async function getEthPrice(ids = "ethereum") {
    try {
        const { data } = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=SUSDT`);
        if (!data?.price) {
            return { success: false, msg: "Invalid price data received" };
        }
        return { success: true, msg: String(data.price) };
    }
    catch (error) {
        console.error("Failed to get ETH price:", error);
        return { success: false, msg: "Failed to fetch ETH price" };
    }
}
async function isRegistered() {
    try {
        const tx = await contract.isRegistered();
        console.log(tx);
        if (!tx) {
            const register = await contract.registerAsAgent({ value: ethers.parseEther("0.1") });
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
}
await isRegistered();
async function updatePrice() {
    try {
        const priceResponse = await getEthPrice();
        if (!priceResponse.success) {
            return priceResponse;
        }
        const tx = await contract.submitPrice(ethers.parseEther(priceResponse.msg));
        if (!tx) {
            return { success: false, msg: "Transaction failed to initiate" };
        }
        const receipt = await tx.wait();
        if (!receipt.status) {
            return { success: false, msg: "Transaction failed to confirm" };
        }
        return { success: true, msg: tx.hash };
    }
    catch (error) {
        console.error("Price update failed:", error);
        return { success: false, msg: "Failed to update price" };
    }
}
async function getTokenCount() {
    try {
        const count = await contract.getRewardCount();
        if (count === undefined) {
            return { success: false, msg: "Invalid token count received" };
        }
        return { success: true, msg: parseInt(count) };
    }
    catch (error) {
        console.error("Token count retrieval failed:", error);
        return { success: false, msg: "Failed to get token count" };
    }
}
async function getHistoricalData(coin = "ethereum", days = 7) {
    try {
        const { data } = await axios.get(`${COINGECKO_API}/coins/${coin}/market_chart?vs_currency=usd&days=${days}`);
        return data.prices;
    }
    catch (error) {
        console.error("Error fetching historical data:", error);
        return null;
    }
}
async function getMarketSentiment(text) {
    try {
        const response = await hf.request({
            model: "finiteautomata/bertweet-base-sentiment-analysis",
            inputs: text,
        });
        //@ts-ignore
        return response[0]?.label || "neutral";
    }
    catch (error) {
        console.error("Error classifying sentiment:", error);
        return "neutral";
    }
}
async function analyzeNewsImpact(coin = "ethereum") {
    try {
        const news = await axios.get(`${COINGECKO_API}/events`);
        const sentiments = await Promise.all(news.data.slice(0, 5).map(async (article) => {
            const sentiment = await getMarketSentiment(article.title);
            return sentiment;
        }));
        return {
            sentiments,
            headlines: news.data.slice(0, 5).map((n) => n.title),
        };
    }
    catch (error) {
        console.error("Error analyzing news impact:", error);
        return null;
    }
}
async function predictPrice(historicalPrices) {
    try {
        const prompt = `Given the last 5 prices: ${historicalPrices.slice(-5).join(", ")}, predict trend:`;
        const response = await hf.textGeneration({
            model: "microsoft/DialoGPT-medium",
            inputs: prompt,
            parameters: { max_length: 50 },
        });
        return response.generated_text;
    }
    catch (error) {
        console.error("Error predicting price:", error);
        return null;
    }
}
app.post("/query", async (req, res) => {
    const { userQuery, userId } = req.body;
    console.log(userQuery);
    try {
        const intent = await hf.request({
            model: "facebook/bart-large-mnli",
            inputs: userQuery,
            parameters: {
                candidate_labels: ["price", "sentiment", "prediction", "news", "staking", "unstake", "reward"],
            },
        });
        //@ts-ignore
        const queryType = intent.labels[0];
        console.log("Query type:", queryType);
        switch (queryType) {
            case "price":
                const prices = await getCryptoPrices();
                if (!prices.success) {
                    return res.json({ type: "price", data: "Unable to fetch prices at this time" });
                }
                const price = prices.msg.price;
                return res.json({ type: "price", data: `Current price of ethereum is : $${price}` });
            case "sentiment":
                const sentiment = await getMarketSentiment(userQuery);
                const response = `According to my study the current sentiment of ethereum is ${sentiment}`;
                return res.json({ type: "sentiment", data: response });
            case "prediction":
                const history = await getHistoricalData();
                if (!history) {
                    return res.json({ type: "prediction", data: "Unable to fetch historical data" });
                }
                const prediction = await predictPrice(history.map((p) => p[1]));
                return res.json({ type: "prediction", data: prediction });
            case "news":
                const news = await analyzeNewsImpact();
                if (!news) {
                    return res.json({ type: "news", data: "Unable to fetch news data" });
                }
                return res.json({ type: "news", data: news });
            case "staking":
                const number = userQuery.match(/\d+(\.\d+)?/g);
                if (number) {
                    return res.json({ type: "stakeAmount", action: true, data: { amount: String(number) } });
                }
                else {
                    return res.json({
                        type: "staking",
                        data: "As you stake more amount of money you'll be given priority points and this will give you better yields",
                        action: false
                    });
                }
            case "unstake":
                const amount = userQuery.match(/\d+(\.\d+)?/g);
                if (amount) {
                    return res.json({ type: "unstakeAmount", action: true, data: { amount: String(amount) } });
                }
                else {
                    return res.json({
                        type: "unstaking",
                        data: "You can unstake some amount of tokens from the amount that you have staked"
                    });
                }
            case "reward":
                const tokenCount = userQuery.match(/\d+(\.\d+)?/g);
                if (tokenCount) {
                    return res.json({ type: "reward", action: true, data: { amount: String(tokenCount) } });
                }
                else {
                    return res.json({ type: "rewardCount", action: true, data: {} });
                }
            default:
                return res.status(400).json({ type: "error", data: "Unknown query type" });
        }
    }
    catch (error) {
        console.error("Error processing query:", error);
        return res.status(500).json({ type: "error", data: "Internal Server Error" });
    }
});
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
