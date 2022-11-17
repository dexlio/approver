const Web3 = require('web3');
const config = require("./config");

const fs = require('fs');
const myArgs = process.argv.slice(2);
const readline = require('readline');
let web3;

const cipher = function (text, key) {
    return web3.utils.toHex((web3.utils.toBN(text).xor(web3.utils.toBN(key))));
};

const write = function (walletParams, path) {
    fs.writeFileSync(path, walletParams, {encoding: 'utf8', flag: 'w'})
};

const read = function (command) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (command) {
        walletCommands(rl, command);
    } else {
        rl.question('What is the command you want to run? ? Options : \n 0 : create \n 1 : get \n 2 : import \n', function (command) {
            walletCommands(rl, command);
        });
    }

};

const walletCommands = function (rl, command) {
    rl.question('Which network you want to run? ? Options : \n 0 : Binance Smart Chain \n 1 : Polygon Matic \n 2 : Avalanche-C \n ' +
        '3 : Ethereum \n 4 : Arbitrum \n 6 : Fantom \n 7 : Celo \n', function (network) {
        if (config.config()[network]) {
            let networkProvider = config.config()[network].nodeAddress;
            web3 = new Web3(networkProvider);

            if (command == 0 || command === 'create' || command == 2 || command === 'import') {
                if (fs.existsSync("wallet.txt")) {
                    rl.question('A wallet is already registered. Are you sure you want to add a new wallet and override the old one? :  ', function (yes) {
                        if (yes.toLowerCase() === "yes" || yes.toLowerCase() === "y") {
                            createOrUpdateWallet(web3, rl, command,network);
                        } else {
                            rl.close();
                        }
                    });
                } else {
                    createOrUpdateWallet(web3, rl, command,network);
                }

            } else if (command == 1 || command === 'get') {
                rl.question('Type your password :  ', function (password) {
                    let key = web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt())).xor(web3.utils.toBN(0));
                    let lineReader = require('readline').createInterface({
                        input: require('fs').createReadStream('wallet.txt')
                    });
                    lineReader.on('line', function (line) {
                        let params = line.split(",");
                        let publicKey = completeAddress(cipher(params[0], key), 42);
                        let privateKey = completeAddress(cipher(params[1], key), 66);
                        console.log("public key : " + publicKey);
                        console.log("privateKey key : " + privateKey);
                        rl.close();
                    }).on('close', function () {
                        console.log("finish");
                        rl.close();
                    });
                });
            } else {
                console.log("wrong command");
                walletCommands(rl, command);
            }
        } else {
            console.log("wrong network");
            walletCommands(rl, command);
        }
    });
};

const createOrUpdateWallet = function (web3, rl, command, network) {

    rl.question('Type your e-mail address : ', function (mail) {
        if (validateEmail(mail)) {
            rl.question('Type your e-mail address again : ', function (mail2) {
                if (mail === mail2) {
                    rl.question('Set a password for the wallet :  ', function (password) {
                        rl.question('Enter the password again : ', function (password2) {
                            try {
                                let key = web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt())).xor(web3.utils.toBN(0));
                                if (password === password2) {
                                    if (command == 0 || command === 'create') {
                                        createWallet(result => {
                                            console.log("Wallet Add is:", result.address);
                                            console.log("Private Key is:", result.privateKey);
                                            console.log("Save your private key. Don't share anybody. You can add this wallet to metamask");
                                            rl.question('\nDid you save your private key and public key? !!It is very important. If you save, type "Yes" :  ', function (yes) {
                                                write(cipher(result.address, key) + "," + cipher(result.privateKey, key) + "," + network + "," + mail, "wallet.txt");
                                                rl.close();
                                                write((web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt2()))).toString(), "pass.txt");
                                            });
                                        });
                                    } else {
                                        rl.question('What is your public key? ', function (publicKey) {
                                            rl.question('What is your private key ? ', function (privateKey) {
                                                write(cipher(publicKey, key) + "," + cipher(privateKey, key) + "," + network + "," + mail, "wallet.txt");
                                                console.log("Your wallet successfully imported. ");
                                                rl.close();
                                                write(web3.utils.toBN(web3.utils.toHex(password)).xor(web3.utils.toBN(config.salt2())), "pass.txt");
                                            });
                                        });
                                    }
                                } else {
                                    console.log("password does not match");
                                    walletCommands(rl, command);
                                }
                            } catch (e) {
                                console.log(e);
                                console.log("unexpected state");
                                walletCommands(rl, command);
                            }
                        });
                    });
                } else {
                    console.log("email does not match");
                    walletCommands(rl, command);
                }
            });
        } else {
            console.log("Enter the correct e-mail address");
            walletCommands(rl, command);
        }

    });
}

const completeAddress = function (address, length) {
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

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

createWallet = cb => {
    cb(web3.eth.accounts.create());
};

read(myArgs[0]);












