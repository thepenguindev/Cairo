exports.run = (client, message, args) => {
    message.channel.send("Pinging...").then(m => {
        let ping = m.createdTimestamp - message.createdTimestamp;
        m.edit(`Bot Latency: **${ping} ms**, API Latency: **${client.ws.ping} ms**`);
    });
}