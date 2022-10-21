import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { apiResult } from '@src/libs/api-result';
import { KartriderService } from '@src/kartrider/kartrider.service';
import {
  FetchKartUserByAccessIdOutput,
  FetchKartUserByAccessIdParam,
} from '@src/kartrider/dtos/fetch-kart-user-by-access-id.dto';
import {
  FetchKartUserByNicknameOutput,
  FetchKartUserByNicknameParam,
} from '@src/kartrider/dtos/fetch-kart-user-by-nickname.dto';
import {
  KartriderAuthInput,
  KartriderAuthOutput,
} from '@src/kartrider/dtos/kartrider-auto.dto';

@Controller('v1/kartrider')
export class KartriderController {
  constructor(private readonly kartriderService: KartriderService) {}

  @Get('/users/:accessId')
  async fetchKartUserByAccessId(
    @Param(ValidationPipe)
    fetchKartUserByAccessIdParam: FetchKartUserByAccessIdParam,
  ): Promise<FetchKartUserByAccessIdOutput> {
    return apiResult(
      await this.kartriderService.fetchKartUserByAccessId(
        fetchKartUserByAccessIdParam,
      ),
    );
  }

  @Get('/users/nickname/:nickname')
  async fetchKartUserByNickname(
    @Param(ValidationPipe)
    fetchKartUserByNicknameParam: FetchKartUserByNicknameParam,
  ): Promise<FetchKartUserByNicknameOutput> {
    return apiResult(
      await this.kartriderService.fetchKartUserByNickname(
        fetchKartUserByNicknameParam,
      ),
    );
  }

  @Post('/users/auth')
  async kartriderAuth(
    @Body(ValidationPipe) kartriderAutoInput: KartriderAuthInput,
  ): Promise<KartriderAuthOutput> {
    return apiResult(
      await this.kartriderService.kartriderAuth(kartriderAutoInput),
    );
  }
}
