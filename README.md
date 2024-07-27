## Installation

```sh
npm i bitcoinbalance
```
## Example of use

```sh
const BitcoinChecker = require('./Checkers/Bitcoin');
const fs = require('fs/promises');

(async() => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    
    const seeds = await readSeeds();
    console.log(`Started at ${hours}:${minutes}:${seconds}. Seeds: ${seeds.length}`)
    for (seed of seeds){
        let btc_balance = await BitcoinChecker.getBalance(seed);
        if (btc_balance != 0){
            console.log(`${seed} : Balance: ${btc_balance / 1e8 }`);
            try{
                await fs.appendFile("your_path_here", `${seed} : Balance: ${btc_balance / 1e8 }\r\n`, 'utf8');
            }
            catch(e){console.log(e)}
          }
    }
    date_ob = new Date();
    hours = date_ob.getHours();
    minutes = date_ob.getMinutes();
    seconds = date_ob.getSeconds();
    console.log(`Ended at ${hours}:${minutes}:${seconds}`)
})()

async function readSeeds() {
    const data = await fs.readFile("your_seeds_path", 'utf-8')
    return data.split(/\r?\n/)
}
```

For ANY questions (Telegram): @nnnnnnnmmm_x