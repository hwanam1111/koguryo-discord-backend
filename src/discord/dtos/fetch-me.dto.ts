import { CoreOutput } from '@src/common/dtos/output.dto';
import { IsString } from 'class-validator';

export class FetchMeQuery {
  @IsString()
  accessToken: string;

  @IsString()
  tokenType: string;
}

export class FetchMeOutput extends CoreOutput {
  me?: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    email: string;
  };
}
