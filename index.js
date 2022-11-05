const Discord = require("discord.js")

const config = require("./config.json")

const client = new Discord.Client({ 
  intents: [ 
Discord.GatewayIntentBits.Guilds
       ]
    });

module.exports = client

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(`Error`);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})

client.on('ready', () => {
  console.log(`😑 Estou online no ${client.user.username}!`) // para mostrar ao programador que o bot está online e em qual token
})


client.slashCommands = new Discord.Collection()

require('./handler')(client)

client.login(config.token)


const { QuickDB } = require("quick.db")
const db = new QuickDB(); // npm i quick.db better-sqlite3

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  let confirm = await db.get(`antilink_${message.guild.id}`);
  if (confirm === false || confirm === null) {
    return;
  } else if (confirm === true) {
    if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return; // Caso o usuário tenha permissão de ADM, o bot vai permitir que o mesmo envie links
    if (message.content.toLocaleLowerCase().includes("http")) {
      message.delete()
      message.channel.send(`${message.author} Não envie links no servidor!`)
    }

  }
})

client.on("guildMemberAdd", (member) => {
  let canal_logs = "1024299959245353121";
  if (!canal_logs) return;

  let embed = new Discord.EmbedBuilder()
  .setColor("Purple")
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setTitle("👋 Novo membro!")
  .setDescription(`> Atualmente estamos com \`${member.guild.memberCount}\` membros.`);

   member.guild.channels.cache.get(canal_logs).send({ embeds: [embed] }) // Caso queira que o usuário não seja mencionado, retire a parte do "content".
})

client.on("guildMemberRemove", (member) => {
  let canal_logs = "1024299959245353121"; // Coloque o ID do canal de texto
  if (!canal_logs) return;

  let embed = new Discord.EmbedBuilder()
  .setColor("Red")
  .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
  .setTitle(`Adeus ${member.user.username}....`)
  .setDescription(`> O usuário ${member} saiu do servidor!\n> 😓 Espero que retorne um dia.\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`);

  member.guild.channels.cache.get(canal_logs).send({ embeds: [embed] }) // Caso queira que o usuário não seja mencionado, retire a parte do "content". 
})