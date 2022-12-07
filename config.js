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
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        swapAddress:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
        orderAddress: "0xB49359d936aa464f3C25cA5D86d2EedA9FfF6d47",
        wETHAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        approverAddress: "0x4F83C5F3b9853bfbbeBC997d9982ab7677032A5c",
        infoAddress: "0x6386A35FC1ceec502564766a9F26E7b9A6139a85",
        usdAddress:"0xe9e7cea3dedca5984780bafc599bd69add087d56",
        scanAddress:"https://bscscan.com/",
        nodeAddress: "https://rpc.ankr.com/bsc",
        transactionAddress:"https://bsc-dataseed.binance.org/",
        swapSite:"https://pancakeswap.finance/swap?outputCurrency=",
        swapAMMs:[
            {
                name:"PancakeSwapV2",
                address:"0x10ed43c718714eb63d5aa57b78b54704e256024e",
                site:"https://pancakeswap.finance/swap?outputCurrency=",
                factory: "0xca143ce32fe78f1f7019d7d551a6402fc5350c73",
                logo:"https://raw.githubusercontent.com/trustwallet/assets/master/dapps/exchange.pancakeswap.finance.png"
            },{
                name:"ApeSwap",
                address:"0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7",
                site:"https://apeswap.finance/swap?outputCurrency=",
                factory: "0x0841bd0b734e4f5853f0dd8d7ea041c241fb0da6",
                logo:"https://raw.githubusercontent.com/trustwallet/assets/master/dapps/apeswap.finance.png"
            },
            {
                name:"BiSwap",
                address:"0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8",
                site:"https://exchange.biswap.org/swap?outputCurrency=",
                factory: "0x858e3312ed3a876947ea49d572a7c42de08af7ee",
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
        gasPrice: 30000000000,
        gasCountPrice: 6000000000,
        gasLimit: 500000,
        approveLimit: 500000,
        usdSymbol: "USDT",
        blockInterval: 2,
        minOrderValue:1,
        dynamicGas:true,
        orderContractCreationBlock:34492514,
        orderBlockScanInterval : 10000,
        priorityGasPrice : 0,
        logo:"https://dexhub.ml/blockchains/polygon/info/logo.png",
        orderAddress: "0xE0004183c30B632648Ec09A46E67a0d34D7F951D",
        approverAddress: "0xEBB3942AFd11418fD6f08F217D14860B023648c1",
        infoAddress: "0xB6F12A81c7E5F0C50955A4ba7875806806590363",
        wETHAddress: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
        usdAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        scanAddress: "https://polygonscan.com/",
        scanName: "Polygonscan",
        nodeAddress: "https://polygon-mainnet.g.alchemy.com/v2/S-VxBpDs46S1TiG3dnXJaKMMmlOpPkxd",
        transactionAddress: "https://polygon-rpc.com/",
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
        orderContractCreationBlock: 23187843,
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png",
        orderAddress: "0xa451cc89fa392a8f21f97867b3eb80d2fc6c5e72",
        approverAddress: "0xE7abB1181A8b602dCDd92dC0deF2394Dd010b74B",
        infoAddress: "0x0918D95619Aeea62e4Fa6eE5D299027E159c896A",
        wETHAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
        usdAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
        scanAddress: "https://snowtrace.io/",
        scanName: "Snowtrace",
        nodeAddress: "https://api.avax.network/ext/bc/C/rpc",
        transactionAddress: "https://api.avax.network/ext/bc/C/rpc",
        logoPath: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/assets/",
        swapAMMs:[
            {
                name:"TraderJoe",
                address:"0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
                factory:"0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
                site:"https://traderjoexyz.com/trade?outputCurrency=",
                logo:"https://traderjoexyz.com/static/media/logo.bc60f78d.png"
            }, {
                name:"Pangolinswap",
                address:"0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106",
                factory: "0xefa94DE7a4656D787667C749f7E1223D71E9FD88",
                site:"https://app.pangolin.exchange/swap?outputCurrency=",
                logo:"https://app.pangolin.exchange/static/media/icon.adcff230.svg"
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
            },  {
                symbol:'USDT',
                address:'0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
                decimal:6
            }, {
                symbol:'WAVAX',
                address:'0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
                decimal:18
            }
        ]
    },
    {
        id: "1",
        name: "Ethereum",
        symbol: "ETH",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 5000000000,
        gasCountPrice: 1000000000,
        gasLimit: 500000,
        approveLimit: 100000,
        usdSymbol: "USDC",
        blockInterval: 12,
        minOrderValue: 0.0001,
        dynamicGas: true,
        enabled: true,
        priorityGasPrice : 1000000000,
        orderContractCreationTime :1667208610,
        orderContractCreationBlock: 15866204,
        orderBlockScanInterval : 2048,
        logo: "https://dexhub.ml/blockchains/ethereum/info/logo.png",
        orderAddress: "0x3026e7e68b52b037fd68a822e8db4271fa206ce6",
        infoAddress: "0xc2b4286014e021dA15eB129f887CE7C2D5B270c9",
        approverAddress: "0x5C625F845A52bCEA092178a9cb99a99e5B35631a",
        wETHAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        usdAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        scanAddress: "https://etherscan.io/",
        scanName: "Etherscan",
        bridge:"https://app.multichain.org/",
        nodeAddress: "https://eth-mainnet.g.alchemy.com/v2/qSZ1eqRxV_-mXQOEQ3Q3vODf0kTrYG8u",
        transactionAddress: "https://mainnet.infura.io/v3/ebac9b5985b549d0a04930c0e0e69da4",
        logoPath: "https://dexhub.ml/blockchains/ethereum/assets/",
        swapAMMs: [
            {
                name: "UniswapV2",
                address: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
                factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
                site: "https://app.uniswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/uniswap.exchange.png",
                isV3: false,
                poolFee: 30
            },
            {
                name: "UniswapV3",
                address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                factory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
                site: "https://app.uniswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/uniswapv3.exchange.png",
                isV3: true
            },{
                name: "Sushiswap",
                address: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
                factory: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
                site: "https://www.sushi.com/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/sushiswap.exchange.png",
                isV3: false,
                poolFee: 30
            }
        ],
        pairList: [
            {
                symbol: 'ETH',
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                decimal: 18
            }, {
                symbol: 'USDC',
                address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
                decimal: 6
            }, {
                symbol: 'USDT',
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                decimal: 6
            }, {
                symbol: 'DAI',
                address: '0x6b175474e89094c44da98b954eedeac495271d0f',
                decimal: 18
            }, {
                symbol: 'WETH',
                address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
                decimal: 18
            }
        ]
    },
    {
        id: "42161",
        name: "Arbitrum",
        symbol: "ETH",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 100000000,
        gasCountPrice: 10000000,
        gasLimit: 1500000,
        approveLimit: 300000,
        usdSymbol: "USDC",
        blockInterval: 2,
        minOrderValue: 0.00005,
        dynamicGas: false,
        enabled: true,
        fixedGas:true,
        orderContractCreationTime :1667564250,
        orderContractCreationBlock: 35189739,
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        logo: "https://dexhub.ml/blockchains/arbitrum/info/logo.png",
        orderAddress: "0xE725F84405a4e7d19C396d4C5fc6491FcF85C479",
        infoAddress: "0x5c625f845a52bcea092178a9cb99a99e5b35631a",
        approverAddress: "0xE54906aA8A6B79717055bF996181c8BcbCB9768c",
        wETHAddress: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
        usdAddress: "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
        scanAddress: "https://arbiscan.io/",
        scanName: "Arbiscan",
        bridge:"https://bridge.arbitrum.io/",
        nodeAddress: "https://arb1.arbitrum.io/rpc",
        transactionAddress: "https://arb1.arbitrum.io/rpc",
        logoPath: "https://dexhub.ml/blockchains/arbitrum/assets/",
        swapAMMs: [
            {
                name: "Sushiswap",
                address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
                factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                site: "https://www.sushi.com/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/sushiswap.exchange.png",
                isV3: false,
                poolFee: 30
            },
            {
                name: "UniswapV3",
                address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                factory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
                site: "https://app.uniswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/uniswapv3.exchange.png",
                isV3: true
            }
        ],
        pairList: [
            {
                symbol: 'ETH',
                address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
                decimal: 18
            }, {
                symbol: 'USDC',
                address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
                decimal: 6
            }, {
                symbol: 'USDT',
                address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                decimal: 6
            }, {
                symbol: 'DAI',
                address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
                decimal: 18
            }, {
                symbol: 'WETH',
                address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
                decimal: 18
            }
        ]
    },
    {
        id: "10",
        name: "Optimism",
        symbol: "ETH",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 1000000,
        gasCountPrice: 1000000,
        gasLimit: 150000000,
        approveLimit: 200000,
        usdSymbol: "USDC",
        blockInterval: 0.4,
        minOrderValue: 0.0001,
        enabled: false,
        trEnabled: false,
        fixedGas:true,
        gasPriceNotNeed: true,
        orderContractCreationTime :1669180815,
        orderContractCreationBlock: 41151903,
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        logo: "https://dexhub.ml/blockchains/optimism/info/logo.png",
        orderAddress: "0xBD64EF7995e4A5B75c2867DD305BE5936e7C6a04",
        infoAddress: "0x5c625f845a52bcea092178a9cb99a99e5b35631a",
        approverAddress: "0xE54906aA8A6B79717055bF996181c8BcbCB9768c",
        wETHAddress: "0x4200000000000000000000000000000000000006",
        usdAddress: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
        scanAddress: "https://optimistic.etherscan.io/",
        scanName: "Optimisticscan",
        bridge:"https://app.optimism.io/bridge",
        nodeAddress: "https://rpc.ankr.com/optimism",
        transactionAddress: "https://mainnet.optimism.io/",
        logoPath: "https://dexhub.ml/blockchains/optimism/assets/",
        swapAMMs: [
            {
                name: "UniswapV3",
                address: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                factory: "0x1f98431c8ad98523631ae4a59f267346ea31f984",
                site: "https://app.uniswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/uniswapv3.exchange.png",
                isV3: true
            }
        ],
        pairList: [
            {
                symbol: 'ETH',
                address: '0x4200000000000000000000000000000000000006',
                decimal: 18
            }, {
                symbol: 'USDC',
                address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
                decimal: 6
            }, {
                symbol: 'USDT',
                address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
                decimal: 6
            }, {
                symbol: 'DAI',
                address: '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
                decimal: 18
            }, {
                symbol: 'WETH',
                address: '0x4200000000000000000000000000000000000006',
                decimal: 18
            }
        ]
    },
    {
        id: "250",
        name: "Fantom",
        symbol: "FTM",
        decimal: 18,
        usdDecimal: 6,
        gasPrice: 100000000000,
        gasCountPrice: 20000000000,
        gasLimit: 500000,
        approveLimit: 100000,
        usdSymbol: "USDC",
        blockInterval: 3,
        minOrderValue: 1,
        dynamicGas: true,
        enabled: true,
        orderContractCreationTime :1668012304,
        orderContractCreationBlock: 50748407,
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        logo: "https://dexhub.ml/blockchains/fantom/info/logo.png",
        orderAddress: "0x5C625F845A52bCEA092178a9cb99a99e5B35631a",
        infoAddress: "0xc2b4286014e021dA15eB129f887CE7C2D5B270c9",
        approverAddress: "0xE54906aA8A6B79717055bF996181c8BcbCB9768c",
        wETHAddress: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
        usdAddress: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
        scanAddress: "https://ftmscan.com/",
        scanName: "Ftmscan",
        bridge:"https://app.multichain.org/",
        nodeAddress: "https://rpc.ankr.com/fantom",
        transactionAddress: "https://rpcapi.fantom.network/",
        logoPath: "https://dexhub.ml/blockchains/fantom/assets/",
        swapAMMs: [
            {
                name: "SpookySwap",
                address: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
                factory: "0x152ee697f2e276fa89e96742e9bb9ab1f2e61be3",
                site: "https://spooky.fi/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/spooky.exchange.png",
                isV3: false,
                poolFee: 30
            },{
                name: "Sushiswap",
                address: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
                factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                site: "https://www.sushi.com/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/sushiswap.exchange.png",
                isV3: false,
                poolFee: 30
            }
        ],
        pairList: [
            {
                symbol: 'FTM',
                address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                decimal: 18
            }, {
                symbol: 'USDC',
                address: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                decimal: 6
            }, {
                symbol: 'DAI',
                address: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
                decimal: 18
            }, {
                symbol: 'WFTM',
                address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                decimal: 18
            }
        ]
    },
    {
        id: "42220",
        name: "Celo",
        symbol: "CELO",
        decimal: 18,
        usdDecimal: 18,
        gasPrice: 100000000,
        gasCountPrice: 10000000,
        gasLimit: 500000,
        approveLimit: 100000,
        usdSymbol: "CUSD",
        blockInterval: 2,
        minOrderValue: 1,
        dynamicGas: true,
        enabled: true,
        orderContractCreationTime :1668012304,
        orderContractCreationBlock: 16549473,
        orderBlockScanInterval : 2048,
        priorityGasPrice : 0,
        logo: "https://dexhub.ml/blockchains/celo/info/logo.png",
        orderAddress: "0xaa9c5fB4e47C9f0CC96492Db6d4975348b7F86d2",
        infoAddress: "0xc2b4286014e021dA15eB129f887CE7C2D5B270c9",
        approverAddress: "0xE54906aA8A6B79717055bF996181c8BcbCB9768c",
        wETHAddress: "0x471ece3750da237f93b8e339c536989b8978a438",
        usdAddress: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
        scanAddress: "https://celoscan.io",
        scanName: "Celoscan",
        bridge:"https://app.allbridge.io/",
        nodeAddress: "https://forno.celo.org",
        transactionAddress: "https://forno.celo.org",
        logoPath: "https://dexhub.ml/blockchains/celo/assets/",
        swapAMMs: [
            {
                name: "Ubeswap",
                address: "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121",
                factory: "0x62d5b84be28a183abb507e125b384122d2c25fae",
                site: "https://app.ubeswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/ubeswap.exchange.png",
                isV3: false,
                poolFee: 30
            },{
                name: "UniswapV3",
                address: "0x5615CDAb10dc425a742d643d949a7F474C01abc4",
                factory: "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc",
                site: "https://app.uniswap.org/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/uniswapv3.exchange.png",
                isV3: true
            },{
                name: "Sushiswap",
                address: "0x1421bDe4B10e8dd459b3BCb598810B1337D56842",
                factory: "0xc35dadb65012ec5796536bd9864ed8773abc74c4",
                site: "https://www.sushi.com/#/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/sushiswap.exchange.png",
                isV3: false,
                poolFee: 30
            }
        ],
        pairList: [
            {
                symbol: 'CELO',
                address: '0x471ece3750da237f93b8e339c536989b8978a438',
                decimal: 18,
                notMain:true
            }, {
                symbol: 'CUSD',
                address: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
                decimal: 18,
                alternative: 2
            },{
                symbol: 'MCUSD',
                address: '0x918146359264c492bd6934071c6bd31c854edbc3',
                decimal: 18,
                alternative: 1
            }
        ]
    },
    {
        id: "1284",
        name: "MoonBeam",
        symbol: "GLMR",
        decimal: 18,
        usdDecimal: 18,
        gasPrice: 125000000000,
        gasCountPrice: 25000000000,
        gasLimit: 500000,
        approveLimit: 100000,
        usdSymbol: "USDC",
        blockInterval: 2,
        minOrderValue: 1,
        dynamicGas: false,
        enabled: true,
        orderDisabled:false,
        orderContractCreationTime :1669872072,
        orderContractCreationBlock: 2414997,
        orderBlockScanInterval : 2048,
        logo: "https://dexhub.ml/blockchains/moonbeam/info/logo.png",
        orderAddress: "0xc2b4286014e021dA15eB129f887CE7C2D5B270c9",
        infoAddress: "0x5C625F845A52bCEA092178a9cb99a99e5B35631a",
        approverAddress: "0xE54906aA8A6B79717055bF996181c8BcbCB9768c",
        wETHAddress: "0xacc15dc74880c9944775448304b263d191c6077f",
        usdAddress: "0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b",
        scanAddress: "https://moonscan.io",
        scanName: "Moonscan",
        bridge:"https://app.stellaswap.com/bridge",
        nodeAddress: "https://rpc.api.moonbeam.network",
        transactionAddress: "https://rpc.api.moonbeam.network",
        logoPath: "https://dexhub.ml/blockchains/moonbeam/assets/",
        swapAMMs: [
            {
                name: "StellaSwap",
                address: "0x70085a09D30D6f8C4ecF6eE10120d1847383BB57",
                factory: "0x68a384d826d3678f78bb9fb1533c7e9577dacc0e",
                site: "https://app.stellaswap.com/exchange/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/stellaswap.exchange.png",
                isV3: false,
                poolFee: 30
            },{
                name: "BeamSwap",
                address: "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7",
                factory: "0x985bca32293a7a496300a48081947321177a86fd",
                site: "https://app.beamswap.io/exchange/swap?outputCurrency=",
                logo: "https://dexhub.ml/dapps/beamswap.exchange.png",
                isV3: false,
                poolFee: 30
            },

        ],
        pairList: [
            {
                symbol: 'GLMR',
                address: '0xacc15dc74880c9944775448304b263d191c6077f',
                decimal: 18,
            }, {
                symbol: 'USDC',
                address: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
                decimal: 6,
            },{
                symbol: 'USDT',
                address: '0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73',
                decimal: 6,
            },{
                symbol: 'DAI',
                address: '0x765277eebeca2e31912c9946eae1021199b39c61',
                decimal: 18,
            },{
                symbol: 'WGLMR',
                address: '0xacc15dc74880c9944775448304b263d191c6077f',
                decimal: 18,
            }
        ]
    }
];