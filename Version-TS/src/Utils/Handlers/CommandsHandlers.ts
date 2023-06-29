import { readdirSync } from "fs";
import chalk from "chalk";

export default async (client: any) => {   
    const allCommandsPath = process.cwd() + "/src/commands";
    const allCommandsFileName = readdirSync(allCommandsPath);
    
    allCommandsFileName.map((commandFile: string) => {
        const command = require(allCommandsPath + "/" + commandFile);

        if(!command.name || !command.description) {
            return console.log(chalk.red("------\nCommande pas chargée : Pas de description ou de nom\n------"))
        }
        
        client.commands.set(command.name, command);
        console.log(chalk.blue("Commande chargée :", command.name));
    });
}