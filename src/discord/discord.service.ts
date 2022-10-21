import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import { Client } from 'discord.js';
import {
  DiscordAuthOutput,
  DiscordAuthQuery,
} from '@src/discord/dtos/discord-auth.dto';
import { FetchMeOutput, FetchMeQuery } from '@src/discord/dtos/fetch-me.dto';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { FetchChannelsOutput } from '@src/discord/dtos/fetch-channels.dto';
import {
  FetchChannelParam,
  FetchChannelOutput,
} from '@src/discord/dtos/fetch-channel.dto';

@Injectable()
export class DiscordService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {}

  async discordAuth({ code }: DiscordAuthQuery): Promise<DiscordAuthOutput> {
    try {
      console.log('>> auth params logs : ', {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.FRONT_END_URL}`,
        scope: 'identify',
      });
      const auth = await axios({
        url: 'https://discord.com/api/oauth2/token',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.FRONT_END_URL}`,
          scope: 'identify',
        }),
      });

      return {
        ok: true,
        authUser: auth.data,
      };
    } catch (err) {
      if (err.status === 500) {
        throw new HttpException(
          {
            ok: false,
            error: err,
          },
          500,
        );
      }
      return {
        ok: false,
        httpErrorCode: 401,
        error:
          err.response.data.error === 'invalid_grant'
            ? 'expired-token'
            : err.response.data.error,
      };
    }
  }

  async fetchMe({
    accessToken,
    tokenType,
  }: FetchMeQuery): Promise<FetchMeOutput> {
    try {
      const authUser = await axios({
        url: 'https://discord.com/api/users/@me',
        method: 'GET',
        headers: { authorization: `${tokenType} ${accessToken}` },
      });
      const { id, username, avatar, discriminator, email } = authUser.data;

      return {
        ok: true,
        me: { id, username, avatar, discriminator, email },
      };
    } catch (err) {
      throw new HttpException(
        {
          ok: false,
          error: err,
        },
        500,
      );
    }
  }

  async fetchChannels(): Promise<FetchChannelsOutput> {
    try {
      const channels = Array.from(this.client.channels.cache).map(
        (channel) => channel[1],
      );

      return {
        ok: true,
        channels,
      };
    } catch (err) {
      throw new HttpException(
        {
          ok: false,
          error: err,
        },
        500,
      );
    }
  }

  async fetchChannel({ name }: FetchChannelParam): Promise<FetchChannelOutput> {
    try {
      const channels = await this.fetchChannels();
      const channel = channels.channels.find(
        (channel: any) => channel.name === name,
      );

      return {
        ok: true,
        channel,
      };
    } catch (err) {
      throw new HttpException(
        {
          ok: false,
          error: err,
        },
        500,
      );
    }
  }
}
