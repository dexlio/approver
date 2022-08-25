module.exports = {
    config: function () {
        return networkConfig;
    },
    salt:function () {
        return salt;
    }
};

var salt = "0x75a1bcf425891f9f6a4631aea21605ae1fa5277e9ee1fb2cb924a8ed686f070";

var networkConfig = [
    {
        id:"56",
        name:"Smart Chain",
        symbol:"BNB",
        decimal:18,
        usdDecimal:18,
        gasPrice:5000000000,
        gasCountPrice: 1000000000,
        gasLimit:800000,
        approveLimit:44222,
        usdSymbol:"BUSD",
        swapAddress:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
        orderAddress: "0x1DB527E15caa4a528A99a66ba38698084fb8bbe9",
        wETHAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        approverAddress: "0xDEF399AFe9553177071b57946c10D761fDDB73e4",
        infoAddress: "0x8359Ad9C620C9a33294a7a1dEAc425ad8Ffc02b6",
        usdAddress:"0xe9e7cea3dedca5984780bafc599bd69add087d56",
        scanAddress:"https://bscscan.com/",
        nodeAddress:"https://bsc-dataseed.binance.org/",
        swapSite:"https://pancakeswap.finance/swap?outputCurrency=",
        swapAMMs:[
            {
                name:"PancakeSwapV2",
                address:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
                site:"https://pancakeswap.finance/swap?outputCurrency=",
                logo:"https://raw.githubusercontent.com/trustwallet/assets/master/dapps/exchange.pancakeswap.finance.png"
            },{
                name:"ApeSwap",
                address:"0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
                site:"https://apeswap.finance/swap?outputCurrency=",
                logo:"https://raw.githubusercontent.com/trustwallet/assets/master/dapps/apeswap.finance.png"
            },
            {
                name:"BiSwap",
                address:"0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8",
                site:"https://exchange.biswap.org/swap?outputCurrency=",
                logo:"https://biswap.org/logo.png"
            }
            // {
            //     name:"PancakeSwap V1",
            //     address:"0x05ff2b0db69458a0750badebc4f9e13add608c7f",
            //     site:"https://pancakeswap.finance/swap?outputCurrency=",
            //     logo:"https://raw.githubusercontent.com/trustwallet/assets/master/dapps/exchange.pancakeswap.finance.png"
            // }
        ],
        pairList: [
            {
                symbol:'BNB',
                address:'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
                decimal:18
            }, {
                symbol:'BUSD',
                address:'0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
                decimal:18
            }, {
                symbol:'USDC',
                address:'0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
                decimal:18
            }, {
                symbol:'USDT',
                address:'0x55d398326f99059fF775485246999027B3197955',
                decimal:18
            }
        ]
    },
    {
        id: "137",
        name: "Polygon",
        symbol: "MATIC",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 100000000000,
        gasCountPrice: 1000000000,
        gasLimit: 800000,
        approveLimit: 500000,
        usdSymbol: "USDT",
        blockInterval: 4,
        logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
        orderAddress: "0x44Bf22F5d88569Ae5a2442a3F2C7A9E63A8fFb13",
        approverAddress: "0x36c4feD51f53c4B3442898fD0eb4ccAa009287eE",
        infoAddress: "0x3CBBB0F5cbb6405229E9ab0b5ABe2Ed3d52Ea828",
        wETHAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        usdAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        scanAddress: "https://polygonscan.com/",
        scanName: "Polygonscan",
        nodeAddress: "https://polygon-rpc.com/",
        logoPath: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/",
        swapAMMs:[
            {
                name:"Quickswap",
                address:"0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
                site:"https://quickswap.exchange/#/swap?outputCurrency=",
                logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/assets/0x831753DD7087CaC61aB5644b308642cc1c33Dc13/logo.png"
            }
        ],
        pairList: [
            {
                symbol:'MATIC',
                address:'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                decimal:18
            }, {
                symbol:'USDT',
                address:'0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                decimal:6
            }, {
                symbol:'WETH',
                address:'0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
                decimal:18
            }, {
                symbol:'USDC',
                address:'0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
                decimal:6
            }
        ]
    }, {
        id: "43114",
        name: "Avalanche",
        symbol: "AVAX",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 50000000000,
        gasCountPrice: 1000000000,
        gasLimit: 800000,
        approveLimit: 300000,
        usdSymbol: "USDC",
        blockInterval: 3,
        logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
        orderAddress: "0x4b68F78C40E31160Fa48f949C74E9574669f0407",
        approverAddress: "0x72A6C9EF266D764a2C1e61358c693f911800Afc9",
        infoAddress: "0xF67428189f27E36425572EF4a715E1B6B9078153",
        wETHAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        usdAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        scanAddress: "https://snowtrace.io/",
        scanName: "Snowtrace",
        nodeAddress: "https://api.avax.network/ext/bc/C/rpc",
        logoPath: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/assets/",
        swapAMMs:[
            {
                name:"Pangolinswap",
                address:"0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
                site:"https://app.pangolin.exchange/swap?outputCurrency=",
                logo:"https://app.pangolin.exchange/static/media/icon.adcff230.svg"
            },{
                name:"TraderJoe",
                address:"0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                site:"https://traderjoexyz.com/trade?outputCurrency=",
                logo:"https://traderjoexyz.com/static/media/logo.bc60f78d.png"
            }
        ],
        pairList: [
            {
                symbol:'AVAX',
                address:'0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
                decimal:18
            }, {
                symbol:'USDC',
                address:'0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
                decimal:6
            }, {
                symbol:'USDCE',
                address:'0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
                decimal:6
            }
        ]
    }
];

getNetwork = function(id) {
    if (id == 56) {
        return networkConfig[0];
    } else if(id == 137){
        return networkConfig[1]
    } else if (id == 97) {
        return networkConfig[2];
    }else {
        return networkConfig[0];
    }
};