var Web3 = require('web3');
var config = require("./config");

var fs = require('fs');
const myArgs = process.argv.slice(2);
var command = myArgs[0];
var password = myArgs[1];
var network = myArgs[2];
var networkProvider = config.config()[network].nodeAddress;
const web3 = new Web3(networkProvider);

var key = web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt())).xor(web3.utils.toBN(0));

var cipher = function(text,key){
    return web3.utils.toHex((web3.utils.toBN(text).xor(web3.utils.toBN(key))));
};

var write = function (walletParams) {
    fs.writeFileSync("wallet.txt",walletParams,{encoding:'utf8',flag:'w'})
};



var read = function () {
    if(command === "create"){
        createWallet(result => {
            console.log("Wallet Add is:", result.address);
            console.log("Private Key is:", result.privateKey);
            console.log("Save your private key. Don't share anybody. You can add this wallet to metamask");
            write(cipher(result.address,key) + "," + cipher(result.privateKey,key));
        });
    }else if(command === "get"){
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream('wallet.txt')
        });
        lineReader.on('line', function (line) {
            var params = line.split(",");
            var publicKey = completeAddress(cipher(params[0],key),42);
            var privateKey = completeAddress(cipher(params[1],key),66);
            console.log("public key : " + publicKey);
            console.log("privateKey key : " + privateKey);
        }).on('close', function () {
            console.log("finish");

        });
    }else if(command === "import"){
        var publicKey = myArgs[3];
        var privateKey = myArgs[4];
        write(cipher(publicKey,key) + "," + cipher(privateKey,key));
    } else{
        console.log("wrong command");
    }

};

var completeAddress = function(address,length){
    if(address.length < length){
        var remain = "";
        var diff = length - address.length;
        for (let i = 0; i < diff; i++) {
            remain += "0";
        }
        return "0x" + remain + address.substr(1 + diff,length - (2 + diff));
    }else{
        return address;
    }
};

createWallet = cb => {
    cb(web3.eth.accounts.create());
};

read();











