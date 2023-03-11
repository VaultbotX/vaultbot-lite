import { SlashCommandBuilder } from "discord.js"

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds a song to the dynamic playlist for two weeks")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription(
          "The song to add, either as a song ID or the URL to the song itself"
        )
        .setRequired(true)
    ),
}
