const fetch = require('node-fetch');

const randomInt = (min, max) => Math.floor(min + (Math.random() * (max - min + 1)))
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const POPS = ['AMS', 'SIN', 'NRT', 'CPT', 'DEN', 'LAX'];
const LANGS = ['en', 'de', 'jp', 'fr', 'cn'];

setInterval(async () => {
    const lines = Array(randomInt(1,6)).fill().map(() => (
        `${randomItem(POPS)} ${Date.now()}000 ${randomInt(100, 50000)} ` +
        `${randomInt(0,1)}${randomInt(0,1)}${randomInt(0,1)}${randomInt(0,1)} ` +
        `${randomItem(LANGS)} ${randomInt(10,3000)} ${randomInt(1000000, 9999999)} ${randomInt(500,3000)}`
    ))
    fetch('https://top-of-the-pops.glitch.me/ingest', {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain"
        },
        body: lines.join('\n')
    })
}, 300);