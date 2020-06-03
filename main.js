const Discord = require("discord.js");
const FileSystem = require("fs");
const Enmap = require("enmap");

const Client = new Discord.Client();
const Config = require("./config.json");
Client.config = Config;

FileSystem.readdir("./Events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./Events/${file}`);
        let eventName = file.split(".")[0];
        Client.on(eventName, event.bind(null, Client));
    });
});

Client.commands = new Enmap();

Client.config.Modules.forEach(module => {
    FileSystem.readdir(`./Commands/${module}/`, (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let props = require(`./Commands/${module}/${file}`);
            let commandName = file.split(".")[0];
            console.log(`[LOADING] Loaded { ${commandName} }`);
            Client.commands.set(commandName, props);
        });
    });
});

Client.login(Client.config.Token);