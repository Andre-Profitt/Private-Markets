import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProfilesModule } from './profiles/profiles.module';
import { KycModule } from './kyc/kyc.module';
import { AccreditationModule } from './accreditation/accreditation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ProfilesModule,
    KycModule,
    AccreditationModule,
  ],
})
export class AppModule {}
