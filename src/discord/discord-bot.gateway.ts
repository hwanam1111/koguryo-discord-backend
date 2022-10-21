/* bot.gateway.ts */

import { Injectable } from '@nestjs/common';
import { Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client } from 'discord.js';

@Injectable()
export class DiscordBotGateway {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  @Once('ready')
  onReady() {
    console.log(`Discord Bot ${this.client.user.tag} was started!`);
  }
}
