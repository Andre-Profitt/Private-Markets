# Terraform Infrastructure

Infrastructure as Code for the Private Assets Platform.

## Structure

- `main.tf` - Main Terraform configuration
- `variables.tf` - Variable definitions
- `outputs.tf` - Output values
- `modules/` - Reusable Terraform modules
- `environments/` - Environment-specific configurations

## Usage

### Initialize Terraform

```bash
cd infrastructure/terraform
terraform init
```

### Plan changes

```bash
terraform plan -var-file=environments/dev/terraform.tfvars
```

### Apply changes

```bash
terraform apply -var-file=environments/dev/terraform.tfvars
```

### Destroy infrastructure

```bash
terraform destroy -var-file=environments/dev/terraform.tfvars
```

## Modules

- `vpc` - VPC, subnets, and networking
- `rds` - PostgreSQL RDS instance
- `eks` - EKS cluster for services
- `s3` - S3 buckets for document storage
