import { IsString } from 'class-validator';
import { CoreOutput } from '@src/common/dtos/output.dto';
import { Channel } from 'discord.js';

export class FetchChannelParam {
  @IsString()
  name: string;
}

export class FetchChannelOutput extends CoreOutput {
  channel?: Channel;
}
