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
  description: 'π’__μλ΄ μ±λμ μΈμ¦ κ³΅μ§μ¬ν­μ λ³΄λΌ μ μμ΄μ.',
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
          .setLabel('μΈμ¦νλ¬κ°κΈ°')
          .setURL(process.env.DISCORD_AUTH_LINK)
          .setDisabled(false),
      );

    const { channel } = (await this.discordService.fetchChannel({
      name: SERVER_NOTICE_CHANNEL,
    })) as any;

    let noticeContent = '';
    noticeContent += '**μλ² κ°μ μλ΄**\n\n\n';
    noticeContent +=
      '* μΉ΄νΈλΌμ΄λ μ μ μμ νμΈνκΈ° μν΄ μλ λ²νΌμ λλ¬ λλ€μ μΈμ¦μ ν΄μ£ΌμΈμ.\n\n';
    noticeContent +=
      '* λ²νΌμ ν΄λ¦­ν΄λ λ°μμ΄ μμΌλ©΄ λμ€μ½λλ₯Ό μ¬μ€ν ν΄μ£ΌμκΈΈ λ°λλλ€.\n\n';
    noticeContent += '* μΈμ¦μ μλ£νλ©΄ μλμΌλ‘ "λ°©λ¬Έ" μ­ν μ΄ λΆμ¬λ©λλ€.\n\n';
    noticeContent +=
      '*κΈ°μ‘΄μ μλ²μ λ€μ΄μ κ³μ¨λ λΆλ€λ λ²κ±°λ‘­κ² μ§λ§ μΈμ¦ λΆνλλ¦¬κ² μ΅λλ€.\n\n';
    noticeContent +=
      '* κ³ κ΅¬λ € κΈΈλμμ΄κ±°λ, μ΄λ―Έ μ­ν μ΄ λΆμ¬λμ λΆλ€μ μΈμ¦μ ν  νμκ° μμ΅λλ€.\n\n';
    noticeContent +=
      '* λ§μ½ μΈμ¦λ λλ€μμ΄ λ³ΈμΈμ λλ€μμ΄ μλ μ μλ² μ μ κ° μμ μ μμ΅λλ€.\n\n';
    noticeContent += '*μΈμ¦μ΄ μννμ§ μμ κ²½μ° κ΄λ¦¬μμκ² λ¬Έμν΄μ£ΌμΈμ.\n\n';

    channel.send({
      content: noticeContent,
      components: [row],
    });

    return {
      content: 'μ μ‘μ΄ μλ£λμμ΅λλ€.',
      components: [],
    };
  }
}
