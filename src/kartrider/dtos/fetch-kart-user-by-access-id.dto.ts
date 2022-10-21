import { IsNumber } from 'class-validator';
import { CoreOutput } from '@src/common/dtos/output.dto';
import { KartUser } from '@src/kartrider/entities/kart-user.entity';

export class FetchKartUserByAccessIdParam {
  @IsNumber()
  accessId: number;
}

export interface FetchKartUserByAccessIdOutput extends CoreOutput {
  user?: KartUser;
}
