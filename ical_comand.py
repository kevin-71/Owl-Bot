#Mofification commands #3

#Crée le 20/01/2023 @Corentin_Kervagoret/Kevin_Jabiol/Maxime_Roho
# Bot qui permet d'afficher le planinng d'une personne grâce à une commande
#Mofification commands
import discord
from pypresence import Presence
import requests
import icalendar
import datetime
import pytz

from discord.ext import commands
#pip install py-cord
#pip install -U discord-py-interactions

client = commands.Bot()


#https://docs.python.org/fr/3/library/datetime.html###########################################


#Corentin https://www.myefrei.fr/api/public/student/planning/oAQtG1Rd7JQhO_GETSaF7w
#KEVIN https://www.myefrei.fr/api/public/student/planning/yAvRXlcfkHyKI9wOxigssw
#MAXIME https://www.myefrei.fr/api/public/student/planning/wg-Wzwjdw6-Fg8kp5cr5ww


def get_agenda(url): # import l'agenda
    r = requests.get(url)
    cal = icalendar.Calendar.from_ical(r.content)
    return cal

def get_current_event(calendar): #Transforme le calandrier
    #current_utc = pytz.UTC.localize(datetime.datetime.utcnow()) heure actuel
    events = []
    for event in calendar.walk():
        if event.name == "VEVENT":
            start = event.get("dtstart").dt + datetime.timedelta(hours=1)
            end = event.get("dtend").dt + datetime.timedelta(hours=1)
            summary = event.get("summary")
            location = event.get("location")
            description = event.get("description")
            events.append(
                {"start": start, "end": end, "nom_cours": summary, "salle": location, "nom_prof": description})
    return events

def date_cours(cal,DATE):
    event=get_current_event(cal)
    DATE=datetime.date.fromisoformat(DATE) #transforme la date donne en datetime.datetime 
    position_cours=[]
    i=0
    while DATE>=datetime.datetime.date(event[i]["start"]):
        if datetime.datetime.date(event[i]["start"])==DATE: # compare  la date du calandrier et la date donée
            position_cours.append(i)
        i+=1

    #Affiche les cours de la date
    for cours in position_cours:
        print(event[cours]["nom_cours"])
        print(event[cours]["salle"])
        print(event[cours]["start"])
        print("Début du cours: {} Fin du cours: {}".format(event[cours]["start"].time(),event[cours]["end"].time())) #Recupere que l'heure
    
    liste_cours = []
    for cours in position_cours:
        liste_cours.append(str(event[cours]["nom_cours"]))
        liste_cours.append(str(event[cours]["salle"]))
        liste_cours.append(event[cours]["start"].time())
        liste_cours.append(event[cours]["end"].time())
    print(liste_cours)

    return liste_cours

@client.event 
async def on_ready():
    await client.change_presence(activity = discord.Game('Teste commande!')) 

def transfo_date(date):
    if date=="today":
        date_jour = pytz.UTC.localize(datetime.datetime.utcnow())#obtient la date du jour
        date_str = str(date_jour)#converti en chaine de caractere
        date_a=date_str.split()#créé une liste
        date=date_a[0]#recupere l'année le mois et le jour

    if len(date)==2:
        date_jour = pytz.UTC.localize(datetime.datetime.utcnow())#obtient la date du jour
        date_str = str(date_jour)#converti en chaine de caractere
        date_split=date_str.split()#créé une liste
        date_annee=date_split[0]#recupere l'année le mois et le jour
        date_a=date_annee.split("-")
        if date_a[2]>date:
            mois_modifier=int(date_a[1])+1
            if mois_modifier<10 and mois_modifier>=1:
                date_a[1]=f"0{mois_modifier}"
            else:
                date_a[1]=f"{int(date_a[1])+1}"
            print(date_a,"modifier")
        date_a[2]=date # modifie le jour par celui choisi
        print(date_a)
        date=date_a[0]+'-'+date_a[1]+"-"+date_a[2]
        print(date)   
    return date

#https://docs.pycord.dev/en/stable/api/application_commands.html#discord.SlashCommand.options

@client.slash_command(name="planning",guild_ids=[1014525850554744862],description="Commande pour obtenir le planning d'une personne ")#, guild_ids=[...],option=[]
async def planning(interaction:discord.Interaction,prénom:str,date:str):
    prénom=prénom.lower()
    print(prénom)
    print(date)

    if prénom=="maxime":
        url="https://www.myefrei.fr/api/public/student/planning/wg-Wzwjdw6-Fg8kp5cr5ww"
    if prénom=="corentin":
        url="https://www.myefrei.fr/api/public/student/planning/oAQtG1Rd7JQhO_GETSaF7w"
    if prénom=="kevin":
        url="https://www.myefrei.fr/api/public/student/planning/yAvRXlcfkHyKI9wOxigssw"
    
    #Regarde si le prénom donné existe
    if prénom in ["maxime", "corentin","kevin"]:
        cal=get_agenda(url)   
        date=transfo_date(date)
        #Regarde si la date donnée existe   
        date_correcte=False
        if len(date)==10:
            date_correcte=True
        print("ok")
       
        if date_correcte:
            print(type(date))
            liste_cours=date_cours(cal,date)
            print("Liste cours: ",liste_cours)
            
            #Mise en forme de l'affichage
            #https://plainenglish.io/blog/send-an-embed-with-a-discord-bot-in-python
            
            if len(liste_cours) == 0: 
                await interaction.response.send_message(f"{prénom} n'a pas de cours le {date} :tada:",ephemeral=False)
    
            else: 
                afficahge = discord.Embed(title = f"Cours de {prénom}", description = f"__Voici vos cours du {date} :__\n", color = 0x00BFFF)
                for i in range (0,len(liste_cours),4):
                    afficahge.add_field(name=f"{liste_cours[i]}", value=f"{liste_cours[i+1]}", inline=True) 
                    debut=liste_cours[i+2].isoformat(timespec="minutes")
                    fin=liste_cours[i+3].isoformat(timespec="minutes")
                    afficahge.add_field(name=f"Horraires", value=f"{debut} / {fin}", inline=True)
                    afficahge.add_field(name="", value="",inline=False)
                    
                afficahge.set_author(name = interaction.user.name,icon_url=interaction.user.avatar)
                afficahge.set_thumbnail(url="https://www.efrei.fr/wp-content/uploads/2022/01/LOGO_EFREI-PRINT_EFREI-WEB.png")
                afficahge.set_footer(text = f"Vous avez un total de {len(liste_cours)//4} cours aujourd'hui")
                print("non la")
                await interaction.channel.send(embed = afficahge)
        else:
            await interaction.response.send_message("Syntaxe invalide. La date est incorrecte",ephemeral=True)
    else:
        await interaction.response.send_message("Syntaxe invalide. Le prénom est incorrecte",ephemeral=True) #ephemeral permet d'afficher le message que pour l'utilisateur
    print("ok")
    
client.run('MTAzMjYzMjk2NjE3OTk5OTgwNg.GQNBMw.gaXmkjAytqtweemSXGhUWSiZ5lAalNQfou5LA4')      


