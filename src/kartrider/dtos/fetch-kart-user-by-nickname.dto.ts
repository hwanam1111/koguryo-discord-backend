import { IsString } from 'class-validator';
import { CoreOutput } from '@src/common/dtos/output.dto';
import { KartUser } from '@src/kartrider/entities/kart-user.entity';

export class FetchKartUserByNicknameParam {
  @IsString()
  nickname: string;
}

export interface FetchKartUserByNicknameOutput extends CoreOutput {
  user?: KartUser;
}
