import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { DiscordService } from '@src/discord/discord.service';
import {
  DiscordAuthOutput,
  DiscordAuthQuery,
} from '@src/discord/dtos/discord-auth.dto';
import { apiResult } from '@src/libs/api-result';
import { FetchMeOutput, FetchMeQuery } from '@src/discord/dtos/fetch-me.dto';
import { FetchChannelsOutput } from '@src/discord/dtos/fetch-channels.dto';
import {
  FetchChannelParam,
  FetchChannelOutput,
} from '@src/discord/dtos/fetch-channel.dto';

@Controller('v1/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get('/auth')
  async discordAuth(
    @Query(ValidationPipe) discordAuthQuery: DiscordAuthQuery,
  ): Promise<DiscordAuthOutput> {
    return apiResult(await this.discordService.discordAuth(discordAuthQuery));
  }

  @Get('/me')
  async fetchMe(
    @Query(ValidationPipe) fetchMeQuery: FetchMeQuery,
  ): Promise<FetchMeOutput> {
    return apiResult(await this.discordService.fetchMe(fetchMeQuery));
  }

  @Get('/channels')
  async fetchChannels(): Promise<FetchChannelsOutput> {
    return apiResult(await this.discordService.fetchChannels());
  }

  @Get('/channels/:name')
  async fetchChannel(
    @Param(ValidationPipe) fetchChannelParam: FetchChannelParam,
  ): Promise<FetchChannelOutput> {
    return apiResult(await this.discordService.fetchChannel(fetchChannelParam));
  }
}
