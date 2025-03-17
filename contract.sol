// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface myToken {
    function mint(address to,uint256 amount) external;
}

contract PriceOracleNetwork is ReentrancyGuard, Ownable {
    mapping(address => Agent) public agents;
    mapping(uint256 => mapping(address => uint256)) public priceSubmissions;
    mapping(uint256 => PriceRound) public priceRounds;
    address public mintContract;

    uint256 public currentRound;
    uint256 public requiredStake = 1 * 10**15;
    uint256 public submissionWindow = 15 minutes;
    uint256 public divergenceThreshold = 5;
    uint256 public penaltyAmount = 5 * 10**14; 
    uint256 public minimumSubmissions = 1;
    uint256 public subscriptionAmount = 1 * 10**13; 
    uint256[] public roundIds;

    struct Agent {
        bool isRegistered;
        uint256 stakedAmount;
        uint256 lastSubmission;
        uint256 penaltyCount;
        uint256 totalSubmissions;
        uint256 rewardTokens;
    }

    struct PriceRound {
        uint256 timestamp;
        uint256 finalPrice;
        uint256 submissionCount;
        bool finalized;
        address[] submitters;
    }

    event AgentRegistered(address indexed agent);
    event PriceSubmitted(address indexed agent, uint256 indexed round, uint256 price);
    event RoundFinalized(uint256 indexed round, uint256 finalPrice);
    event PenaltyApplied(address indexed agent, uint256 amount);
    
    constructor(address _mint) Ownable(msg.sender) {
        currentRound = 1;
        mintContract = _mint;
    }

    function isRegistered() external view returns (bool) {
        return agents[msg.sender].isRegistered;
    }
    
    function registerAsAgent() external payable nonReentrant {
        require(!agents[msg.sender].isRegistered, "Already registered");
        require(msg.value >= requiredStake, "Insufficient ETH sent to stake");

        agents[msg.sender] = Agent({
            isRegistered: true,
            stakedAmount: msg.value,
            lastSubmission: 0,
            penaltyCount: 0,
            totalSubmissions : 0,
            rewardTokens : 0
        });

        emit AgentRegistered(msg.sender);
    }

    function submitPrice(uint256 price) external {
        require(agents[msg.sender].isRegistered, "Not registered");
        require(agents[msg.sender].lastSubmission + submissionWindow < block.timestamp, "Too early");

        priceSubmissions[currentRound][msg.sender] = price;
        agents[msg.sender].lastSubmission = block.timestamp;
        agents[msg.sender].totalSubmissions += 1;
        agents[msg.sender].rewardTokens += 1;

        PriceRound storage round = priceRounds[currentRound];
        round.submissionCount++;
        round.submitters.push(msg.sender);

        emit PriceSubmitted(msg.sender, currentRound, price);

        if (round.submissionCount >= minimumSubmissions) {
            finalizeRound();
        }
    }

    function finalizeRound() public {
        PriceRound storage round = priceRounds[currentRound];
        require(!round.finalized, "Round already finalized");
        require(round.submissionCount >= minimumSubmissions, "Insufficient submissions");

        uint256[] memory prices = new uint256[](round.submissionCount);
        for (uint256 i = 0; i < round.submissionCount; i++) {
            prices[i] = priceSubmissions[currentRound][round.submitters[i]];
        }

        uint256 medianPrice = calculateMedian(prices);
        round.finalPrice = medianPrice;
        round.finalized = true;
        roundIds.push(currentRound);

        for (uint256 i = 0; i < round.submissionCount; i++) {
            address agent = round.submitters[i];
            uint256 agentPrice = priceSubmissions[currentRound][agent];
            if (calculateDivergence(agentPrice, medianPrice) > divergenceThreshold) {
                applyPenalty(agent);
            }
        }

        emit RoundFinalized(currentRound, medianPrice);
        currentRound++;
    }

    function calculateMedian(uint256[] memory prices) internal pure returns (uint256) {
        quickSort(prices, 0, prices.length - 1);
        uint256 len = prices.length;
        if (len % 2 == 0) {
            return (prices[len / 2 - 1] + prices[len / 2]) / 2;
        } else {
            return prices[len / 2];
        }
    }

    function calculateDivergence(uint256 price1, uint256 price2) internal pure returns (uint256) {
        return (price1 > price2) ? ((price1 - price2) * 100) / price2 : ((price2 - price1) * 100) / price1;
    }


    function applyPenalty(address agent) internal {
        Agent storage agentData = agents[agent];
        require(agentData.stakedAmount >= penaltyAmount, "Insufficient stake for penalty");

        agentData.stakedAmount -= penaltyAmount;
        agentData.penaltyCount++;

        if (agentData.stakedAmount < requiredStake / 2) {
            agentData.isRegistered = false;
        }

        emit PenaltyApplied(agent, penaltyAmount);
    }

    function subscribe() public payable {
        require(msg.value >= subscriptionAmount, "Insufficient subscription amount");
    }

    function getPrice() public view returns (uint256) {
        return priceRounds[currentRound - 1].finalPrice;
    }

    function quickSort(uint256[] memory arr, uint256 left, uint256 right) internal pure {
        if (left < right) {
            uint256 pivotIndex = partition(arr, left, right);
            if (pivotIndex > 0) quickSort(arr, left, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, right);
        }
    }

    function partition(uint256[] memory arr, uint256 left, uint256 right) internal pure returns (uint256) {
        uint256 pivot = arr[right];
        uint256 i = left;
        for (uint256 j = left; j < right; j++) {
            if (arr[j] <= pivot) {
                (arr[i], arr[j]) = (arr[j], arr[i]);
                i++;
            }
        }
        (arr[i], arr[right]) = (arr[right], arr[i]);
        return i;
    }

    function getAgentInfo() public view returns (Agent memory) {
        return agents[msg.sender];
    }

    function stakeMore(uint256 amount) public payable  {
        require(agents[msg.sender].isRegistered , "first register as a agent");
        require(msg.value >= amount , "amount to stake is more than eth sent");
        agents[msg.sender].stakedAmount += msg.value;
    }

    function unstake(uint256 amount) public {
        require(agents[msg.sender].isRegistered , "you are not registered as a agent");
        require(amount >= 0 , "amount of 0 can't be retreived");
        require(agents[msg.sender].stakedAmount >= amount , "you have not staked this amount of money");
        agents[msg.sender].stakedAmount -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getLast10FinalPrices() public view returns (uint256[] memory) {
        uint256 len = roundIds.length;
        uint256 count = len > 10 ? 10 : len;
        uint256[] memory prices = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            prices[i] = priceRounds[roundIds[len - count + i]].finalPrice;
        }

        return prices;
    }

    function getRewardCount() external view returns(uint256) {
        Agent storage agent = agents[msg.sender];
        require(agent.isRegistered, "You are not a node");
        return agent.rewardTokens;
    }
    
    function getRewards(uint256 tokenAmount) external {
        Agent storage agent = agents[msg.sender];
        require(agent.isRegistered, "You are not a node");
        require(agent.rewardTokens > 0, "You don't have any tokens to claim");
        require(agent.rewardTokens >= tokenAmount, "Insufficient reward tokens");
        agents[msg.sender].rewardTokens -= tokenAmount;
        myToken(mintContract).mint(msg.sender,tokenAmount);
    }
}
