const Discord = require("discord.js");
const FileSystem = require("fs");
const Enmap = require("enmap");

const Client = new Discord.Client();
const Config = require("./config.json");
Client.config = Config;

class Logger {
    constructor() {
        this.types = [
            "LOGGING",
            "STARTUP",
            "MESSAGE",
            "LOADING",
            "COMMAND"
        ];

        this.log = function (message, type) {
            this.types.forEach(t => {
                if (t == type) {
                    console.log(`[${type}] ${message}`);
                    return;
                }
            });
        };
    }
}

Client.logger = new Logger();

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
            Client.commands.set(commandName, props);
        });
    });
    Client.logger.log(`Loaded Module ${module}`, "LOADING");
});

Client.login(Client.config.Token);