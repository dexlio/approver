let Web3 = require('web3');
let axios = require('axios');
let serverAbi = require("./abi");
let orderStore = require("./orderstore");
let config = require("./config");
let readLine  = require('readline');
var guavaCache = require('guava-cache');
var fs = require('fs');

const myArgs = process.argv.slice(2);
let readFromDb = false;
let orderProviderContract;
let approverContract;
let tokenInfoContract;

let mainWallet;
let processorNumber;
let timeInterval;
let processorCount;
let groupMemberCount;
let groupCount;
let memberId;
let minLiquidity;
let timeDuration;
let lastBlockTime = 0;
let tx;
let publicKey;
let privateKey;
let mail;
let web3;
let network;

let tokenMap = new Map();
let tokenInfoMap = guavaCache({expiry: '10m', maxItems: 1000});
let buyOrderMap = new Map();
let activeBuyOrderMap = new Map();
let sellOrderMap = new Map();
let activeSellOrderMap = new Map();
let tokenContractMap = new Map();
let tokenKeys = new Map();

let buyOrderKeyMap = new Map();
let sellOrderKeyMap = new Map();

let lastBlock;
let initOrderCompleted = false;

let orderInterval;
let tokenInfoInterval;
let blockInterval;
let checkInterval;
let activeCheckInterval;
let providerInterval;
let removalInterval;
let registered = false;
let networkId;
let pass;

const approverCredential = "LUSEGERGEVREUMUTREGWFWEGERHREWF235346";

const run = function (password) {
    let lineReader = readLine.createInterface({
        input: fs.createReadStream('wallet.txt')
    });
    lineReader.on('line', function (line) {
        let params = line.split(",");
        publicKey = params[0];
        privateKey = params[1];
        networkId = params[2];
        if(params.length > 3){
            mail = params[3];
        }
    }).on('close', function () {
        startApp(networkId,password);
        setInterval(function () {
            if(registered){
                heartBeat();
                console.log("heart beat");
            }
        }, (1000 * 60 * 60));
    });
};

if (!fs.existsSync('wallet.txt')) {
    console.log("wallet is not created. please create or import your wallet");
}else{
    let lineReader = readLine.createInterface({
        input: fs.createReadStream('pass.txt')
    });
    lineReader.on('line', function (key) {
        run(key);
    }).on('close', function () {
        //fs.unlinkSync("pass.txt");
    });
}


const startApp = async function(networkId,password){
    try {
        network = config.config()[networkId];
        if(myArgs[0]){
            readFromDb = myArgs[0];
        }
        orderStore.init(networkId);
        console.log("\nConnecting to : " + network.name);
        let networkProvider = network.nodeAddress;
        web3 = new Web3(networkProvider);
        pass = web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt2()));
        let key = web3.utils.toBN(web3.utils.toHex(pass)).xor(web3.utils.toBN(0).xor(web3.utils.toBN(config.salt())));
        mainWallet = completeAddress(cipher(publicKey, key), 42);
        console.log("public key : " + mainWallet);
        await web3.eth.accounts.wallet.add(completeAddress(cipher(privateKey, key), 66));
        await init(networkId);
    } catch (e) {
        console.log("start app failed");
        console.log(e);
        process.exit();
    }
};

let heartBeat = async function () {
    try {
        const signature = await web3.eth.sign(web3.utils.sha3("heartbeat"),mainWallet);
        let reqData = {
            key: approverCredential,
            sign:signature,
            publicKey:mainWallet,
            networkId:networkId
        };
        let response = await axios.post(config.site() + "api/approver/heartbeat", reqData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'accept': '*'
            }
        });
        console.log(response.data);
    } catch (e) {
        console.log("heartbeat error");
        console.log(e);
    }
};


let register = async function (networkId) {
    try {
        const signature = await web3.eth.sign(web3.utils.sha3("register"),mainWallet);
        let reqData = {
            key: approverCredential,
            sign:signature,
            publicKey:mainWallet,
            mail:mail,
            networkId:networkId
        };
        console.log(reqData);
        let response = await axios.post(config.site() + "api/approver/register", reqData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'accept': '*'
            }
        });
        console.log(response.data);
        console.log("register request sent");
    } catch (e) {
        console.log(e);
    }
};


let init = async function (networkId) {
    try {
        orderProviderContract = new web3.eth.Contract(serverAbi.orderProvider(), network.orderAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice * 2)
        });
        approverContract = new web3.eth.Contract(serverAbi.approver(), network.approverAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice * 2)
        });
        tokenInfoContract = new web3.eth.Contract(serverAbi.tokenInfo(), network.infoAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice * 2)
        });

        let processorInfo = await approverContract.methods.getProcessor(mainWallet).call();
        if(web3.utils.toBN(processorInfo.email).cmp(web3.utils.toBN(0)) !== 1) {
            await register(networkId);
        }else{
            registered = true;
            heartBeat();
        }

        await initProvider();
        lastBlock = network.orderContractCreationBlock;
        clearInterval(providerInterval);
        providerInterval = setInterval(function () {
            try {
                initProvider();
                console.log("token info map size : " + tokenInfoMap.size());
                console.log("token keys size : " + tokenKeys.size);
                console.log("buy order map size : " + buyOrderMap.size);
                console.log("active buy order map size : " + activeBuyOrderMap.size);
                console.log("sell order map size : " + sellOrderMap.size);
                console.log("active sell order map size : " + activeSellOrderMap.size);
            } catch (e) {
                console.log(e);
            }
        }, 60000);

        initApp(parseInt(networkId));
    } catch (e) {
        console.log("Critical error init ");
        console.log(e);
        setTimeout(initConfig, 10000);
    }


};

let getOrdersFromDb = async function (networkId){
    const signature = await web3.eth.sign(web3.utils.sha3("orders"),mainWallet);
    orderStore.getBlockFromDB(async function (lastBlockObj) {
        let endBlock;
        if(lastBlockObj){
            lastBlock = lastBlockObj.block;
        }
        endBlock = await web3.eth.getBlockNumber();
        console.log("start " + lastBlock + " end block " + endBlock);
        try {
            let reqData = {
                key: approverCredential,
                sign: signature,
                publicKey: mainWallet,
                networkId: networkId,
                startBlock: lastBlock,
                endBlock: endBlock
            };
            let response = await axios.post(config.site() + "api/approver/orders", reqData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'accept': '*'
                }
            });
            let buyResults = response.data.buyResults;
            let sellResults = response.data.sellResults;
            for (let j = 0; j < buyResults.length; j++) {
                let buyResult = buyResults[j];
                await orderStore.addOrderToDB(buyResult.id, buyResult.pair, buyResult.taker, buyResult.block, true);
            }
            for (let j = 0; j < sellResults.length; j++) {
                let sellResult = sellResults[j];
                await orderStore.addOrderToDB(sellResult.id, sellResult.pair, sellResult.taker, sellResult.block, false);
            }
            await orderStore.updateBlockToDB(0,response.data.lastBlock);
            lastBlock = response.data.lastBlock;
        } catch (e) {
            console.log("getmyorders error");
        }
        await initOrders(lastBlock);
    });
};


let initOrders = async function (startBlock) {
    buyOrderKeyMap = new Map();
    sellOrderKeyMap = new Map();
    let blockInterval = network.orderBlockScanInterval;
    if (readFromDb) {
        orderStore.getBlockFromDB(async function (lastBlockObj) {
            if(lastBlockObj) {
                let endBlock = lastBlockObj.block;
                if (endBlock > startBlock) {
                    console.log("start block : " + startBlock, " end block : " + endBlock);
                    orderStore.getAllOrdersFromDB(startBlock, endBlock, true, async function (buyResults) {
                        orderStore.getAllOrdersFromDB(startBlock, endBlock, false, async function (sellResults) {
                            for (let i = 0; i < buyResults.length; i++) {
                                let buyResult = buyResults[i];
                                if (((buyResult.id % groupCount) === (processorNumber % groupCount))) {
                                    buyOrderKeyMap.set(buyResult.id, buyResult);
                                }
                            }
                            for (let i = 0; i < sellResults.length; i++) {
                                let sellResult = sellResults[i];
                                if (((sellResult.id % groupCount) === (processorNumber % groupCount))) {
                                    sellOrderKeyMap.set(sellResult.id, sellResult);
                                }
                            }
                            await getBuyOrders(Array.from(buyOrderKeyMap.values()));
                            await getSellOrders(Array.from(sellOrderKeyMap.values()));
                            lastBlock = endBlock;
                            initOrderCompleted = true;
                        });
                    });
                }else{
                    initOrderCompleted = true;
                }
            }else{
                initOrderCompleted = true;
            }
        });
    } else {
        let endBlock = await web3.eth.getBlockNumber();
        if (endBlock - blockInterval > startBlock) {
            orderStore.getBlockFromDB(async function (lastBlockObj) {
                orderStore.getAllOrdersFromDB(startBlock, endBlock, true, async function (buyResults) {
                    orderStore.getAllOrdersFromDB(startBlock, endBlock, false, async function (sellResults) {
                        for (let i = 0; i < buyResults.length; i++) {
                            let buyResult = buyResults[i];
                            if (((buyResult.id % groupCount) === (processorNumber % groupCount))) {
                                buyOrderKeyMap.set(buyResult.id, buyResult);
                            }
                        }
                        for (let i = 0; i < sellResults.length; i++) {
                            let sellResult = sellResults[i];
                            if (((sellResult.id % groupCount) === (processorNumber % groupCount))) {
                                sellOrderKeyMap.set(sellResult.id, sellResult);
                            }
                        }
                        startBlock = lastBlockObj ? lastBlockObj.block : startBlock;
                        for (let i = startBlock; i < endBlock; i += blockInterval) {
                            try {
                                let events = await orderProviderContract.getPastEvents('CreateOrder', {
                                    fromBlock: i,
                                    toBlock: Math.min(i + blockInterval, endBlock),
                                });
                                for (let j = 0; j < events.length; j++) {
                                    let data = events[j].returnValues;
                                    if (((data.orderId % groupCount) === (processorNumber % groupCount))) {
                                        if (data.isBuy) {
                                            buyOrderKeyMap.set(data.orderId, data);
                                        } else {
                                            sellOrderKeyMap.set(data.orderId, data);
                                        }
                                    }
                                    if (data.isBuy) {
                                        await orderStore.addOrderToDB(data.orderId, data.pair, data.taker, events[j].blockNumber, true);
                                    } else {
                                        await orderStore.addOrderToDB(data.orderId, data.pair, data.taker, events[j].blockNumber, false);
                                    }
                                }
                                await delay(1000);
                                let deleteEvents = await orderProviderContract.getPastEvents('Order', {
                                    fromBlock: i,
                                    toBlock: Math.min(i + blockInterval, endBlock),
                                });
                                for (let j = 0; j < deleteEvents.length; j++) {
                                    let data = deleteEvents[j].returnValues;
                                    if (((data.orderId % groupCount) === (processorNumber % groupCount))) {
                                        buyOrderKeyMap.delete(data.orderId);
                                        sellOrderKeyMap.delete(data.orderId);
                                    }
                                    await orderStore.deleteOrderFromDB(data.orderId, true);
                                    await orderStore.deleteOrderFromDB(data.orderId, false);
                                }
                                await getBuyOrders(Array.from(buyOrderKeyMap.values()));
                                await getSellOrders(Array.from(sellOrderKeyMap.values()));
                            } catch (e) {
                                console.log("limit");
                                console.log(e);
                            }
                            await delay(1000);
                        }
                        await orderStore.updateBlockToDB(0, endBlock);
                        lastBlock = endBlock;
                        await delay(1000);
                        initOrderCompleted = true;
                    });
                });
            });
        } else {
            try {
                if (endBlock > startBlock) {
                    console.log("start block " + startBlock + " end block " + endBlock);
                    let events = await orderProviderContract.getPastEvents('CreateOrder', {
                        fromBlock: startBlock,
                        toBlock: 'latest',
                    });
                    for (let j = 0; j < events.length; j++) {
                        let data = events[j].returnValues;
                        if (((data.orderId % groupCount) === (processorNumber % groupCount))) {
                            if (data.isBuy) {
                                buyOrderKeyMap.set(data.orderId, data);
                            } else {
                                sellOrderKeyMap.set(data.orderId, data);
                            }
                        }
                        if (data.isBuy) {
                            await orderStore.addOrderToDB(data.orderId, data.pair, data.taker, events[j].blockNumber, true);
                        } else {
                            await orderStore.addOrderToDB(data.orderId, data.pair, data.taker, events[j].blockNumber, false);
                        }
                    }
                    await delay(1000);
                    let deleteEvents = await orderProviderContract.getPastEvents('Order', {
                        fromBlock: startBlock,
                        toBlock: 'latest',
                    });
                    for (let j = 0; j < deleteEvents.length; j++) {
                        let data = deleteEvents[j].returnValues;
                        if (((data.orderId % groupCount) === (processorNumber % groupCount))) {
                            buyOrderKeyMap.delete(data.orderId);
                            sellOrderKeyMap.delete(data.orderId);
                        }
                        await orderStore.deleteOrderFromDB(data.orderId, true);
                        await orderStore.deleteOrderFromDB(data.orderId, false);
                    }
                    await getBuyOrders(Array.from(buyOrderKeyMap.values()));
                    await getSellOrders(Array.from(sellOrderKeyMap.values()));
                    await orderStore.updateBlockToDB(0, endBlock);
                    lastBlock = endBlock;
                    initOrderCompleted = true;
                }

            } catch (e) {
                console.log(e);
                await delay(1000);
            }
        }
    }
};

function delay(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

let checkApproverState = async function () {
    try {
        let lateLimit = await approverContract.methods.getLateLimit().call();
        let approverInfo = await approverContract.methods.getProcessor(mainWallet).call();
        if (approverInfo.lateCount > (lateLimit / 2)) {
            console.log("refreshing approver state");
            await approverContract.methods.refreshApproverState().call();
        }
    } catch (e) {
        console.log(e);
    }
};

let cipher = function (text, key) {
    return web3.utils.toHex((web3.utils.toBN(text).xor(web3.utils.toBN(key))));
};

let completeAddress = function (address, length) {
    if (address.length < length) {
        let remain = "";
        let diff = length - address.length;
        for (let i = 0; i < diff; i++) {
            remain += "0";
        }
        return "0x" + remain + address.substr(1 + diff, length - (2 + diff));
    } else {
        return address;
    }
};

let initProvider = async function () {
    try {
        await checkApproverState();
    } catch (e) {
        console.log(e);
        console.log("approver error");
    }
    try {
        let processorInfo = await approverContract.methods.getProccesor(mainWallet).call();
        let processor = await approverContract.methods.getProcessor(mainWallet).call();
        minLiquidity = await tokenInfoContract.methods.getMinLiquidity().call();
        groupMemberCount = await orderProviderContract.methods.getGroupMemberCount().call();
        timeInterval = await orderProviderContract.methods.getTimeInterval().call();
        processorNumber = processorInfo.processorNumber;
        processorCount = processorInfo._lastProcessorNumber;
        timeDuration = timeInterval / groupMemberCount;
        groupCount = (processorCount % groupMemberCount) !== 0 ? parseInt(processorCount / groupMemberCount) + 1 : parseInt(processorCount / groupMemberCount);
        memberId = parseInt(processorNumber / groupCount);
        if(web3.utils.toBN(processor.email).cmp(web3.utils.toBN(0)) === 1) {
            registered = true;
        }
        console.log("group count " + groupCount);
        console.log("group member count " + groupMemberCount);
        console.log("min liquidity " + minLiquidity);
        console.log("time interval " + timeInterval);
        tx = {
            from: mainWallet,
            value: 0,
            gasPrice: web3.utils.toHex(network.gasPrice),
            gasLimit: web3.utils.toHex(network.gasLimit)
        };
    } catch (e) {
        console.log(e);
        console.log("provider error");
    }
};


let initApp = async function (networkId) {
    try {
        await getOrdersFromDb(networkId);
    } catch (e) {
        console.log("init app error");
        console.log(e);
    }

    try {
        clearInterval(removalInterval);
        removalInterval = setInterval(function () {
            try {
                orderRemovalCheck();
            } catch (e) {
                console.log(e);
            }
        }, 10000);

        clearInterval(orderInterval);
        orderInterval = setInterval(function () {
            try {
                tokenKeys.clear();
                if (networkId !== undefined && !isNaN(networkId) && initOrderCompleted) {
                    initOrders(lastBlock);
                }
            } catch (e) {
                console.log(e);
            }
        }, 3000);

        clearInterval(tokenInfoInterval);
        tokenInfoInterval = setInterval(function () {
            try {
                checkTokenInfos();
            } catch (e) {
                console.log(e);
            }
        }, 1000);

        clearInterval(blockInterval);
        blockInterval = setInterval(function () {
            try {
                checkBlock();
            } catch (e) {
                console.log(e);
            }
        }, 200);
        clearInterval(checkInterval);


        checkInterval = setInterval(function () {
            try {
                checkOrders(buyOrderMap, true, false);
            } catch (e) {
                console.log(e);
            }
            try {
                checkOrders(sellOrderMap, false, false);
            } catch (e) {
                console.log(e);
            }
        }, 500);

        clearInterval(activeCheckInterval);
        activeCheckInterval = setInterval(function () {
            try {
                checkOrders(activeBuyOrderMap, true, true);
            } catch (e) {
                console.log(e);
            }
            try {
                checkOrders(activeSellOrderMap, false, true);
            } catch (e) {
                console.log(e);
            }
        }, 250);

    } catch (e) {
        console.log("Critical init app error ");
        console.log(e);
    }
};


let getBuyOrders = async function (buyOrders) {
    try {
        let _promises2 = [];
        for (let i = 0; i < buyOrders.length; i++) {

            let buyParams = buyOrders[i];
            let token = buyParams.pair;
            let buyer = buyParams.taker;
            _promises2.push(orderProviderContract.methods.getTokenBuyOrder(token, buyer).call());
        }

        try {
            let results2 = await Promise.all(_promises2);
            for (let i = 0; i < results2.length; i++) {
                let order = results2[i];
                let buyer = buyOrders[i].taker;
                let token = buyOrders[i].pair;
                let key = initTokenInfoKey(order, token);
                tokenKeys.set(key, key);
                let persistedOrder = activeBuyOrderMap.get(token + "_" + buyer);
                persistedOrder = persistedOrder ? persistedOrder : buyOrderMap.get(token + "_" + buyer);
                if (((order.orderId % groupCount) === (processorNumber % groupCount)) && !order.executed && !order.canceled) {
                    let o = {
                        price: order.price,
                        value: order.value,
                        up: order.up,
                        direct: order.direct,
                        id: order.orderId,
                        executed: order.executed,
                        canceled: order.canceled,
                        transactionTime: order.transactionTime * 1000,
                        blockNumber: order.blockNumber,
                        transactionFee: order.transactionFee,
                        mod: order.mod,
                        index: order.oIndex,
                        buyer: buyer,
                        token: token,
                        expired: false,
                        gasPrice: web3.utils.toHex(order.gasCount * network.gasCountPrice),
                        pairId: order.pairId,
                        liqPairId: order.liqPairId,
                        swapId: order.swapId,
                        tokenInfoCount: persistedOrder ? persistedOrder.tokenInfoCount : 0,
                        pending: persistedOrder ? persistedOrder.pending : false,
                        minExpect: persistedOrder ? persistedOrder.minExpect : false,
                        newOrder: (!persistedOrder || persistedOrder.id !== order.orderId)
                    };
                    o.checked = await checkAllowance(network.pairList[o.pairId].address, xorAddress(buyer, order.oIndex), order.value, o.pairId);
                    let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                    if (trueOrder) {
                        activeBuyOrderMap.set(token + "_" + buyer, o);
                    } else {
                        buyOrderMap.set(token + "_" + buyer, o);
                    }
                }
            }
        } catch (e) {
            console.log("get buy orders 1 error");
            console.log(e);
        }
    } catch (e) {
        console.log("get buy orders 2 error");
        console.log(e);
    }
};


let getSellOrders = async function (sellOrders) {
    try {
        let _promises2 = [];
        for (let i = 0; i < sellOrders.length; i++) {

            let sellParams = sellOrders[i];
            let token = sellParams.pair;
            let seller = sellParams.taker;
            _promises2.push(orderProviderContract.methods.getTokenSellOrder(token, seller).call());
        }
        try {
            let results2 = await Promise.all(_promises2);
            for (let i = 0; i < results2.length; i++) {
                let seller = sellOrders[i].taker;
                let token = sellOrders[i].pair;
                let key = initTokenInfoKey(results2[i], token);
                tokenKeys.set(key, key);
                let order = results2[i];
                let persistedOrder = activeSellOrderMap.get(token + "_" + seller);
                persistedOrder = persistedOrder ? persistedOrder : sellOrderMap.get(token + "_" + seller);
                if (((order.orderId % groupCount) === (processorNumber % groupCount))
                    && !order.executed && !order.canceled) {
                    let o = {
                        price: order.price,
                        value: order.value,
                        up: order.up,
                        direct: order.direct,
                        id: order.orderId,
                        executed: order.executed,
                        canceled: order.canceled,
                        transactionTime: order.transactionTime * 1000,
                        blockNumber: order.blockNumber,
                        transactionFee: order.transactionFee,
                        mod: order.mod,
                        seller: seller,
                        token: token,
                        index: order.oIndex,
                        expired: false,
                        gasPrice: web3.utils.toHex(order.gasCount * network.gasCountPrice),
                        pairId: order.pairId,
                        liqPairId: order.liqPairId,
                        swapId: order.swapId,
                        tokenInfoCount: persistedOrder ? persistedOrder.tokenInfoCount : 0,
                        pending: persistedOrder ? persistedOrder.pending : false,
                        minExpect: persistedOrder ? persistedOrder.minExpect : false,
                        newOrder: (!persistedOrder || persistedOrder.id !== order.orderId)
                    };
                    let tokenAddr = o.pairId == 0 ? token : xorAddress(token, network.pairList[o.pairId].address);
                    o.checked = await checkAllowance(tokenAddr, xorAddress(seller, order.oIndex), order.value, -1);
                    let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                    if (trueOrder) {
                        activeSellOrderMap.set(token + "_" + seller, o);
                    } else {
                        sellOrderMap.set(token + "_" + seller, o);
                    }
                }
            }
        } catch
            (e) {
            console.log("get sell orders 1 error");
            console.log(e);
        }

    } catch
        (e) {
        console.log("get sell orders 2 error");
        console.log(e);
    }
};

let initTokenInfoKey = function (order, token) {
    let pairId = order.pairId;
    let liqPairId = order.liqPairId;
    let swapId = order.swapId;
    let tokenAddr = pairId == 0 ? token : xorAddress(token, network.pairList[pairId].address);
    return tokenAddr + "_" + pairId + "_" + liqPairId + "_" + swapId;
};

let checkTokenInfos = async function () {
    try {
        let tokenInfoPromises = [];
        let tokenKeyMap = new Map();
        let j = 0;
        for (let key of tokenKeys.keys()) {
            let params = key.split("_");
            let token = params[0];
            let pairId = params[1];
            let liqPairId = params[2];
            let swapId = params[3];
            tokenInfoPromises.push(tokenInfoContract.methods.getTokenInfo(token, network.swapAMMs[swapId].address, network.pairList[pairId].address, network.pairList[liqPairId].address).call());
            tokenKeyMap.set(j++,key);
        }
        const results = await Promise.allSettled(tokenInfoPromises);
        for (let i = 0; i < results.length;i++) {
            let key = tokenKeyMap.get(i);
            if(!key){
                console.log("key undefined");
            }
            if (results[i].status === 'fulfilled') {
                let params = key.split("_");
                let pairId = params[1];
                let liqPairId = params[2];
                let oldTokenInfo = tokenInfoMap.get(key);
                let newTokenInfo = analyzeTokenInfo(results[i].value, pairId, liqPairId);
                newTokenInfo.priceChanged = ((oldTokenInfo && !web3.utils.toBN(oldTokenInfo.price).eq(web3.utils.toBN(newTokenInfo.price))) || !oldTokenInfo);
                if (oldTokenInfo && oldTokenInfo.count !== undefined) {
                    newTokenInfo.count = oldTokenInfo.count + 1;
                } else {
                    newTokenInfo.count = 0;
                }

                tokenInfoMap.set(key, newTokenInfo);
            } else {
                console.log(key + " token info is not fetched");
            }
        }
    } catch (e) {
        console.log("check token infos error");
        console.log(e);
    }
};


let checkOrders = async function (orderMap, isBuy, isActive) {
    try {
        let currentTime = parseInt(lastBlockTime % timeInterval);
        let correctTime = (currentTime > timeDuration * memberId && currentTime <= timeDuration * memberId + (timeDuration / network.blockInterval));
        if (isActive || correctTime) {
            for (let key of orderMap.keys()) {
                let order = orderMap.get(key);
                if (order.checked) {
                    let tokenAddr = order.pairId == 0 ? order.token : xorAddress(order.token, network.pairList[order.pairId].address);
                    let tokenKey = tokenAddr + "_" + order.pairId + "_" + order.liqPairId + "_" + order.swapId;
                    let tokenInfo = tokenInfoMap.get(tokenKey);
                    let checkTokenInfo = (tokenInfo && tokenInfo.priceChanged && (tokenInfo.count > order.tokenInfoCount)) || order.newOrder || (!order.correctTime && correctTime);
                    if (order.minExpect) {
                        order.minExpect = !checkTokenInfo;
                    } else {
                        checkTokenInfo = true;
                    }
                    if (tokenInfo) {
                        order.tokenInfoCount = tokenInfo.count;
                    }
                    order.newOrder = false;
                    if (checkTokenInfo && checkConditions(order, tokenInfo) || order.mod > 4) {
                        if (isBuy) {
                            await executeBuyOrder(order, tokenAddr);
                        } else {
                            await executeSellOrder(order, tokenAddr);
                        }
                    }
                    order.correctTime = true;
                }
            }

        }
    } catch (e) {
        console.log("check orders error");
        console.log(e);
    }
};


let executeBuyOrder = async function (order, token) {
    try {
        if (!order.executed && !order.canceled && !order.pending && !order.minExpect) {
            tx.gasPrice = order.gasPrice;
            order.pending = true;
            let result = await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).estimateGas(tx);
            if ((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1) {
                await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).send(tx);
                console.log("buy order success order id : " + order.id);
                order.executed = true;
                order.pending = false;
            } else {
                console.log("high gas order id : " + order.id);
            }
        }
    } catch (e) {
        if (!e.message.includes("INSUFFICIENT_OUTPUT_AMOUNT")) {
            console.log("gas error ", e);
        } else {
            console.log("min buy expect order not executed");
        }
        order.minExpect = true;
        order.pending = false;
    }
};


let executeSellOrder = async function (order, token) {
    try {
        if (!order.executed && !order.canceled && !order.pending && !order.minExpect) {
            tx.gasPrice = order.gasPrice;
            order.pending = true;
            let result = await orderProviderContract.methods.sellOrderExecute(token, order.seller, getPath(token, order, false), order.pairId).estimateGas(tx);
            if ((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1) {
                await orderProviderContract.methods.sellOrderExecute(token, order.seller, getPath(token, order, false), order.pairId).send(tx);
                console.log("sell order success order id : " + order.id);
                order.executed = true;
                order.pending = false;
            } else {
                console.log("high gas order id : " + order.id);
            }
        }
    } catch (e) {
        if (!e.message.includes("INSUFFICIENT_OUTPUT_AMOUNT")) {
            console.log("gas error ", e);
        } else {
            console.log("min sell expect order not executed");
        }
        order.minExpect = true;
        order.pending = false;
    }
};


let orderRemovalCheck = function () {
    try {
        for (let key of buyOrderMap.keys()) {
            let order = buyOrderMap.get(key);
            removalCheck(buyOrderMap, order, order.id, key);
        }
        for (let key of sellOrderMap.keys()) {
            let order = sellOrderMap.get(key);
            removalCheck(sellOrderMap, order, order.id, key);
        }
        for (let key of activeBuyOrderMap.keys()) {
            let order = activeBuyOrderMap.get(key);
            removalCheck(activeBuyOrderMap, order, order.id, key);
        }
        for (let key of activeSellOrderMap.keys()) {
            let order = activeSellOrderMap.get(key);
            removalCheck(activeSellOrderMap, order, order.id, key);
        }
    } catch (e) {
        console.log(e);
    }

};

let removalCheck = async function (orderMap, order, id, orderKey) {
    try {
        if (order.buyer) {
            let o = await orderProviderContract.methods.getTokenBuyOrder(order.token, order.buyer).call();
            if (o.executed || o.canceled || o.orderId != id) {
                orderMap.delete(orderKey);
            }
        } else {
            let o = await orderProviderContract.methods.getTokenSellOrder(order.token, order.seller).call();
            let tokenAddr = o.pairId == 0 ? order.token : xorAddress(order.token, network.pairList[o.pairId].address);
            if (o.executed || o.canceled || o.orderId != id) {
                orderMap.delete(orderKey);
            }
        }
    } catch (e) {
        console.log("removal check error");
        console.log(e);
    }
};


let checkBlock = async function () {
    try {
        lastBlockTime = parseInt(new Date().getTime() / 1000);
    } catch (e) {
        console.log("block error");
        console.log(e);
    }
};

let checkAllowance = async function (token, user, value, pairId) {
    try {
        if (pairId == 0) {
            return true;
        } else {
            let tokenContract;
            if (tokenContractMap.get(token)) {
                tokenContract = tokenContractMap.get(token);
            } else {
                tokenContract = new web3.eth.Contract(serverAbi.erc20(), token, {
                    gasLimit: web3.utils.toHex(network.gasLimit),
                    gasPrice: web3.utils.toHex(network.gasPrice)
                });
                tokenContractMap.set(token, tokenContract);
            }
            let balance = await tokenContract.methods.balanceOf(user).call();
            if (web3.utils.toBN(balance).cmp(web3.utils.toBN(value)) !== -1) {
                let allowance = await tokenContract.methods.allowance(user, network.orderAddress).call();
                return web3.utils.toBN(allowance).cmp(web3.utils.toBN(value)) !== -1;
            } else {
                return false;
            }
        }
    } catch (e) {
        console.log(e);
        console.log("check allowance error");
        return false;
    }
};

let analyzeTokenInfo = function (tokenInfo, pairId, liqPairId) {
    if (tokenInfo) {
        let info = {};
        info.symbol = tokenInfo.symbol;
        info.name = tokenInfo.name;
        info.totalSupply = tokenInfo.totalSupply;
        info.decimal = tokenInfo.decimal;
        if (pairId !== liqPairId) {
            info.price = tokenInfo.otherPrice;
            info.reserve = tokenInfo.reserve;
            info.direct = false;
            if (web3.utils.toBN(tokenInfo.otherReserve.wETHReserve).cmp(web3.utils.toBN(minLiquidity)) === 1) {
                info.reserve = tokenInfo.otherReserve;
                info.direct = true;
            }
        } else {
            info.price = tokenInfo.price;
            info.reserve = tokenInfo.reserve;
            info.direct = true;
            if (web3.utils.toBN(tokenInfo.reserve.wETHReserve).cmp(web3.utils.toBN(minLiquidity)) === -1) {
                if (web3.utils.toBN(tokenInfo.otherReserve.wETHReserve).cmp(web3.utils.toBN(minLiquidity)) === 1) {
                    info.direct = false;
                    info.reserve = tokenInfo.otherReserve;
                }
            }
        }
        return info;
    }
};


let getPath = function (token, order, buy) {
    if (buy) {
        if (order.pairId === order.liqPairId) {
            return [network.pairList[order.pairId].address, token];
        } else {
            return [network.pairList[order.pairId].address, network.pairList[order.liqPairId].address, token];
        }
    } else {
        if (order.pairId === order.liqPairId) {
            return [token, network.pairList[order.pairId].address];
        } else {
            return [token, network.pairList[order.liqPairId].address, network.pairList[order.pairId].address];
        }
    }
};

let checkConditions = function (order, tokenInfo) {

    if (tokenInfo && tokenInfo.price) {
        if (order.mod == 1 || order.mod == 3) {
            return (order.up && compareNumbers(order.price, tokenInfo.reserve.wETHReserve) !== -1 && compareNumbers(tokenInfo.reserve.wETHReserve, 0) === 1)
                || (!order.up && compareNumbers(order.price, tokenInfo.reserve.wETHReserve) !== 1);
        } else if (order.mod == 2 || order.mod == 4) {
            return (order.up && compareNumbers(order.price, tokenInfo.reserve.tokenReserve) !== -1 && compareNumbers(tokenInfo.reserve.tokenReserve, 0) === 1)
                || (!order.up && compareNumbers(order.price, tokenInfo.reserve.tokenReserve) !== 1);
        } else {
            return (order.up && compareNumbers(order.price, tokenInfo.price) !== -1 && compareNumbers(tokenInfo.price, 0) === 1)
                || (!order.up && compareNumbers(order.price, tokenInfo.price) !== 1);
        }
    } else {
        return false;
    }

};

let compareNumbers = function (a, b) {
    return web3.utils.toBN(a).cmp(web3.utils.toBN(b));
};


function xorAddress(a, b) {
    let address = web3.utils.toHex(web3.utils.toBN(a).xor(web3.utils.toBN(b)));
    if (address.length < 42) {
        let remain = "";
        let diff = 42 - address.length;
        for (let i = 0; i < diff; i++) {
            remain += "0";
        }
        return "0x" + remain + address.substr(1 + diff, 42 - (2 + diff));
    } else {
        return address;
    }
}
