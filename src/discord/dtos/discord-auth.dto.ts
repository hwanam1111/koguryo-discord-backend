import { CoreOutput } from '@src/common/dtos/output.dto';
import { IsString } from 'class-validator';

export class DiscordAuthQuery {
  @IsString()
  code: string;
}

export class DiscordAuthOutput extends CoreOutput {
  authUser?: {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
}
