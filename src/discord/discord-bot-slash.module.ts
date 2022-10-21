import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { AdminSendAuthNotice } from '@src/discord/features/commands/admin.send-auth-notice';
import { DiscordService } from '@src/discord/discord.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [DiscordService, AdminSendAuthNotice],
})
export class DiscordBotSlashCommandModule {}
