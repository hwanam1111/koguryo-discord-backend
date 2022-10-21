import { CoreOutput } from '@src/common/dtos/output.dto';
import { IsNumber, IsString } from 'class-validator';

export class KartriderAuthInput {
  @IsString()
  discordId: string;

  @IsString()
  discordUsername: string;

  @IsNumber()
  kartriderAccessId: number;

  @IsString()
  kartriderNickname: string;
}

export class KartriderAuthOutput extends CoreOutput {}
