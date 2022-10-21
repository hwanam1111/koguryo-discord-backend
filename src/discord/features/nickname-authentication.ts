import { Injectable } from '@nestjs/common';
import { On, UseGuards } from '@discord-nestjs/core';
import { Message } from 'discord.js';
import axios from 'axios';
import { MessageCreateGuard } from '@src/discord/guards/message-create.guard';
import logger from '@src/logger/winston.setup';
import { SEARCH_KARTRIDER_USER_INFO } from '@src/discord/constants/channels';

@Injectable()
export class NicknameAuthentication {
  @On('messageCreate')
  @UseGuards(MessageCreateGuard)
  async messageCreate(
    message: Message & { channel: { name: string } },
  ): Promise<boolean | void> {
    try {
      if (message.channel.name !== SEARCH_KARTRIDER_USER_INFO) {
        return false;
      }
      if (message.content.indexOf('!') !== 0) {
        return false;
      }

      let kartRiderUser;
      try {
        kartRiderUser = await axios({
          url: `https://api.nexon.co.kr/kart/v1.0/users/nickname/${encodeURI(
            message.content.replace('!', ''),
          )}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: process.env.NEXON_DEVELOPERS_API_KEY,
          },
        });
      } catch (err) {
        switch (err.response.status) {
          case 404:
            await message.reply('닉네임이 존재하지 않습니다.');
            break;
          default:
            await message.reply('닉네임을 조회하는 도중 오류가 발생했습니다.');
            break;
        }
      }

      if (kartRiderUser?.data) {
        await message.reply(JSON.stringify(kartRiderUser.data));
      }
    } catch (err) {
      logger(err.status, err);
      await message.reply(
        `오류가 발생했습니다. 관리자에게 문의해주세요.\n오류메세지 : ${err.message}`,
      );
    }
  }
}
