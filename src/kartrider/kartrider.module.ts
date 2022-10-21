import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { DiscordService } from '@src/discord/discord.service';
import { KartriderController } from '@src/kartrider/kartrider.controller';
import { KartriderService } from '@src/kartrider/kartrider.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [KartriderService, DiscordService],
  controllers: [KartriderController],
})
export class KartriderModule {}
