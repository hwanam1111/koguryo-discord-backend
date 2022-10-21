import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import * as Joi from 'joi';
import { DiscordConfig } from '@src/discord/discord-bot.config';
import { DiscordBotModule } from '@src/discord/discord.module';
import { DiscordBotSlashCommandModule } from '@src/discord/discord-bot-slash.module';
import { KartriderModule } from '@src/kartrider/kartrider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        LOCAL_SERVER_PORT: Joi.string().required(),
        FRONT_END_URL: Joi.string().required(),
        DISCORD_AUTH_LINK: Joi.string().required(),
        DISCORD_CLIENT_ID: Joi.string().required(),
        DISCORD_CLIENT_SECRET: Joi.string().required(),
        DISCORD_BOT_TOKEN: Joi.string().required(),
        NEXON_DEVELOPERS_API_KEY: Joi.string().required(),
      }),
    }),
    DiscordModule.forRootAsync({
      useClass: DiscordConfig,
    }),
    DiscordBotModule,
    DiscordBotSlashCommandModule,
    KartriderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
