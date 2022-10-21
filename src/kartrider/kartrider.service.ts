import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { Client, EmbedBuilder } from 'discord.js';
import {
  FetchKartUserByAccessIdOutput,
  FetchKartUserByAccessIdParam,
} from '@src/kartrider/dtos/fetch-kart-user-by-access-id.dto';
import {
  FetchKartUserByNicknameOutput,
  FetchKartUserByNicknameParam,
} from '@src/kartrider/dtos/fetch-kart-user-by-nickname.dto';
import {
  KartriderAuthInput,
  KartriderAuthOutput,
} from '@src/kartrider/dtos/kartrider-auto.dto';
import { DiscordService } from '@src/discord/discord.service';
import { SUCCESS_USER_AUTH } from '@src/discord/constants/channels';

@Injectable()
export class KartriderService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly discordService: DiscordService,
  ) {}

  async fetchKartUserByAccessId({
    accessId,
  }: FetchKartUserByAccessIdParam): Promise<FetchKartUserByAccessIdOutput> {
    try {
      const kartRiderUser = await axios({
        url: `https://api.nexon.co.kr/kart/v1.0/users/${accessId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: process.env.NEXON_DEVELOPERS_API_KEY,
        },
      });

      return {
        ok: true,
        user: kartRiderUser.data,
      };
    } catch (err) {
      console.log(err.response);
      return {
        ok: false,
        httpErrorCode: err.response.status,
        error: err.response,
      };
    }
  }

  async fetchKartUserByNickname({
    nickname,
  }: FetchKartUserByNicknameParam): Promise<FetchKartUserByNicknameOutput> {
    try {
      const kartRiderUser = await axios({
        url: `https://api.nexon.co.kr/kart/v1.0/users/nickname/${encodeURI(
          nickname,
        )}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: process.env.NEXON_DEVELOPERS_API_KEY,
        },
      });

      return {
        ok: true,
        user: kartRiderUser.data,
      };
    } catch (err) {
      return {
        ok: false,
        httpErrorCode: err.response.status,
        error: err.response.data.message,
      };
    }
  }

  async kartriderAuth({
    discordId,
    discordUsername,
    kartriderAccessId,
    kartriderNickname,
  }: KartriderAuthInput): Promise<KartriderAuthOutput> {
    try {
      const { channel } = (await this.discordService.fetchChannel({
        name: SUCCESS_USER_AUTH,
      })) as any;
      const embed = new EmbedBuilder()
        .setTitle('카트라이더 유저 인증 완료')
        .setDescription('카트라이더 유저 정보입니다.')
        .setColor('#007bff')
        .addFields([
          {
            name: '디스코드 Id',
            value: discordId.toString(),
          },
          {
            name: '디스코드 유저명',
            value: discordUsername,
          },
          {
            name: '카트라이더 Access Id',
            value: kartriderAccessId.toString(),
          },
          {
            name: '카트라이더 닉네임',
            value: kartriderNickname,
          },
        ]);

      const guild = await this.client.guilds.fetch('448376473586368512');
      const member = await guild.members.fetch({
        user: discordId.toString(),
        force: true,
      });
      const guestRole = (await guild.roles.fetch()).find(
        (role) => role.name === '─ 방문',
      );

      const alreadyGuestUser = member.roles.cache.get(guestRole.id);
      if (alreadyGuestUser) {
        return {
          ok: false,
          httpErrorCode: 403,
          error: 'already-guest-user',
        };
      }

      member.roles.add(guestRole).catch((err) => {
        console.log(err);
      });

      channel.send({
        content: '─ 방문 역할 부여가 완료되었습니다.',
        embeds: [embed],
      });

      return {
        ok: true,
        error: guestRole,
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
