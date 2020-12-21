// Init bot
const Discord = require('discord.js');
const client = new Discord.Client();

// Packages
const covid = require('novelcovid');

// Bot settings
const colors = require('./config/colors.json')
const config = require('./config.json');
const prefix = '>';
const adminPrefix = "a>";

// "Custom" NodeJS Modules
const mongo = require('./external/mongo')
const welcome = require('./external/welcome')

client.on('ready', async () => {
    console.log(`Ouch, ready to accept commands as ${client.user.tag}`)

    await mongo().then(mongoose => {
        try {
            console.log('Connected to Mongo!')
        } finally {
            mongoose.connection.close()
        }
    })

    welcome(client)
})

client.on('message', async msg => {
    if(msg.author.bot) return;
    
    if (msg.content.startsWith(prefix)) {
        console.log(`Running ${msg.content}`)
    }
    
    if (msg.content === `${prefix}test `) {
        msg.reply(`Hello User. I'm Dad`)
    }

    if (msg.content === `${prefix}hooktest `) {
        const hook = new Discord.WebhookClient('787706865801756723', 'evUgaQIMhyEoIGihTICve1c5eHA2nVQbE2kCn0igRE2WQdHvhhv0OpAIFyuTiOvlfowc')
        hook.send('Yeah, they seem to be fine')
    }

    if (msg.content === `${prefix}covid `) {
        const covidStats = await covid.all()

        msg.channel.send(new Discord.MessageEmbed()
            .setTitle(`COVID-19 Stats`)
            .setColor("GREEN")
            .addField(`Cases`, covidStats.cases)
            .addField(`Deaths`, covidStats.deaths)
            .addField(`Recovered`, covidStats.recovered)
            .setFooter(`PainBot | V1.0.0`)
            .setTimestamp()
        ) 
    }

    if (msg.content === `${prefix}help`) {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .addField('Help', `Shows this menu. Usage: >help`)
            .addField('Covid', `Shows stats on the COVID-19 Pandemic. Usage: >covid`)
            .addField('User Info', `Shows info about you account. Usage: >userinfo`)
            .setFooter('PainBot | V1.0.0')
        )
    }

    if (msg.content === `${prefix}userinfo`) {
        msg.channel.send(new Discord.MessageEmbed()
            .addField('Account Created', msg.author.createdAt)
            .addField('ID', msg.author.id)
            .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        )
    }

    if (msg.content === `${adminPrefix}help`) {
        msg.channel.send(new Discord.MessageEmbed()
         .setTitle('Admin Commands')
         .setColor(colors.BLUE)
         .addField('Admin CMD', `Shows this menu`)
        )
    }

    if (msg.content === `${prefix}madeby` || msg.content === `${prefix}info`) {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle(`Bot Info`)
            .addField('Made By:', `Finlay Henderson/FinlayHendoMan`)
            //.setAuthor(msg.author.tag, msg.author.displayAvatarURL())
            //.setAuthor(msg.bot.tag, msg.bot.displayAvatarURL())
            .setColor('#ffffff')
        )
    }

    //if(msg.content === `${prefix}purge`)
})

client.on('guildMemberAdd', member => {
    console.log(`${member} has joined the server...`)

    const channel = member.guild.channels.cache.find(ch => ch.name === 'new-members');
    if (!channel) console.log('Unable to find "new-member" channel...')

    channel.send(`Say hello to ${member}!`);
})

client.login(config.TOKEN)