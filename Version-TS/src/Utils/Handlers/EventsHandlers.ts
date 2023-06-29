import { Client } from "discord.js";
import { readdirSync } from "fs";
import chalk from "chalk";

export default async (client: Client) => {   
    const allEventsPath = process.cwd() + "/src/events";
    const allEventsFileName = readdirSync(allEventsPath);
    allEventsFileName.map((eventFile: string) => {
        const event = require(allEventsPath + "/" + eventFile);
        
        if (!eventList.includes(event.name)|| !event.name){
            return console.log(`-----\Evenement non-déclenché \nFichier -> ${eventFile}\n-----`)
        }

        console.log(chalk.green("Événement chargé : " + event.name));
        
        if(event.once) client.once(event.name, (...args: any) => event.execute(client, ...args)); // si once=True on lance le programme qui est dans .execute
        else client.on(event.name, (...args: any) => event.execute(client, ...args));
    })
}




const eventList = ['apiRequest', 'apiResponse', 'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate', 'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete', 'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate', 'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate', 'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd', 'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interaction', 'interactionCreate', 'invalidated', 'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'message', 'messageCreate', 'messageDelete', 'messageDeleteBulk', 'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate', 'presenceUpdate', 'rateLimit', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError', 'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate', 'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate', 'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate'];