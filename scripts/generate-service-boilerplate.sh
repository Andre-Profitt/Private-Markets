#!/bin/bash

# Script to generate boilerplate files for each service

SERVICES=(
  "profiles:3002:User Profiles, KYC & Accreditation Service"
  "companies:3003:Company & Security Master Service"
  "holdings:3004:Holdings & Positions Service"
  "marketplace:3005:Marketplace & Orders Service"
  "deals:3006:Deals & Workflow Service"
  "documents:3007:Documents & E-Sign Service"
  "payments:3008:Payments & Settlement Service"
  "pricing:3009:Pricing & Trade Data Service"
  "indexing:3010:Index & Direct Indexing Service"
  "notifications:3011:Notifications & Communications Service"
  "admin:3012:Admin & Compliance Service"
)

for service_info in "${SERVICES[@]}"; do
  IFS=':' read -r service port description <<< "$service_info"

  # Create main.ts
  cat > "../services/${service}/src/main.ts" << EOF
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('${description}')
    .setDescription('${description}')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.${service^^}_SERVICE_PORT || ${port};
  await app.listen(port);
  console.log(\`${service} service is running on: http://localhost:\${port}\`);
}

bootstrap();
EOF

  # Create app.module.ts
  cat > "../services/${service}/src/app.module.ts" << EOF
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
EOF

  # Create README.md
  cat > "../services/${service}/README.md" << EOF
# ${description}

## Service Port
${port}

## Description
${description}

## Environment Variables

\`\`\`env
${service^^}_SERVICE_PORT=${port}
DATABASE_URL=postgresql://...
\`\`\`

## Development

\`\`\`bash
pnpm install
pnpm dev
pnpm test
\`\`\`
EOF

done

echo "Service boilerplate generation complete!"
