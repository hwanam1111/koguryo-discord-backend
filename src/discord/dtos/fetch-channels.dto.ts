import { CoreOutput } from '@src/common/dtos/output.dto';
import { Channel } from 'discord.js';

export class FetchChannelsOutput extends CoreOutput {
  channels?: Channel[];
}
