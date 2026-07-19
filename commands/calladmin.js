const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["image", "video", "audio", "document"];

module.exports = {
    config: {
        name: "calladmin",
        version: "3.0.9",
        author: "Yankee",
        countDown: 5,
        role: 0,
        description: "📨 Envoyez vos rapports, suggestions ou bugs directement aux administrateurs du bot",
        category: "contact admin",
        guide: "📌 Usage : .calladmin <votre message>"
    },

    langs: {
        fr: {
            missingMessage: "❌ Veuillez écrire le message que vous souhaitez envoyer aux admins !",
            sendByGroup: "\n- Envoyé depuis le groupe : %1\n- ID du groupe : %2",
            sendByUser: "\n- Envoyé par l'utilisateur",
            content: "\n\n💬 Contenu du message :\n────────────────────────────\n%1\n────────────────────────────\n💡 Répondez à ce message pour envoyer un retour à l'utilisateur",
            success: "✅ Votre message a été envoyé avec succès à %1 admin(s) !\n%2",
            failed: "❌ Une erreur est survenue lors de l'envoi à %1 admin(s)\n%2\n📌 Vérifiez la console pour plus de détails",
            reply: "📍 Réponse de l'admin %1 :\n────────────────────────────\n%2\n────────────────────────────\n💡 Répondez à ce message pour continuer la discussion avec l'admin",
            replySuccess: "✅ Votre réponse a été envoyée avec succès à l'admin !",
            feedback: "📝 Feedback de l'utilisateur %1 :\n- ID WhatsApp : %2%3\n\n💬 Contenu :\n────────────────────────────\n%4\n────────────────────────────\n💡 Répondez à ce message pour envoyer votre retour à l'utilisateur",
            replyUserSuccess: "✅ Votre réponse a été envoyée avec succès à l'utilisateur !",
            noAdmin: "⚠️ Actuellement, aucun administrateur n'est disponible.",
            notAdmin: "❌ Seuls les administrateurs peuvent utiliser cette commande en privé.",
            botInfo: "\n\n†✨🔰🔱MASERATI🤖🏎️BOT🔱🔰✨†\nVersion: 3.0.9"
        },
        en: {
            missingMessage: "❌ Please enter the message you want to send to admin!",
            sendByGroup: "\n- Sent from group: %1\n- Group ID: %2",
            sendByUser: "\n- Sent from user",
            content: "\n\n💬 Message content:\n────────────────────────────\n%1\n────────────────────────────\n💡 Reply to this message to send feedback to the user",
            success: "✅ Your message has been successfully sent to %1 admin(s)!\n%2",
            failed: "❌ An error occurred while sending your message to %1 admin(s)\n%2\n📌 Check console for details",
            reply: "📍 Reply from admin %1:\n────────────────────────────\n%2\n────────────────────────────\n💡 Reply to this message to continue chatting with admin",
            replySuccess: "✅ Your reply has been successfully sent to admin!",
            feedback: "📝 Feedback from user %1:\n- WhatsApp ID: %2%3\n\n💬 Content:\n────────────────────────────\n%4\n────────────────────────────\n💡 Reply to this message to send feedback to user",
            replyUserSuccess: "✅ Your reply has been successfully sent to user!",
            noAdmin: "⚠️ No admin is available at the moment.",
            notAdmin: "❌ Only administrators can use this command in private.",
            botInfo: "\n\n†✨🔰🔱MASERATI🤖🏎️BOT🔱🔰✨†\nVersion: 3.0.9"
        }
    },

    onStart: async function ({ args, message, event, usersData, api, commandName, getLang }) {
        // Charger les settings du bot
        const settings = require('./settings'); // Adaptez le chemin selon votre structure
        
        if (!args[0]) return message.reply(getLang("missingMessage"));

        const { senderID, threadID, isGroup } = event;
        
        // Récupérer le numéro de l'owner depuis settings
        const ownerNumber = settings.ownerNumber;
        
        if (!ownerNumber) return message.reply(getLang("noAdmin"));

        const senderName = await usersData.getName(senderID);
        const botName = settings.botName || "MASERATI BOT";
        const botOwner = settings.botOwner || "Yankee";

        // Construire l'en-tête du message avec le style MASERATI
        let msgHeader = `==📨️ ${botName} - APPEL ADMIN 📨️==`
            + `\n- Bot Owner : ${botOwner}`
            + `\n- Nom de l'utilisateur : ${senderName}`
            + `\n- ID WhatsApp : ${senderID}`;

        if (isGroup) {
            const threadData = await api.getThreadInfo(threadID);
            msgHeader += getLang("sendByGroup", threadData.subject || "Groupe sans nom", threadID);
        } else {
            msgHeader += getLang("sendByUser");
        }

        // Ajouter le message de l'utilisateur
        const userMessage = args.join(" ");
        
        // Préparer le message pour l'admin
        const formMessage = {
            body: msgHeader + getLang("content", userMessage) + getLang("botInfo"),
            mentions: [{
                id: senderID,
                tag: senderName
            }]
        };

        // Gérer les pièces jointes
        const allAttachments = [...event.attachments, ...(event.messageReply?.attachments || [])];
        const validAttachments = allAttachments.filter(item => mediaTypes.includes(item.type));
        
        if (validAttachments.length > 0) {
            formMessage.attachment = await getStreamsFromAttachment(validAttachments);
        }

        try {
            // Envoyer le message à l'owner via WhatsApp privé
            const messageSend = await api.sendMessage(formMessage, ownerNumber);
            
            // Configurer le système de réponse
            global.GoatBot.onReply.set(messageSend.messageID, {
                commandName,
                messageID: messageSend.messageID,
                threadID,
                messageIDSender: event.messageID,
                ownerNumber: ownerNumber,
                userJid: senderID,
                userName: senderName,
                type: "userCallAdmin"
            });
            
            // Message de succès pour l'utilisateur
            const successMsg = getLang("success", "1", ` @${ownerNumber}`) + 
                             `\n📱 Bot: ${botName}\n👤 Owner: ${botOwner}`;
            
            return message.reply({
                body: successMsg,
                mentions: [{ id: ownerNumber, tag: ownerNumber }]
            });
            
        } catch (err) {
            log.error("CALL ADMIN", `Erreur d'envoi à l'owner ${ownerNumber}:`, err);
            return message.reply(getLang("failed", "1", ` @${ownerNumber}\nErreur: ${err.message}`));
        }
    },

    onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
        const { type, threadID, messageIDSender, ownerNumber, userJid, userName } = Reply;
        const senderName = await usersData.getName(event.senderID);
        const { isGroup } = event;
        const settings = require('./settings'); // Recharger les settings

        switch (type) {
            case "userCallAdmin": {
                // L'owner répond à l'utilisateur
                const replyMessage = {
                    body: getLang("reply", senderName, args.join(" ")) + 
                          `\n\n†✨🔰🔱MASERATI🤖🏎️BOT🔱🔰✨†\nVersion: ${settings.version}`,
                    mentions: [{ id: event.senderID, tag: senderName }]
                };

                // Ajouter les pièces jointes si présentes
                const attachments = event.attachments.filter(item => mediaTypes.includes(item.type));
                if (attachments.length > 0) {
                    replyMessage.attachment = await getStreamsFromAttachment(attachments);
                }

                // Envoyer la réponse à l'utilisateur en privé
                api.sendMessage(replyMessage, userJid, (err, info) => {
                    if (err) {
                        log.error("CALL ADMIN", "Erreur envoi réponse à l'utilisateur:", err);
                        return message.reply("❌ Erreur lors de l'envoi de votre réponse");
                    }
                    
                    message.reply(getLang("replyUserSuccess"));
                    
                    // Configurer pour une éventuelle réponse de l'utilisateur
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName,
                        messageID: info.messageID,
                        messageIDSender: event.messageID,
                        threadID: event.threadID,
                        ownerNumber: ownerNumber,
                        userJid: userJid,
                        userName: userName,
                        type: "adminReply"
                    });
                });
                break;
            }

            case "adminReply": {
                // L'utilisateur répond à l'owner
                let sendByGroup = "";
                if (isGroup) {
                    const threadInfo = await api.getThreadInfo(event.threadID);
                    sendByGroup = getLang("sendByGroup", threadInfo.subject || "Groupe", event.threadID);
                }

                const feedbackMessage = {
                    body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")) +
                          `\n\n📱 ${settings.botName}\n👤 Owner: ${settings.botOwner}`,
                    mentions: [{ id: event.senderID, tag: senderName }]
                };

                // Ajouter les pièces jointes
                const attachments = event.attachments.filter(item => mediaTypes.includes(item.type));
                if (attachments.length > 0) {
                    feedbackMessage.attachment = await getStreamsFromAttachment(attachments);
                }

                // Envoyer la réponse à l'owner en privé
                api.sendMessage(feedbackMessage, ownerNumber, (err, info) => {
                    if (err) {
                        log.error("CALL ADMIN", "Erreur envoi réponse à l'owner:", err);
                        return message.reply("❌ Erreur lors de l'envoi de votre réponse");
                    }
                    
                    message.reply(getLang("replySuccess"));
                    
                    // Configurer pour la prochaine réponse
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName,
                        messageID: info.messageID,
                        messageIDSender: event.messageID,
                        threadID: event.threadID,
                        ownerNumber: ownerNumber,
                        userJid: userJid,
                        userName: userName,
                        type: "userCallAdmin"
                    });
                });
                break;
            }

            default:
                break;
        }
    },

    // Fonction utilitaire pour vérifier si l'utilisateur est l'owner
    isOwner: function(userId) {
        const settings = require('./settings');
        const ownerNumber = settings.ownerNumber.replace(/\D/g, '');
        const cleanUserId = userId.replace(/\D/g, '');
        return cleanUserId === ownerNumber;
    }
};