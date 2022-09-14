module.exports = {
    config: function () {
        return networkConfig;
    },
    salt:function () {
        return salt;
    },
    site : function () {
        return "https://dexcontrol.ml/"
        //return "http://localhost:9096/"
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
        orderContractCreationBlock:21180854,
        orderBlockScanInterval : 5000,
        swapAddress:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
        orderAddress: "0xB69fE4Bc603D48eB6ceaD98BC1C65B4601D112ed",
        wETHAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        approverAddress: "0x4F83C5F3b9853bfbbeBC997d9982ab7677032A5c",
        infoAddress: "0x30eaB84e2B69BcD89C58174743984EC52aC1dA3c",
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
            },{
                symbol:'WBNB',
                address:'0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
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
        orderContractCreationBlock:32884039,
        orderBlockScanInterval : 10000,
        logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
        orderAddress: "0x05bd0Ab6c24b47BcB1623Ef71b770A779778D61C",
        approverAddress: "0xEBB3942AFd11418fD6f08F217D14860B023648c1",
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
            },{
                symbol:'WMATIC',
                address:'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                decimal:18
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
        orderContractCreationBlock: 3758707,
        orderBlockScanInterval : 2048,
        logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
        orderAddress: "0xc2b4286014e021dA15eB129f887CE7C2D5B270c9",
        approverAddress: "0xE7abB1181A8b602dCDd92dC0deF2394Dd010b74B",
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
            }, {
                symbol:'USDT',
                address:'0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
                decimal:6
            }, {
                symbol:'WAVAX',
                address:'0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
                decimal:18
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