let Web3 = require('web3');
let serverAbi = require("./abi");
let config = require("./config");
let lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('wallet.txt')
});

const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

let uniswapV2Contract;
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
let tokenInfoMap = new Map();
let buyOrderMap = new Map();
let activeBuyOrderMap = new Map();
let sellOrderMap = new Map();
let activeSellOrderMap = new Map();
let tokenContractMap = new Map();


lineReader.on('line', function (line) {
    let params = line.split(",");
    publicKey = params[0];
    privateKey = params[1];
}).on('close', function () {
    init();
});


let init = function () {
    try {
        network = config.config()[myArgs[1]];
        console.log("connecting to : " + network.name);
        let networkProvider = network.nodeAddress;
        web3 = new Web3(networkProvider);
        let key = web3.utils.toBN(web3.utils.toHex(myArgs   [0])).xor(web3.utils.toBN(0).xor(web3.utils.toBN(config.salt())));
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
        setInterval(function () {
            try {
                initProvider();
                console.log("token map size : " + tokenMap.size);
                console.log("token info map size : " + tokenInfoMap.size);
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

let initProvider = function () {
    approverContract.methods.getProccesor(mainWallet).call().then(function (processorInfo) {
        orderProviderContract.methods.getGeneralInfo().call().then(function (generalInfo) {
            tokenInfoContract.methods.getMinLiquidity().call().then(function (_minLiquidity) {
                timeInterval = generalInfo._timeInterval;
                processorNumber = processorInfo.processorNumber;
                processorCount = processorInfo._lastProcessorNumber;
                groupMemberCount = generalInfo._groupMemberCount;
                minLiquidity = _minLiquidity;
                timeDuration = timeInterval / groupMemberCount;
                groupCount = (processorCount % groupMemberCount) !== 0 ? parseInt(processorCount / groupMemberCount) + 1 : parseInt(processorCount / groupMemberCount);
                memberId = parseInt(processorNumber / groupCount);
                console.log("group count " + groupCount);
                console.log("group member count " + groupMemberCount);
                tx = {
                    from: mainWallet,
                    value: 0,
                    gasPrice: web3.utils.toHex(network.gasPrice),
                    gasLimit: web3.utils.toHex(network.gasLimit)
                };
            }).catch(function (e) {
                console.log("error message");
                console.log(e);
            });
        }).catch(function (e) {
            console.log("error message");
            console.log(e);
        });
    }).catch(function (e) {
        console.log("error message");
        console.log(e);
    });
};

let initApp = async function () {
    try {
        await getTokens();
        getBuyOrders();
        getSellOrders();
        setInterval(function () {
            try {
                getTokens().then(function () {
                    orderRemovalCheck();
                    getBuyOrders();
                    getSellOrders();
                });
            } catch (e) {
                console.log(e);
            }
        }, 2000);

        setInterval(function () {
            try {
                checkTokenInfos();
            } catch (e) {
                console.log(e);
            }
        }, 1000);

        setInterval(function () {
            try {
                checkBlock();
            } catch (e) {
                console.log(e);
            }
        }, 500);

        setInterval(function () {
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

        setInterval(function () {
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
        console.log(e);
    }
};


let getTokens = async function () {
    try {
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
            tokenMap.set(results[i], results2[i]);
        }
    } catch (e) {
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
                    initTokenInfoKey(results2[0], token);
                    for (let i = 0; i < results2.length; i++) {
                        let buyer = results[i];
                        let order = results2[i];
                        if ((order.orderId % groupCount) === (processorNumber % groupCount)) {
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
                            checkAllowance(network.pairList[o.pairId].address, buyer, order.value, o.pairId, function (checked) {
                                if (checked) {
                                    let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                                    if (trueOrder) {
                                        activeBuyOrderMap.set(token + "_" + buyer, o);
                                    } else {
                                        buyOrderMap.set(token + "_" + buyer, o);
                                    }
                                }
                            });

                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }

        }
    } catch (e) {
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
                    initTokenInfoKey(results2[0], token);
                    for (let i = 0; i < results2.length; i++) {
                        let seller = results[i];
                        let order = results2[i];
                        if ((order.orderId % groupCount) === (processorNumber % groupCount)) {
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
                            checkAllowance(tokenAddr, seller, order.value, o.pairId, function (checked) {
                                if (checked) {
                                    let trueOrder = ((o.id / groupCount) % groupMemberCount) === memberId;
                                    if (trueOrder) {
                                        activeSellOrderMap.set(token + "_" + seller, o);
                                    } else {
                                        sellOrderMap.set(token + "_" + seller, o);
                                    }
                                }else{
                                    console.log("no allowance");
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        }
    } catch (e) {
        console.log(e);
    }
};

let initTokenInfoKey = function (order, token) {
    let pairId = order.pairId;
    let liqPairId = order.liqPairId;
    let swapId = order.swapId;
    let tokenAddr = pairId == 0 ? token : xorAddress(token, network.pairList[pairId].address);
    let key = tokenAddr + "_" + pairId + "_" + liqPairId + "_" + swapId;
    if (!tokenInfoMap.get(key)) {
        tokenInfoMap.set(key, {});
    }
};

let checkTokenInfos = async function () {
    try {
        let tokenInfoPromises = [];
        for (let key of tokenInfoMap.keys()) {
            let params = key.split("_");
            let token = params[0];
            let pairId = params[1];
            let liqPairId = params[2];
            let swapId = params[3];
            tokenInfoPromises.push(tokenInfoContract.methods.getTokenInfo(token, network.swapAMMs[swapId].address, network.pairList[pairId].address, network.pairList[liqPairId].address).call());
        }
        let results = await Promise.all(tokenInfoPromises);
        let i = 0;
        for (let key of tokenInfoMap.keys()) {
            let params = key.split("_");
            let pairId = params[1];
            let liqPairId = params[2];
            tokenInfoMap.set(key, analyzeTokenInfo(results[i], pairId, liqPairId));
            i++;
        }
    } catch (e) {
        console.log(e);
    }
};


let checkOrders = async function (orderMap, isBuy, isActive) {
    try {
        let currentTime = parseInt(lastBlockTime % timeInterval);
        let correctTime = (currentTime > timeDuration * memberId && currentTime <= timeDuration * memberId + (timeDuration / 3));
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
        console.log(e);
    }
};


let executeBuyOrder = async function (order, token) {
    try {
        if (!order.executed && !order.canceled && !order.pending) {
            tx.gasPrice = order.gasPrice;
            order.pending = true;
            let result = await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).estimateGas(tx);
            if((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1) {
                order.executed = true;
                await orderProviderContract.methods.buyOrderExecute(token, order.buyer, getPath(token, order, true), order.pairId).send(tx);
                console.log("buy order success");
                order.pending = false;
            }else{
                console.log("high gas");
            }
        }
    } catch (e) {
        console.log("gas error ", e);
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
            if((web3.utils.toBN(result).mul(web3.utils.toBN(order.gasPrice))).cmp(web3.utils.toBN(order.transactionFee)) !== 1){
                order.executed = true;
                await orderProviderContract.methods.sellOrderExecute(token, order.seller, getPath(token, order, false), order.pairId).send(tx);
                console.log("sell order success");
                order.pending = false;
            }else{
                console.log("high gas");
            }
        }
    } catch (e) {
        console.log("gas error ", e);
        order.pending = false;
        order.executed = true;
    }
};


let orderRemovalCheck = function () {
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

};

let removalCheck = function (orderMap, order, id, orderKey) {
    if (order.buyer) {
        orderProviderContract.methods.getTokenBuyOrder(order.token, order.buyer).call().then(function (o) {
            if (o.executed || o.canceled || o.orderId != id) {
                orderMap.delete(orderKey);
            }
        }).catch(function (e) {
            console.log(e);
        });
    } else {
        orderProviderContract.methods.getTokenSellOrder(order.token, order.seller).call().then(function (o) {
            if (o.executed || o.canceled || o.orderId != id) {
                orderMap.delete(orderKey);
            }
        }).catch(function (e) {
            console.log(e);
        });
    }
};


let checkBlock = function () {
    web3.eth.getBlockNumber(function (error, blockNumber) {
        if (!error) {
            web3.eth.getBlock(blockNumber, function (error, block) {
                if (!error && block && block.timestamp) {
                    lastBlockTime = block.timestamp;
                }
            });
        }
    });
};

let checkAllowance = function (token, user, value, pairId, callback) {
    if (pairId == 0) {
        callback(true);
    } else {
        let tokenContract;
        if(tokenContractMap.get(token)){
           tokenContract = tokenContractMap.get(token);
        }else{
            tokenContract = new web3.eth.Contract(serverAbi.erc20(), token, {
                gasLimit: web3.utils.toHex(network.gasLimit),
                gasPrice: web3.utils.toHex(network.gasPrice)
            });
            tokenContractMap.set(token,tokenContract);
        }
        tokenContract.methods.balanceOf(user).call().then(function (balance) {
            if (web3.utils.toBN(balance).cmp(web3.utils.toBN(value)) !== -1) {
                tokenContract.methods.allowance(user, network.orderAddress).call().then(function (allowance) {
                    callback(web3.utils.toBN(allowance).cmp(web3.utils.toBN(value)) !== -1);
                }).catch(function (e) {
                    callback(false);
                });
            } else {
                callback(false);
            }
        }).catch(function (e) {
            callback(false);
        });
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
            return [token,network.pairList[order.liqPairId].address, network.pairList[order.pairId].address];
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
