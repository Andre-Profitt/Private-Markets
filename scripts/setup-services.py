#!/usr/bin/env python3
import os

services = [
    ("holdings", 3004, "Holdings & Positions Service", "Holdings and positions tracking"),
    ("marketplace", 3005, "Marketplace & Orders Service", "Listings, orders, and trade matching"),
    ("deals", 3006, "Deals & Workflow Service", "Deal lifecycle and workflow orchestration"),
    ("documents", 3007, "Documents & E-Sign Service", "Document management and e-signature integration"),
    ("payments", 3008, "Payments & Settlement Service", "Payment processing and settlement integration"),
    ("pricing", 3009, "Pricing & Trade Data Service", "Trade data aggregation and price history"),
    ("indexing", 3010, "Index & Direct Indexing Service", "Index definitions and direct indexing engine"),
    ("notifications", 3011, "Notifications & Communications Service", "Notifications and communications"),
    ("admin", 3012, "Admin & Compliance Service", "Admin console, audit logs, and compliance tools"),
]

base_path = "/Users/test/private-assets-platform/services"

main_ts_template = """import {{ NestFactory }} from '@nestjs/core';
import {{ ValidationPipe }} from '@nestjs/common';
import {{ SwaggerModule, DocumentBuilder }} from '@nestjs/swagger';
import {{ AppModule }} from './app.module';

async function bootstrap() {{
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({{
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }}),
  );

  app.enableCors({{
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  }});

  const config = new DocumentBuilder()
    .setTitle('{title}')
    .setDescription('{description}')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.{env_var}_SERVICE_PORT || {port};
  await app.listen(port);
  console.log(`{service} service is running on: http://localhost:${{port}}`);
}}

bootstrap();
"""

app_module_template = """import {{ Module }} from '@nestjs/common';
import {{ ConfigModule }} from '@nestjs/config';

@Module({{
  imports: [
    ConfigModule.forRoot({{
      isGlobal: true,
    }}),
  ],
}})
export class AppModule {{}}
"""

for service, port, title, description in services:
    service_path = os.path.join(base_path, service, "src")
    
    # Create main.ts
    main_content = main_ts_template.format(
        title=title,
        description=description,
        env_var=service.upper(),
        port=port,
        service=service
    )
    with open(os.path.join(service_path, "main.ts"), "w") as f:
        f.write(main_content)
    
    # Create app.module.ts
    with open(os.path.join(service_path, "app.module.ts"), "w") as f:
        f.write(app_module_template)
    
    print(f"Created boilerplate for {service} service")

print("All service boilerplate files created successfully!")
