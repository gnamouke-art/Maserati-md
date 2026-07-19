const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
*🤍⃝⃘̉̉̉━⋆─⋆─━─❂🏎️̉❂̉─⋆─⋆━🤍⃝⃘̉̉̉̉̉*
*┊ ┊ ┊ ┊ ┊┊ 
*┊ ┊✫ ˚㋛ ⋆｡ ❀┊ 
*┊ ☠︎︎                               
*✧  broke𓂃✍︎𝄞*

👋 𝐇𝐚𝐥𝐨 𝐊𝐚𝐤 𝐒𝐞𝐥𝐚𝐦𝐚𝐭 𝐌𝐚𝐥𝐚𝐦
┌────[『⚽𝐈𝐧𝐟𝐨🇨🇮𝐁𝐨𝐭⚽』
│ 👤 Owner  🇨🇮: *${settings.botOwner || 'yankeedev'}*
│ 🔖 Version ⚽: *3.0.🏆*
│ 📺 YT      🇨🇮: ${global.ytch}
│ ⚡ Commands⚽: LIST
└───────────>

┌────[『 🌐 𝐆𝐄𝐍𝐄𝐑𝐀𝐋 』
│ ●⎋.help
│ ●⎋.menu
│ ●⎋.ping
│ ●⎋.alive
│ ●⎋.tts
│ ●⎋.owner
│ ●⎋.joke
│ ●⎋.quote
│ ●⎋.fact
│ ●⎋.weather
│ ●⎋.news
│ ●⎋.attp
│ ●⎋.lyrics
│ ●⎋.8ball
│ ●⎋.groupinfo
│ ●⎋.staff
│ ●⎋.vv
│ ●⎋.trt
│ ●⎋.ss
│ ●⎋.jid
│ ●⎋.url
└──────────>

┌────[『👮𝐀𝐃𝐌𝐈𝐍』
│ ✧⎋.ban
│ ✧⎋.kick
│ ✧⎋.warn
│ ✧⎋.promote
│ ✧⎋.demote
│ ✧⎋.mute
│ ✧⎋.unmute
│ ✧⎋.delete
│ ✧⎋.clear
│ ✧⎋.tagall
│ ✧⎋.hidetag
│ ✧⎋.antilink
│ ✧⎋.antibadword
│ ✧⎋.welcome
│ ✧⎋.goodbye
│ ✧⎋.setgname
│ ✧⎋.setgpp
└───────────>

┌────[『🔒𝐎𝐖𝐍𝐄𝐑』
│ ◈⎋.mode
│ ◈⎋.clearsession
│ ◈⎋.cleartmp
│ ◈⎋.update
│ ◈⎋.settings
│ ◈⎋.autostatus
│ ◈⎋.autoread
│ ◈⎋.anticall
│ ◈⎋.pmblocker
│ ◈⎋.setpp
│ ◈⎋.setmention
└───────────>

┌────[『🎨𝐄𝐃𝐈𝐓𝐈𝐍𝐆』
│ 🖋️⎋.sticker
│ 🖋️⎋.simage
│ 🖋️⎋.remini
│ 🖋️⎋.removebg
│ 🖋️⎋.blur
│ 🖋️⎋.crop
│ 🖋️⎋.meme
│ 🖋️⎋.take
│ 🖋️⎋.emojimix
│ 🖋️⎋.igs
│ 🖋️⎋.igsc
└──────────>

┌────[『🤖𝐀𝐈&𝐆𝐀𝐌𝐄𝐒』
│ 🧠⎋.gpt
│ 🧠⎋.gemini
│ 🖼️⎋.imagine
│ 🖼️⎋.flux
│ 🖼️⎋.sora
│ 🎮⎋.tictactoe
│ 🎮⎋.hangman
│ 🎮⎋.trivia
│ 🎮⎋.truth
│ 🎮⎋.dare
└───────────>

┌────[『📥𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑』
│ ↓⎋.play
│ ↓⎋.song
│ ↓⎋.video
│ ↓⎋.spotify
│ ↓⎋.ytmp4
│ ↓⎋.instagram
│ ↓⎋.facebook
│ ↓⎋.tiktok
└───────────>

┌────[『🔤𝐓𝐄𝐗𝐓𝐌𝐀𝐊𝐄𝐑』
│ ✎⎋.neon
│ ✎⎋.glitch
│ ✎⎋.fire
│ ✎⎋.ice
│ ✎⎋.snow
│ ✎⎋.matrix
│ ✎⎋.hacker
│ ✎⎋.devil
│ ✎⎋.sand
└───────────>

┌────[『 💻 𝐒𝐘𝐒𝐓𝐄𝐌 』
│ ⚙️⎋.git
│ ⚙️⎋.github
│ ⚙️⎋.sc
│ ⚙️⎋.repo
│ ⚙️⎋.script
└──────────>

┌────[『💶𝐒𝐩𝐞𝐞𝐝•𝐋𝐮𝐱𝐮𝐫𝐲•𝐏𝐨𝐰𝐞𝐫』
│ 🔱 𝐌𝐚𝐬𝐞𝐫𝐚𝐭𝐢 𝐓𝐫𝐢𝐝𝐞𝐧𝐭 𝐄𝐝𝐢𝐭𝐢𝐨𝐧
└──────────>

*̉🤍⃝⃘̉̉̉━⋆─⋆─❂💶̉❂̉─⋆─⋆━🤍⃝⃘̉̉̉̉̉*
*┊ ┊ ┊ ┊ ┊┊ *
*┊ ┊✫ ˚💵 ⋆｡*
*┊ 🔱    *
*✧  Maserati Trident Edition ✧*
> BY YANKEE TECH
*Join our channel for updates:*`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        const contextInfo = {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363362725194754@newsletter',
                newsletterName: 'MASERATI MD',
                serverMessageId: -1
            }
        };

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo
            });
        }
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
