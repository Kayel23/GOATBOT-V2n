const fs = require("fs-extra");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

/** 
 * @author NTKhang
 * @author: do not delete it
 * @message if you delete or edit it you will get a global ban
 */

module.exports = {
  config: {
    name: "help",
    version: "1.18",
    author: "NTKhang | ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View detailed information about bot commands.",
    },
    category: "info",
    guide: {
      en: "{pn} [empty | <page number> | <command name>]",
    },
  },

  langs: {
    en: {
      help: "╭───────────⦿\n%1\n✪ Page [ %2/%3 ]\n✪ Total Commands: %4\nType %5help <page> to view more.",
      commandNotFound: 'Command "%1" does not exist.',
      pageNotFound: "Page %1 does not exist.",
    },
  },

  onStart: async function ({ message, args, event, threadsData, getLang }) {
    try {
      const langCode = await threadsData.get(event.threadID, "data.lang") || "en";
      const prefix = getPrefix(event.threadID);
      const page = parseInt(args[0]) || 1;
      const itemsPerPage = 30;

      if (!args[0] || !isNaN(args[0])) {
        // List all commands
        const commandList = Array.from(commands.values())
          .filter(cmd => cmd.config.role <= event.role)
          .map(cmd => cmd.config.name)
          .sort();

        const totalPages = Math.ceil(commandList.length / itemsPerPage);
        if (page < 1 || page > totalPages) {
          return message.reply(getLang("pageNotFound", page));
        }

        const pageContent = commandList
          .slice((page - 1) * itemsPerPage, page * itemsPerPage)
          .map((cmd, i) => `✵ ${i + 1}. ${cmd}`)
          .join("\n");

        return message.reply(
          getLang(
            "help",
            pageContent,
            page,
            totalPages,
            commandList.length,
            prefix
          )
        );
      }

      // Display command info
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        return message.reply(getLang("commandNotFound", commandName));
      }

      const { name, version, author, guide } = command.config;
      const infoMessage = `Name: ${name}\nVersion: ${version}\nAuthor: ${author}\nGuide: ${guide.en}`;
      return message.reply(infoMessage);
    } catch (error) {
      console.error("Error in help command:", error);
      return message.reply("An error occurred while processing your request.");
    }
  },
};
