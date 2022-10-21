import { Injectable } from '@nestjs/common';
import {
  Command,
  InjectDiscordClient,
  UseCollectors,
  UsePipes,
} from '@discord-nestjs/core';
import { TransformPipe } from '@discord-nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  InteractionReplyOptions,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { PostInteractionCollector } from '@src/discord/features/commands/admin.send-auth-notice/post-interaction-collector';
import { DiscordService } from '@src/discord/discord.service';
import { SERVER_NOTICE_CHANNEL } from '@src/discord/constants/channels';

@Command({
  name: 'admin-send-auth-notice',
  description: '📢__안내 채널에 인증 공지사항을 보낼 수 있어요.',
})
@Injectable()
@UsePipes(TransformPipe)
@UseCollectors(PostInteractionCollector)
export class AdminSendAuthNotice {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly discordService: DiscordService,
  ) {}

  async handler(): Promise<InteractionReplyOptions> {
    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('인증하러가기')
          .setURL(process.env.DISCORD_AUTH_LINK)
          .setDisabled(false),
      );

    const { channel } = (await this.discordService.fetchChannel({
      name: SERVER_NOTICE_CHANNEL,
    })) as any;

    let noticeContent = '';
    noticeContent += '**서버 가입 안내**\n\n\n';
    noticeContent +=
      '* 카트라이더 유저임을 확인하기 위해 아래 버튼을 눌러 닉네임 인증을 해주세요.\n\n';
    noticeContent +=
      '* 버튼을 클릭해도 반응이 없으면 디스코드를 재실행 해주시길 바랍니다.\n\n';
    noticeContent += '* 인증을 완료하면 자동으로 "방문" 역할이 부여됩니다.\n\n';
    noticeContent +=
      '*기존에 서버에 들어와 계셨던 분들도 번거롭겠지만 인증 부탁드리겠습니다.\n\n';
    noticeContent +=
      '* 고구려 길드원이거나, 이미 역할이 부여되신분들은 인증을 할 필요가 없습니다.\n\n';
    noticeContent +=
      '* 만약 인증된 닉네임이 본인의 닉네임이 아닐 시 서버 제제가 있을 수 있습니다.\n\n';
    noticeContent += '*인증이 원활하지 않을 경우 관리자에게 문의해주세요.\n\n';

    channel.send({
      content: noticeContent,
      components: [row],
    });

    return {
      content: '전송이 완료되었습니다.',
      components: [],
    };
  }
}
