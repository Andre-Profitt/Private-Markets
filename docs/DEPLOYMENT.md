# Deployment Guide

## Environments

- **Development**: Auto-deploys from `develop` branch
- **Staging**: Manual promotion from development
- **Production**: Manual promotion with approvals

## Infrastructure

### Prerequisites

- AWS account with appropriate permissions
- Terraform installed
- kubectl installed
- AWS CLI configured

### Initial Infrastructure Setup

1. Configure Terraform backend:
```bash
cd infrastructure/terraform
terraform init
```

2. Plan infrastructure:
```bash
terraform plan -var-file=environments/dev/terraform.tfvars
```

3. Apply infrastructure:
```bash
terraform apply -var-file=environments/dev/terraform.tfvars
```

## Application Deployment

### CI/CD Pipeline

GitHub Actions automatically:
1. Runs tests and lints on PR
2. Builds Docker images on merge
3. Deploys to dev environment
4. Awaits approval for staging/prod

### Manual Deployment

Build images:
```bash
docker build -t identity-service:latest ./services/identity
```

Push to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ecr-url>
docker tag identity-service:latest <ecr-url>/identity-service:latest
docker push <ecr-url>/identity-service:latest
```

Deploy to Kubernetes:
```bash
kubectl apply -f infrastructure/kubernetes/identity-service.yaml
```

## Database Migrations

Migrations run automatically during deployment.

Manual migration:
```bash
kubectl exec -it <pod-name> -- pnpm prisma migrate deploy
```

## Rollback

```bash
kubectl rollout undo deployment/identity-service
```

## Monitoring

- Logs: CloudWatch or ELK
- Metrics: Prometheus/Grafana
- Traces: Jaeger
- Alerts: PagerDuty

## Health Checks

Each service exposes:
- `/health` - Health check endpoint
- `/metrics` - Prometheus metrics
