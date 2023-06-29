import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { get_agenda, transfo_date, date_cours } from "../agenda";
import moment from "moment";
import { BOOLEAN } from "sequelize";
module.exports = {
  name: "planning",
  description: "Commande pour obtenir le planning d'une personne",
  options: [
    {
      name: "name",
      description: "Nom de la personne",
      required: true,
      type: "STRING",
    },
    {
      name: "date",
      description: "Date",
      required: false,
      type: "STRING",
    },
  ],
  runSlash: async (client: Client, interaction: CommandInteraction) => {
    let NOM = interaction.options.getString("name") as string;
    let DATE = interaction.options.getString("date") ?? "";
    NOM=NOM.toLowerCase()
    if (!interaction.channel || interaction.channelId !== process.env.BOT_PLANNING_CHANNEL) {
        return interaction.reply({
          content: "Vous ne pouvez pas utiliser cette commande dans ce salon !",
          ephemeral: true,
        });
      }
    console.log(NOM);

    // Check presence of information
    if (NOM!== "corentin") {
      if (NOM !== "maxime" ) {
        if (NOM !== "kevin") {
          return interaction.reply({
            content: "Vous devez entrer le nom d'une personne !",
            ephemeral: true,
      });}}
    } 

    let url;
    if (NOM === "maxime") {
      url = process.env.MAXIME;
    } else if (NOM === "corentin") {
      url = process.env.CORENTIN;
    } else if (NOM === "kevin") {
      url = process.env.KEVIN;
    } else {
      const message = "Syntaxe invalide. Le prénom est incorrecte";
      return interaction.reply({ content: message, ephemeral: true });
    }
    console.log(url);
    if (!url) {
        const message = "URL non définie";
        return interaction.reply({ content: message, ephemeral: true });
      }
    const cal= await get_agenda(url);
    DATE = transfo_date(DATE);
    //2023-04-21 
    console.log(DATE);
    // Regarde si la date donnée existe
  
    const liste_cours = date_cours(cal, DATE);
    
    
    // Mise en forme de l'affichage
   
    if (liste_cours.length === 0) {
      let message = `${NOM} n'a pas de cours le ${DATE} 🎉`;
      console.log(message)
      return interaction.reply({ content: message, ephemeral: true });
     

    }
    
    const affichage = new MessageEmbed()
    affichage.setTitle(`Cours de ${NOM}`)
    affichage.setDescription(`__Voici vos cours du ${DATE} :__\n`)
    affichage.setColor(0x00BFFF);

    for (const cours of liste_cours) {
      const { nom_cours, salle, start, end } = cours;
      const debut = moment(start, "HH:mm").format("HH:mm");
      const fin = moment(end, "HH:mm").format("HH:mm");

      affichage.addFields(
        { name: nom_cours, value: salle, inline: true },
        { name: "Horaires", value: `${debut} / ${fin}`, inline: true },
        { name: "\u200B", value: "\u200B", inline: false }
      );
    }
    
    affichage.setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() ?? undefined,
    });

    affichage.setThumbnail(
      "https://www.efrei.fr/wp-content/uploads/2022/01/LOGO_EFREI-PRINT_EFREI-WEB.png"
    );
    console.log(liste_cours.length);
    affichage.setFooter({ text: `Vous avez un total de ${liste_cours.length} cours aujourd'hui` });
   
    await interaction.reply({ embeds: [affichage], ephemeral: false });
    },
};