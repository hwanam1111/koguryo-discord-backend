import { InteractionEventCollector, On } from '@discord-nestjs/core';
import { ButtonInteraction } from 'discord.js';

// Not Used (Example)
@InteractionEventCollector({ time: 15000 })
export class PostInteractionCollector {
  @On('collect')
  async onCollect(interaction: ButtonInteraction): Promise<void> {
    await interaction.update({
      content: 'A button was clicked!',
      components: [],
    });
  }
}
