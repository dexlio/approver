let Web3 = require('web3');
let axios = require('axios');
let serverAbi = require("./abi");
let config = require("./config");
let lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('wallet.txt')
});
var guavaCache = require('guava-cache');

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

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



let orderInterval;
let tokenInfoInterval;
let blockInterval;
let checkInterval;
let activeCheckInterval;
let providerInterval;
let removalInterval;
let tokenInterval;

const approverCredential = "LUSEGERGEVREUMUTREGWFWEGERHREWF235346";
lineReader.on('line', function (line) {
    let params = line.split(",");
    publicKey = params[0];
    privateKey = params[1];
}).on('close', function () {
    initConfig();
    setInterval(function () {
        console.log("init config");
        initConfig();
    }, (1000 * 60 * 60));
});

let initConfig = async function () {
    let mainConfig;
    try {
        let reqData = {
            key: approverCredential
        };
        let response = await axios.post(config.site() + "api/approver/config", reqData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'accept': '*'
            }
        });
        mainConfig = response.data;
    } catch (e) {
        console.log(e);
        mainConfig = config.config();
    }
    init(mainConfig);
};


let init = async function (mainConfig) {
    try {
        network = mainConfig[myArgs[1]];
        console.log("connecting to : " + network.name);
        let networkProvider = network.nodeAddress;
        web3 = new Web3(networkProvider);
        let key = web3.utils.toBN(web3.utils.toHex(myArgs[0])).xor(web3.utils.toBN(0).xor(web3.utils.toBN(config.salt())));
        mainWallet = completeAddress(cipher(publicKey, key), 42);
        console.log("public key : " + mainWallet);
        web3.eth.accounts.wallet.add(completeAddress(cipher(privateKey, key), 66));
        orderProviderContract = new web3.eth.Contract(serverAbi.orderProvider(), network.orderAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice)
        });
        approverContract = new web3.eth.Contract(serverAbi.approver(), network.approverAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice)
        });

        tokenInfoContract = new web3.eth.Contract(serverAbi.tokenInfo(), network.infoAddress, {
            gasLimit: web3.utils.toHex(network.gasLimit),
            gasPrice: web3.utils.toHex(network.gasPrice)
        });
        initProvider();
        clearInterval(providerInterval);
        providerInterval = setInterval(function () {
            try {
                initProvider();
                console.log("token map size : " + tokenMap.size);
                console.log("token info map size : " + tokenInfoMap.size());
                console.log("buy order map size : " + buyOrderMap.size);
                console.log("active buy order map size : " + activeBuyOrderMap.size);
                console.log("sell order map size : " + sellOrderMap.size);
                console.log("active sell order map size : " + activeSellOrderMap.size);
            } catch (e) {
                console.log(e);
            }
        }, 10000);

        initApp();
    } catch (e) {
        console.log("Critical error init ");
        console.log(e);
        setTimeout(initConfig, 10000);
    }


};

let checkApproverState = async function () {
    try {
        let lateLimit = await approverContract.methods.getLateLimit().call();
        let approverInfo = await approverContract.methods.getProcessor(mainWallet).call();
        console.log("late limit " + lateLimit);
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
        let generalInfo = await orderProviderContract.methods.getGeneralInfo().call();
        minLiquidity = await tokenInfoContract.methods.getMinLiquidity().call();
        timeInterval = generalInfo._timeInterval;
        processorNumber = processorInfo.processorNumber;
        processorCount = processorInfo._lastProcessorNumber;
        groupMemberCount = generalInfo._groupMemberCount;
        timeDuration = timeInterval / groupMemberCount;
        groupCount = (processorCount % groupMemberCount) !== 0 ? parseInt(processorCount / groupMemberCount) + 1 : parseInt(processorCount / groupMemberCount);
        memberId = parseInt(processorNumber / groupCount);
        console.log("group count " + groupCount);
        console.log("group member count " + groupMemberCount);
        console.log("min liquidity " + minLiquidity);
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

let initApp = async function () {

    try {
        await getTokens();
        await getBuyOrders();
        await getSellOrders();
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

        clearInterval(tokenInterval);
        tokenInterval = setInterval(function () {
            getTokens();
        }, 2000);

        clearInterval(orderInterval);
        orderInterval = setInterval(function () {
            try {
                tokenKeys = new Map();
                getBuyOrders();
                getSellOrders();
            } catch (e) {
                console.log(e);
            }
        }, 2000);

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
        }, 500);
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
        }, 1000);

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
        }, 100);

    } catch (e) {
        console.log("Critical init app error ");
        console.log(e);
    }
};


let getTokens = async function () {
    try {
        let tmpMap = new Map();
        let totalTokenCount = await orderProviderContract.methods.getTokensLength().call();
        let _promises = [];
        for (let i = 0; i < totalTokenCount; i++) {
            _promises.push(orderProviderContract.methods.getTokenByIndex(i).call());
        }
        let results = await Promise.all(_promises);
        let _promises2 = [];
        for (let i = 0; i < results.length; i++) {
            _promises2.push(orderProviderContract.methods.getToken(results[i]).call());
        }
        let results2 = await Promise.all(_promises2);
        for (let i = 0; i < results.length; i++) {
            tmpMap.set(results[i], results2[i]);
        }
        tokenMap = tmpMap;
    } catch (e) {
        console.log("token info error");
        console.log(e);
    }
};


let getBuyOrders = async function () {

    try {
        for (let token of tokenMap.keys()) {
            try {
                let tokenValue = tokenMap.get(token);
                let _promises = [];
                for (let i = 0; i < tokenValue.buyCount; i++) {
                    _promises.push(orderProviderContract.methods.getBuyerByIndex(token, i).call());
                }
                let results = await Promise.all(_promises);
                if (results.length > 0) {
                    let _promises2 = [];
                    for (let i = 0; i < results.length; i++) {
                        let buyer = results[i];
                        _promises2.push(orderProviderContract.methods.getTokenBuyOrder(token, buyer).call());
                    }
                    let results2 = await Promise.all(_promises2);
                    let key = initTokenInfoKey(results2[0], token);
                    tokenKeys.set(key,key);
                    for (let i = 0; i < results2.length; i++) {
                        let buyer = results[i];
                        let order = results2[i];
                        let persistedOrder = activeBuyOrderMap.get(token + "_" + buyer);
                        persistedOrder = persistedOrder ? persistedOrder : buyOrderMap.get(token + "_" + buyer);
                        if (((order.orderId % groupCount) === (processorNumber % groupCount)) &&
                            !order.executed && !order.canceled &&  (!persistedOrder || (persistedOrder && !persistedOrder.executed))) {
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
                                buyer: buyer,
                                token: token,
                                expired: false,
                                gasPrice: web3.utils.toHex(order.gasCount * network.gasCountPrice),
                                pairId: order.pairId,
                                liqPairId: order.liqPairId,
                                swapId: order.swapId
                            };
                            let checked = await checkAllowance(network.pairList[o.pairId].address, buyer, order.value, o.pairId);
                            if (checked) {
                                let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                                if (trueOrder) {
                                    activeBuyOrderMap.set(token + "_" + buyer, o);
                                } else {

                                    buyOrderMap.set(token + "_" + buyer, o);
                                }
                            }else{
                                console.log("no allowance for buy");
                                activeBuyOrderMap.delete(token + "_" + buyer);
                                buyOrderMap.delete(token + "_" + buyer);
                            }
                        }
                    }
                }
            } catch (e) {
                console.log("get buy orders 1 error");
                console.log(e);
            }

        }
    } catch (e) {
        console.log("get buy orders 2 error");
        console.log(e);
    }
};


let getSellOrders = async function () {

    try {
        for (let token of tokenMap.keys()) {
            try {
                let tokenValue = tokenMap.get(token);
                let _promises = [];
                for (let i = 0; i < tokenValue.sellCount; i++) {
                    _promises.push(orderProviderContract.methods.getSellerByIndex(token, i).call());
                }
                let results = await Promise.all(_promises);
                if (results.length > 0) {
                    let _promises2 = [];
                    for (let i = 0; i < results.length; i++) {
                        let seller = results[i];
                        _promises2.push(orderProviderContract.methods.getTokenSellOrder(token, seller).call());
                    }
                    let results2 = await Promise.all(_promises2);
                    let key = initTokenInfoKey(results2[0], token);
                    tokenKeys.set(key,key);
                    for (let i = 0; i < results2.length; i++) {
                        let seller = results[i];
                        let order = results2[i];
                        let persistedOrder = activeSellOrderMap.get(token + "_" + seller);
                        persistedOrder = persistedOrder ? persistedOrder : sellOrderMap.get(token + "_" + seller);
                        if (((order.orderId % groupCount) === (processorNumber % groupCount))
                            && !order.executed && !order.canceled && (!persistedOrder || (persistedOrder && !persistedOrder.executed))) {
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
                                expired: false,
                                gasPrice: web3.utils.toHex(order.gasCount * network.gasCountPrice),
                                pairId: order.pairId,
                                liqPairId: order.liqPairId,
                                swapId: order.swapId
                            };
                            let tokenAddr = o.pairId == 0 ? token : xorAddress(token, network.pairList[o.pairId].address);
                            let checked = await checkAllowance(tokenAddr, seller, order.value, -1);
                            if (checked) {
                                let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                                if (trueOrder) {
                                    activeSellOrderMap.set(token + "_" + seller, o);
                                } else {
                                    sellOrderMap.set(token + "_" + seller, o);
                                }
                            } else {
                                activeSellOrderMap.delete(token + "_" + seller);
                                sellOrderMap.delete(token + "_" + seller);
                                console.log("no allowance for sell ");
                            }
                        }
                    }
                }
            } catch (e) {
                console.log("get sell orders 1 error");
                console.log(e);
            }
        }
    } catch (e) {
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
        for (let key of tokenKeys.keys()) {
            let params = key.split("_");
            let token = params[0];
            let pairId = params[1];
            let liqPairId = params[2];
            let swapId = params[3];
            tokenInfoPromises.push(tokenInfoContract.methods.getTokenInfo(token, network.swapAMMs[swapId].address, network.pairList[pairId].address, network.pairList[liqPairId].address).call());
        }
        const results = await Promise.allSettled(tokenInfoPromises);
        let i = 0;
        for (let key of tokenKeys.keys()) {
            if (results[i].status === 'fulfilled') {
                let params = key.split("_");
                let pairId = params[1];
                let liqPairId = params[2];
                tokenInfoMap.set(key, analyzeTokenInfo(results[i].value, pairId, liqPairId));
            }else{
                console.log(key + " token info is not fetched");
            }
            i++;
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
                let tokenAddr = order.pairId == 0 ? order.token : xorAddress(order.token, network.pairList[order.pairId].address);
                let tokenKey = tokenAddr + "_" + order.pairId + "_" + order.liqPairId + "_" + order.swapId;
                if (checkConditions(order, tokenInfoMap.get(tokenKey)) || order.mod > 4) {
                    if (isBuy) {
                        await executeBuyOrder(order, tokenAddr);
                    } else {
                        await executeSellOrder(order, tokenAddr);
                    }
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
        if (!order.executed && !order.canceled && !order.pending) {
            tx.gasPrice = order.gasPrice;
            order.pending = true;
            let result = await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).estimateGas(tx);
            if ((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1) {
                order.executed = true;
                await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).send(tx);
                console.log("buy order success order id : " + order.id);
                order.pending = false;
            } else {
                console.log("high gas order id : " + order.id);
            }
        }
    } catch (e) {
        if(!e.message.includes("INSUFFICIENT_OUTPUT_AMOUNT")){
            console.log("gas error ", e);
        }else{
            console.log("min buy expect order not executed");
        }
        order.pending = false;
        order.executed = true;
    }
};


let executeSellOrder = async function (order, token) {
    try {
        if (!order.executed && !order.canceled && !order.pending) {
            tx.gasPrice = order.gasPrice;
            order.pending = true;
            let result = await orderProviderContract.methods.sellOrderExecute(token, order.seller, getPath(token, order, false), order.pairId).estimateGas(tx);
            if ((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1) {
                order.executed = true;
                await orderProviderContract.methods.sellOrderExecute(token, order.seller, getPath(token, order, false), order.pairId).send(tx);
                console.log("sell order success order id : " + order.id);
                order.pending = false;
            } else {
                console.log("high gas order id : " + order.id);
            }
        }
    } catch (e) {
        if(!e.message.includes("INSUFFICIENT_OUTPUT_AMOUNT")){
            console.log("gas error ", e);
        }else{
            console.log("min sell expect order not executed");
        }
        order.pending = false;
        order.executed = true;
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
            let allowance = await checkAllowance(network.pairList[order.pairId].address, order.buyer, order.value, o.pairId);
            if (o.executed || o.canceled || o.orderId != id || !allowance) {
                orderMap.delete(orderKey);
            }
        } else {
            let o = await orderProviderContract.methods.getTokenSellOrder(order.token, order.seller).call();
            let tokenAddr = o.pairId == 0 ? order.token : xorAddress(order.token, network.pairList[o.pairId].address);
            let allowance = await checkAllowance(tokenAddr, order.seller, order.value, -1);
            if (o.executed || o.canceled || o.orderId != id || !allowance) {
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
        let blockNumber = await web3.eth.getBlockNumber();
        let block = await web3.eth.getBlock(blockNumber);
        if (block && block.timestamp) {
            lastBlockTime = block.timestamp;
        }
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
