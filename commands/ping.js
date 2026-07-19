
const os = require('os');
const settings = require('../settings.js');

function formatTime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();

        const uptime = formatTime(process.uptime());
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);

        const end = Date.now();
        const speed = end - start;

        const response = `
*🤍⃝⃘̉̉̉━⋆─⋆─━──❂🏎️̉❂̉─⋆─⋆━🤍⃝⃘̉̉̉̉̉*
*┊ ┊ ┊ ┊ ┊┊ ┊ ┊ ┊ ┊┊ ┊┊ ┊*
*┊ ┊✫ ˚㋛ ⋆｡ ❀┊ ┊✫ ˚㋛ ⋆｡ ❀┊ ┊*
*┊ ☠︎︎                                 ┊*
*✧  broke𓂃✍︎𝄞*

╔══════════✠═════════╗
║  ⚡ 𝐌𝐀𝐒𝐄𝐑𝐀𝐓𝐈 𝐒𝐓𝐀𝐓𝐔𝐒 ⚡
╠══════════✠═════════╣
║ 🏓 𝐒𝐩𝐞𝐞𝐝     : ${speed} ms
║ ⏳ 𝐔𝐩𝐭𝐢𝐦𝐞    : ${speed} ms
║ 🧠 𝐑𝐀𝐌        : ${freeMem}MB / ${totalMem}MB
║ 💻 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦  : ${os.platform()}
║ 🔖 𝐕𝐞𝐫𝐬𝐢𝐨𝐧   : v${settings.version}
╚════════════════════╝

*🤍⃝⃘̉̉̉━⋆─⋆─━──❂💶̉❂̉─⋆─⋆━🤍⃝⃘̉̉̉̉̉*
*┊ ┊ ┊ ┊ ┊┊ ┊ ┊ ┊ ┊┊ ┊┊ ┊*
*┊ ┊✫ ˚💵 ⋆｡ 💶┊ ┊✫ ˚💶 ⋆｡ 💵┊ ┊*
*┊ 🔱                    🔱 ┊*
*✧  Maserati Trident Edition ✧*
`.trim();

        await sock.sendMessage(chatId, {
            text: response
        }, { quoted: message });

    } catch (err) {
        console.error(err);
        await sock.sendMessage(chatId, {
            text: '❌ Error while checking bot status.'
        }, { quoted: message });
    }
}

module.exports = pingCommand;
