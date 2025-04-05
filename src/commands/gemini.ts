import type { CommandInteraction, CreateApplicationCommandOptions } from 'oceanic.js'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from 'bun'
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'oceanic.js'

const { GEMINI_KEY } = env

const genAI = new GoogleGenerativeAI(GEMINI_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export const description: CreateApplicationCommandOptions = {
  name: 'gemini',
  description: 'ask gemini [google ai] a question',
  type: ApplicationCommandTypes.CHAT_INPUT,
  options: [{
    name: 'input',
    description: 'the input to gemini',
    type: ApplicationCommandOptionTypes.STRING,
    minLength: 2,
    maxLength: 1_000,
    required: true,
  }],
}

export async function handler(interaction: CommandInteraction) {
  const input = interaction.data.options.getStringOption('input', true)

  interaction.defer()

  let respText = await model.generateContent({
    systemInstruction: 'use discord markdown, try to keep your response under 2000 characters',
    contents: [{
      role: 'user',
      parts: [{ text: input.value }],
    }],
  }).then(r => r.response.text())

  await interaction.reply({
    content: respText.slice(0, 2000),
  })

  // incase resp length > 2000
  respText = respText.slice(2000)
  while (respText.length > 0) {
    await interaction.createFollowup({
      content: respText.slice(0, 2000),
    })
    respText = respText.slice(2000)
  }
}
