module.exports = {
    config: function () {
        return networkConfig;
    },
    salt:function () {
        return salt;
    },
    salt2:function () {
        return salt2;
    },
    site : function () {
        return "https://dexcontrol.ml/"
        //return "http://localhost:9096/"
    }
};

var salt = "0x75a1bcf425891f9f6a4631aea21605ae1fa5277e9ee1fb2cb924a8ed686f070";
var salt2 = "0x45876238693486734987329864eaf23569235aa23562394376ff235236aae24";

var networkConfig = [
    {
        id:"56",
        name:"Smart Chain",
        symbol:"BNB",
        decimal:18,
        usdDecimal:18,
        gasPrice:5000000000,
        gasCountPrice: 1000000000,
        gasLimit:500000,
        approveLimit:44222,
        blockInterval: 3,
        usdSymbol:"BUSD",
        dynamicGas:false,
        orderContractCreationBlock:22502674,
        orderBlockScanInterval : 5000,
        swapAddress:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
        orderAddress: "0xB49359d936aa464f3C25cA5D86d2EedA9FfF6d47",
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
        gasLimit: 500000,
        approveLimit: 500000,
        usdSymbol: "USDT",
        blockInterval: 2,
        minOrderValue:1,
        dynamicGas:true,
        orderContractCreationBlock:34492514,
        orderBlockScanInterval : 10000,
        logo:"https://dexhub.ml/blockchains/polygon/info/logo.png",
        orderAddress: "0xE0004183c30B632648Ec09A46E67a0d34D7F951D",
        approverAddress: "0xEBB3942AFd11418fD6f08F217D14860B023648c1",
        infoAddress: "0xB6F12A81c7E5F0C50955A4ba7875806806590363",
        wETHAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        usdAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        scanAddress: "https://polygonscan.com/",
        scanName: "Polygonscan",
        nodeAddress: "https://polygon-rpc.com/",
        logoPath: "https://dexhub.ml/blockchains/polygon/assets/",
        swapAMMs:[
            {
                name:"Quickswap",
                address:"0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
                factory:"0x5757371414417b8c6caad45baef941abc7d3ab32",
                site:"https://quickswap.exchange/#/swap?outputCurrency=",
                logo:"https://dexhub.ml/blockchains/polygon/assets/0x831753dd7087cac61ab5644b308642cc1c33dc13/logo.png"
            }, {
                name:"UniswapV3",
                address:"0xE592427A0AEce92De3Edee1F18E0157C05861564",
                factory:"0x1f98431c8ad98523631ae4a59f267346ea31f984",
                site:"https://quickswap.exchange/#/swap?outputCurrency=",
                logo:"https://dexhub.ml/blockchains/polygon/assets/0x831753dd7087cac61ab5644b308642cc1c33dc13/logo.png",
                isV3:true
            }
        ],
        pairList: [
            {
                symbol:'MATIC',
                address:'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                decimal:18
            }, {
                symbol:'USDC',
                address:'0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
                decimal:6
            },{
                symbol:'USDT',
                address:'0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
                decimal:6
            }, {
                symbol:'WETH',
                address:'0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
                decimal:18
            }, {
                symbol:'WMATIC',
                address:'0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
                decimal:18
            }
        ]
    },
    {
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
        dynamicGas:false,
        orderContractCreationBlock: 19728811,
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