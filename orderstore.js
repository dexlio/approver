const sqlite3 = require('sqlite3');
var fs = require('fs');

let orderMap = new Map();
let buyDb;
let sellDb;
let blockDb;
let gasDb;

async function init(networkId) {
    buyDb = await connectToDB("order/", "buyOrderDB" + networkId);
    sellDb = await connectToDB("order/", "sellOrderDB" + networkId);
    blockDb = await connectToDB("order/", "blockDB" + networkId);
    gasDb = await connectToDB("order/", "gasDB" + networkId);
    await initOrderTable(true);
    await initOrderTable(false);
    await initBlockTable(blockDb);
    await initGasTable(gasDb);
}

async function connectToDB(path, file) {
    try {
        let dir = "/home/orderstoredb/" + path;
        createDirectory(dir);
        return await new sqlite3.Database(dir + file);
    } catch (e) {
        return null;
    }
}

async function initOrderTable(isBuy) {
    let db = isBuy ? buyDb : sellDb;
    const createSql = 'CREATE TABLE IF NOT EXISTS orderTable (id INTEGER PRIMARY KEY, pair TEXT, taker TEXT,block INTEGER)';
    const indexSql = 'CREATE INDEX block_idx ON orderTable (block);';
    try {
        await db.run(createSql,(err, result) => {
            console.log("table created");
            try {
                db.run(indexSql, (err, result) => {
                    console.log("index created");
                });
            } catch (e) {
                console.log(e);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function initBlockTable(blockDb) {
    const createSql = 'CREATE TABLE IF NOT EXISTS blockTable (id INTEGER PRIMARY KEY,block INTEGER )';
    try {
        await blockDb.run(createSql);
        console.log("block table created");
    } catch (e) {
        console.log(e);
    }
}

async function initGasTable(blockDb) {
    const createSql = 'CREATE TABLE IF NOT EXISTS gasTable (id INTEGER PRIMARY KEY,gas STRING )';
    try {
        await blockDb.run(createSql);
        console.log("block table created");
    } catch (e) {
        console.log(e);
    }
}

function getOrderFromDB(id, isBuy, callback) {
    try {

        let order = orderMap.get(id);
        if (order) {
            callback(order);
        } else {
            let db = isBuy ? buyDb : sellDb;
            let selectQuery = 'SELECT * FROM orderTable where id = ? ';
            db.get(selectQuery, [id], (err, result) => {
                callback(result);
            });
        }
    } catch (e) {
        console.log(e);
    }
}

function getBlockFromDB(callback) {
    try {
        let selectQuery = 'SELECT * FROM blockTable where id = ? ';
        blockDb.get(selectQuery, [0], (err, result) => {
            callback(result);
        });
    } catch (e) {
        console.log(e);
    }
}

function getGasFromDB(callback) {
    try {
        let selectQuery = 'SELECT * FROM gasTable where id = ? ';
        gasDb.get(selectQuery, [0], (err, result) => {
            callback(result);
        });
    } catch (e) {
        console.log(e);
    }
}

async function updateBlockToDB(id, block) {
    try {
        getBlockFromDB(async function (result) {
            if(!result){
                let insertQuery = 'INSERT OR IGNORE INTO blockTable (id,block) VALUES (?,?)';
                await blockDb.run(insertQuery, [id,block]);
            }else{
                let insertQuery = 'UPDATE blockTable SET block = ? WHERE id = ?';
                await blockDb.run(insertQuery, [block,id]);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function updateGasToDB(id, gas) {
    try {
        getGasFromDB(async function (result) {
            if(!result){
                let insertQuery = 'INSERT OR IGNORE INTO gasTable (id,gas) VALUES (?,?)';
                await gasDb.run(insertQuery, [id,gas]);
            }else{
                let insertQuery = 'UPDATE gasTable SET gas = ? WHERE id = ?';
                await gasDb.run(insertQuery, [gas,id]);
            }
        });
    } catch (e) {
        console.log(e);
    }
}


function getAllOrdersFromDB(startBlock, endBlock, isBuy, callback) {
    try {
        let db = isBuy ? buyDb : sellDb;
        let selectQuery = 'SELECT * FROM orderTable where block >= ? and block <= ? ';
        db.all(selectQuery, [startBlock, endBlock], (err, results) => {
            callback(results);
        });
    } catch (e) {
        console.log(e);
    }
}

async function addOrderToDB(id, pair, taker, block, isBuy) {
    try {
        orderMap.set(id, {
            pair: pair,
            taker: taker,
            id: id,
            block: block,
            isBuy: isBuy
        });
        console.log("id : " + id + " pair : " + pair + " taker " + taker, " block : " + block + " is buy ", isBuy);
        let db = isBuy ? buyDb : sellDb;
        let insertQuery = 'INSERT OR IGNORE INTO orderTable (id,pair,taker,block) VALUES (?,?, ?,?)';
        await db.run(insertQuery, [id, pair, taker, block]);
        await updateBlockToDB(0,block);
    } catch (e) {
        console.log(e);
    }
}

async function deleteOrderFromDB(id, isBuy) {
    try {
        orderMap.delete(id);
        let db = isBuy ? buyDb : sellDb;
        let deleteQuery = 'DELETE FROM orderTable where id = ? ';
        await db.run(deleteQuery, [id]);
        console.log("delete order  db " + id);
    } catch (e) {
        console.log(e);
    }
}

let createDirectory = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true});
    }
};

module.exports = {init, addOrderToDB, getOrderFromDB, getAllOrdersFromDB, deleteOrderFromDB,getBlockFromDB,updateBlockToDB,getGasFromDB,updateGasToDB};
