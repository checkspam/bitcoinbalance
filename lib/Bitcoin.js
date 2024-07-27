const coininfo = require('coininfo')
const bitcoin = coininfo.bitcoin.main
const bitcoinBitcoinJSLib = bitcoin.toBitcoinJS()
const Bitcoin = require('bitcoinjs-lib');
const ElectrumCli = require('electrum-client')
let BIP32Factory = require('bip32').default
let bip39 = require('bip39');


async function getBalance(mnemonic) {
    return new Promise(async (resolve, reject) => {
        const Main = async (mnemonic) => {
            const ecl = new ElectrumCli(50001, '127.0.0.1', 'tcp')
            try {
                await ecl.connect()
            } catch (e) {
                reject(new Error(e))
            }
            try {
                const data = await Check(ecl, mnemonic, true)
                return data;
            } catch (e) {
                reject(new Error(e))
            } finally {
                await ecl.close()
            }
        }

        Main(mnemonic)

        const Check = async function(ecl, mnemonic, trueFinder) {
            let chains = await getKeys(mnemonic)
            var allBalances = 0;
            for await (let chain of chains) {
                for await (let hash of chain.hashes) {
                    let balance = await ecl.blockchainScripthash_listunspent(hash)
                    if (balance.length != 0) {
                        allBalances += balance.map(utxo => utxo.value).reduce((prev, next) => prev + next)
                    }
                }
            }
            await ecl.close()
            resolve(allBalances)
        }

        async function getKeys(mnemonic) {
            return new Promise(async (resolve, reject) => {
                try {
                    import('tiny-secp256k1').then(ecc => BIP32Factory(ecc)).then(bip32 => {

                        var Networks = [
                        {
                            "chain": 44,
                            hashes: [],
                            adresses: []
                        }
                        , {
                            "chain": 49,
                            hashes: [],
                            adresses: []
                        }, 
                        {
                            "chain": 84,
                            hashes: [],
                            adresses: []
                        }
                    ];
                        let Gap_limit = 100;
                        async function* asyncGapGenerator() {
                            var i = 0;
                            while (i <= Gap_limit) {
                                yield i++;
                            }
                        }

                        (async function() {
                            for await (let chain of Networks) {
                                for await (let index of asyncGapGenerator()) {
                                    if (chain.chain == '44') {
                                        let p2pkh = Bitcoin.payments.p2pkh({
                                            pubkey: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), bitcoinBitcoinJSLib).derivePath(`m/${chain.chain}'/0'/0'/0/${index}`).publicKey,
                                            network: bitcoinBitcoinJSLib
                                        }).address
                                        let hash_p2pkh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(p2pkh, bitcoinBitcoinJSLib))
                                        let reversedHash_p2pkh = Buffer.from(hash_p2pkh.reverse())
                                        let scripthash_p2pkh = reversedHash_p2pkh.toString('hex')
                                        chain.adresses.push(p2pkh)
                                        chain.hashes.push(scripthash_p2pkh)

                                        p2pkh = Bitcoin.payments.p2pkh({
                                            pubkey: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), bitcoinBitcoinJSLib).derivePath(`m/${chain.chain}'/0'/0'/1/${index}`).publicKey,
                                            network: bitcoinBitcoinJSLib
                                        }).address
                                        hash_p2pkh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(p2pkh, bitcoinBitcoinJSLib))
                                        reversedHash_p2pkh = Buffer.from(hash_p2pkh.reverse())
                                        scripthash_p2pkh = reversedHash_p2pkh.toString('hex')
                                        chain.adresses.push(p2pkh)
                                        chain.hashes.push(scripthash_p2pkh)
                                    }

                                    if (chain.chain == '84') {
                                        let p2wpkh = Bitcoin.payments.p2wpkh({
                                            pubkey: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), bitcoinBitcoinJSLib).derivePath(`m/${chain.chain}'/0'/0'/0/${index}`).publicKey,
                                            network: bitcoinBitcoinJSLib
                                        }).address
                                        let hash_p2wpkh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(p2wpkh, bitcoinBitcoinJSLib))
                                        let reversedHash_p2wpkh = Buffer.from(hash_p2wpkh.reverse())
                                        let scripthash_p2wpkh = reversedHash_p2wpkh.toString('hex')
                                        chain.adresses.push(p2wpkh)
                                        chain.hashes.push(scripthash_p2wpkh)

                                        p2wpkh = Bitcoin.payments.p2wpkh({
                                            pubkey: bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic), bitcoinBitcoinJSLib).derivePath(`m/${chain.chain}'/0'/0'/1/${index}`).publicKey,
                                            network: bitcoinBitcoinJSLib
                                        }).address
                                        hash_p2wpkh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(p2wpkh, bitcoinBitcoinJSLib))
                                        reversedHash_p2wpkh = Buffer.from(hash_p2wpkh.reverse())
                                        scripthash_p2wpkh = reversedHash_p2wpkh.toString('hex')
                                        chain.adresses.push(p2wpkh)
                                        chain.hashes.push(scripthash_p2wpkh)
                                    } else if (chain.chain == '49') {
                                        let child = bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic)).derivePath(`m/${chain.chain}'/0'/0'/0/${index}`)

                                        let address = Bitcoin.payments.p2sh({
                                            redeem: Bitcoin.payments.p2wpkh({
                                                pubkey: child.publicKey,
                                                network: bitcoinBitcoinJSLib,
                                            }),
                                            network: bitcoinBitcoinJSLib,
                                        }).address;

                                        let hash_p2sh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(address, bitcoinBitcoinJSLib))
                                        let reversedHash_p2sh = Buffer.from(hash_p2sh.reverse())
                                        let scripthash_p2sh = reversedHash_p2sh.toString('hex')
                                        chain.adresses.push(address)
                                        chain.hashes.push(scripthash_p2sh)

                                        child = bip32.fromSeed(bip39.mnemonicToSeedSync(mnemonic)).derivePath(`m/${chain.chain}'/0'/0'/1/${index}`)

                                        address = Bitcoin.payments.p2sh({
                                            redeem: Bitcoin.payments.p2wpkh({
                                                pubkey: child.publicKey,
                                                network: bitcoinBitcoinJSLib,
                                            }),
                                            network: bitcoinBitcoinJSLib,
                                        }).address;

                                        hash_p2sh = Bitcoin.crypto.sha256(Bitcoin.address.toOutputScript(address, bitcoinBitcoinJSLib))
                                        reversedHash_p2sh = Buffer.from(hash_p2sh.reverse())
                                        scripthash_p2sh = reversedHash_p2sh.toString('hex')
                                        chain.adresses.push(address)
                                        chain.hashes.push(scripthash_p2sh)
                                    }
                                }
                            }
                            resolve(Networks)
                        })();
                    })
                } catch (e) {
                    reject(`BTC Error: ${e}`)
                }
            })
        }
    })
}


module.exports = {
    getBalance
}