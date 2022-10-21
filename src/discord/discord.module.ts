import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { DiscordController } from '@src/discord/discord.controller';
import { DiscordService } from '@src/discord/discord.service';
import { DiscordBotGateway } from '@src/discord/discord-bot.gateway';
import { NicknameAuthentication } from '@src/discord/features/nickname-authentication';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [DiscordService, DiscordBotGateway, NicknameAuthentication],
  controllers: [DiscordController],
})
export class DiscordBotModule {}
