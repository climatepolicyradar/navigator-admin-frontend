"""
                    .--.
                   (o  o)
                   /    \
                  /|    |\
                  ^^    ^^

    🚧 migration in progress 🚧

    App Runner → ECS Express
    STATUS
  → ECS Express is live behind CloudFront
  → Cleanup and refactor work to be completed, with the infra code moved to the infra
    directory in the service

    Roadmap
  → Remove old App Runner service and related resources

    This file is temporary and mid-refactor.
"""

import sys
from pathlib import Path
from typing import cast

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore

sys.path.append(str(Path(__file__).parent.parent))

from pulumi_aws import ecs, get_caller_identity, iam
from pulumi_aws.ecs.express_gateway_service import (
    ExpressGatewayService,
    ExpressGatewayServiceNetworkConfigurationArgs,
    ExpressGatewayServicePrimaryContainerArgs,
    ExpressGatewayServicePrimaryContainerEnvironmentArgs,
    ExpressGatewayServiceScalingTargetArgs,
)
from util.naming import DEFAULT_TAGS

from resources.app_runner_service import AppRunnerConfig, AppRunnerService
from resources.cache_policy import CachePolicyConfig, CloudFrontCachePolicy
from resources.cloudfront_distribution import (
    CloudFrontDistribution,
    DistributionType,
    OriginConfig,
)
from resources.cors_policy import CloudFrontCORSPolicy, CORSPolicyConfig
from resources.dns import DNS, DNSConfig
from resources.ecr_repository import ECRRepository, ECRRepositoryConfig
from resources.github_actions_role import GitHubActionsRole
from resources.util import (
    BehaviourOptions,
    CookieConfig,
    HeaderConfig,
    QueryStringConfig,
    tag_name,
    validate_aws_account,
    validate_stack_and_branch,
)

validate_aws_account()
validate_stack_and_branch()

stack = pulumi.get_stack()
config = pulumi.Config()

# To inject the VITE_API_URL into the container at runtime instead of build time, we
# need to do some find and replace magic in the container entrypoint script. Any key-
# value pairs we wish to inject at runtime are defined in this file and must start with
# the prefix MY_APP_ in the 'FRONTEND_ENV' dictionary below. In the admin-frontend
# source repository, update the .env.production with the Pulumi key name as the key, and
# the MY_APP_ prefixed key name as the value.
frontend_env = {
    "MY_APP_API_URL": config.require("vite_api_url"),
    "MY_APP_GEOGRAPHIES_API_URL": config.require("vite_geographies_api_url"),
    "API_VERSION": config.require("api_version"),
    "ROBOTS": config.require("robots"),
    "HOSTNAME": config.require("hostname"),
}

########################################################################
# Create ECR repo
########################################################################

ecr_repo = ECRRepository(
    "navigator-admin-frontend",
    config=ECRRepositoryConfig(image_scan_on_push=False),
)

# Export the repository URL for use in CI/CD pipelines
pulumi.export("ecr_repository_url", ecr_repo.repository.repository_url)
pulumi.export("ecr_repository_name", ecr_repo.repository.name)

# Get the concrete repository URL value
repository_url = ecr_repo.repository.repository_url.apply(lambda url: url)
repository_url.apply(lambda url: pulumi.info(f"Repository URL: {url}"))
docker_tag = config.require("docker_tag")
pulumi.info(f"Docker tag: {docker_tag}")
image_identifier = ecr_repo.repository.repository_url.apply(
    lambda url: f"{url}:{docker_tag}"
)
image_identifier.apply(lambda id: pulumi.info(f"Final image identifier: {id}"))

########################################################################
# Create App Runner service
########################################################################

apprunner_config = AppRunnerConfig(
    max_concurrency=int(config.require("apprunner_frontend_max_concurrency")),
    max_instances=int(config.require("apprunner_frontend_max_instance_count")),
    min_instances=int(config.require("apprunner_frontend_min_instance_count")),
    port=3000,
    auto_deploy=True,
)

# Create the frontend AppRunner service in current account
name_prefix = tag_name()
admin_frontend = AppRunnerService(
    name=name_prefix,
    config=apprunner_config,
    image_identifier=image_identifier,
    env_vars=frontend_env,
    opts=pulumi.ResourceOptions(depends_on=[ecr_repo.repository]),
)

pulumi.export("admin frontend service name", admin_frontend.service.service_name)
pulumi.export("admin frontend arn", admin_frontend.service.arn)

########################################################################
# Create GitHub Actions role
########################################################################

# Create GitHub Actions role
github_actions_role = GitHubActionsRole(
    name="navigator-admin-frontend-github-actions",
)

# ########################################################################
# # Create CloudFront policies & distribution
# ########################################################################
CLOUDFRONT_ZONE_ID = "Z2FDTNDATAQYW2"  # CloudFront's fixed zone ID
# See here https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-recordset-aliastarget.html#aws-properties-route53-recordset-aliastarget-properties
# Create CORS policy
cors_policy = CloudFrontCORSPolicy(
    CORSPolicyConfig(
        name="AdminService",
        comment="Admin Origin Request Policy (no use of x-forwarded-host header)",
        headers=HeaderConfig(
            behaviour=BehaviourOptions.WHITELIST,
            items=[
                "Origin",
                "Accept",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
            ],
        ),
        cookies=CookieConfig(behaviour=BehaviourOptions.ALL),
        query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
    ),
)

# Create cache policy
cache_policy = CloudFrontCachePolicy(
    CachePolicyConfig(
        name="AdminService",
        comment="Admin Cache Policy (no use of host header)",
        headers=HeaderConfig(
            behaviour=BehaviourOptions.WHITELIST,
            items=[
                "Authorization",
                "Origin",
                "Accept",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Referer",
            ],
        ),
        cookies=CookieConfig(behaviour=BehaviourOptions.ALL),
        query_strings=QueryStringConfig(behaviour=BehaviourOptions.ALL),
    ),
)


########################################################################
# Create Route 53 records & certificate
########################################################################

env = pulumi.get_stack()

aws_env_stack = pulumi.StackReference(f"climatepolicyradar/aws_env/{env}")
hosted_zone_id = aws_env_stack.get_output("root_zone_id")

# First create the CloudFront distribution with the correct domain
apex_domain = f"admin.{env}.climatepolicyradar.org"
www_domain = f"www-admin.{env}.climatepolicyradar.org"

dns_config = DNSConfig(
    domain=f"admin.{env}.climatepolicyradar.org",
    zone_id=cast(str, hosted_zone_id),
    environment=env,
    certificate_type="CLOUDFRONT",
    subject_alternative_names=[
        www_domain
    ],  # Added: Include www subdomain in certificate
)

dns = DNS(
    name=name_prefix,
    config=dns_config,
)


########################################################################
# ECS Express Mode
########################################################################
# Migration in progress: App Runner → ECS Express
# This service runs alongside App Runner. CloudFront is not yet pointed
# at it — that switchover happens in a follow-up PR.
########################################################################


name = "admin-frontend"
account_id = get_caller_identity().account_id

# Task role: runtime permissions. The frontend container doesn't need
# AWS API access at runtime (no S3, no Secrets Manager, no nothing),
# so this role has the trust policy only.
ecs_task_role = iam.Role(
    f"{name}-ecs-task-role",
    name=f"{name}-ecs-task-role",
    assume_role_policy=iam.get_policy_document(
        statements=[
            iam.GetPolicyDocumentStatementArgs(
                effect="Allow",
                principals=[
                    iam.GetPolicyDocumentStatementPrincipalArgs(
                        type="Service",
                        identifiers=["ecs-tasks.amazonaws.com"],
                    )
                ],
                actions=["sts:AssumeRole"],
            )
        ]
    ).json,
)

# Execution role: pulls the image from ECR and writes container logs.
# GitHub Actions assumes this role during deploys, same as the backend.
ecs_task_execution_role = iam.Role(
    f"{name}-{stack}-ecs-task-execution-role",
    name=f"{name}-{stack}-ecs-task-execution-role",
    assume_role_policy=iam.get_policy_document(
        statements=[
            iam.GetPolicyDocumentStatementArgs(
                effect="Allow",
                principals=[
                    iam.GetPolicyDocumentStatementPrincipalArgs(
                        type="Service",
                        identifiers=["ecs-tasks.amazonaws.com"],
                    )
                ],
                actions=["sts:AssumeRole"],
            ),
            iam.GetPolicyDocumentStatementArgs(
                effect="Allow",
                principals=[
                    iam.GetPolicyDocumentStatementPrincipalArgs(
                        type="AWS",
                        identifiers=[
                            f"arn:aws:iam::{account_id}:role/{github_actions_role.name}"
                        ],
                    )
                ],
                actions=["sts:AssumeRole"],
            ),
        ]
    ).json,
    managed_policy_arns=[
        "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    ],
)

# Infrastructure role: lets ECS Express manage the ALB, target groups,
# and security groups it provisions on our behalf.
ecs_infrastructure_role = iam.Role(
    f"{name}-{stack}-ecs-infrastructure-role",
    name=f"{name}-{stack}-ecs-infrastructure-role",
    assume_role_policy=iam.get_policy_document(
        statements=[
            iam.GetPolicyDocumentStatementArgs(
                effect="Allow",
                principals=[
                    iam.GetPolicyDocumentStatementPrincipalArgs(
                        type="Service",
                        identifiers=["ecs.amazonaws.com"],
                    )
                ],
                actions=["sts:AssumeRole"],
            ),
            iam.GetPolicyDocumentStatementArgs(
                effect="Allow",
                principals=[
                    iam.GetPolicyDocumentStatementPrincipalArgs(
                        type="AWS",
                        identifiers=[
                            f"arn:aws:iam::{account_id}:role/{github_actions_role.name}"
                        ],
                    )
                ],
                actions=["sts:AssumeRole"],
            ),
        ]
    ).json,
    managed_policy_arns=[
        "arn:aws:iam::aws:policy/service-role/AmazonECSInfrastructureRoleforExpressGatewayServices",
    ],
)

ecs_cluster = ecs.Cluster(
    f"{name}-{stack}-ecs-cluster",
    name=f"{name}-{stack}",
    settings=[
        ecs.ClusterSettingArgs(
            name="containerInsights",
            value="enabled",
        )
    ],
)

########################################################################
# ECS networking — public ALB, locked to CloudFront prefix list
########################################################################
# The ALB is internet-facing because that's where CloudFront origins it,
# but the security group only permits inbound from the CloudFront
# origin-facing prefix list. TLS terminates at CloudFront; the
# CloudFront → ALB hop is plain HTTP on the AWS backbone, matching the
# pattern used by the admin-backend service.
########################################################################

ecs_alb_security_group = aws.ec2.SecurityGroup(
    f"{name}-{stack}-ecs-alb-sg",
    name=f"{name}-{stack}-ecs-alb-sg",
    description="Allows inbound HTTP from CloudFront to the Express Gateway ALB",
    vpc_id=config.require("vpc_id"),
    ingress=[
        aws.ec2.SecurityGroupIngressArgs(
            description="HTTP from CloudFront edge locations",
            from_port=80,
            to_port=80,
            protocol="tcp",
            prefix_list_ids=[config.require("cloudfront_origin_prefix_list_id")],
        ),
    ],
    egress=[
        aws.ec2.SecurityGroupEgressArgs(
            from_port=0,
            to_port=0,
            protocol="-1",
            cidr_blocks=["0.0.0.0/0"],
        ),
    ],
    tags=dict(DEFAULT_TAGS),
)

primary_container = ExpressGatewayServicePrimaryContainerArgs(
    image=ecr_repo.repository.repository_url.apply(lambda url: f"{url}:latest"),
    container_port=3000,
    environments=[
        ExpressGatewayServicePrimaryContainerEnvironmentArgs(name=k, value=v)
        for k, v in frontend_env.items()
    ],
)

ecs_express_service = ExpressGatewayService(
    f"{name}-{stack}-ecs-express-service",
    service_name=f"{name}-{stack}",
    cluster=ecs_cluster.arn,
    execution_role_arn=ecs_task_execution_role.arn,
    infrastructure_role_arn=ecs_infrastructure_role.arn,
    task_role_arn=ecs_task_role.arn,
    primary_container=primary_container,
    health_check_path="/",
    cpu="1024",
    memory="2048",
    scaling_targets=[
        ExpressGatewayServiceScalingTargetArgs(
            auto_scaling_metric="AVERAGE_CPU",
            auto_scaling_target_value=70,
            min_task_count=1,
            max_task_count=4,
        ),
    ],
    network_configurations=[
        ExpressGatewayServiceNetworkConfigurationArgs(
            security_groups=[ecs_alb_security_group.id],
            subnets=[
                config.require("vpc_public_subnet_1_id"),
                config.require("vpc_public_subnet_2_id"),
                config.require("vpc_public_subnet_3_id"),
            ],
        )
    ],
)

########################################################################
# Create CloudFront distribution
########################################################################

# Get admin backend stack reference
admin_backend_stack = pulumi.StackReference(f"climatepolicyradar/admin_backend/{env}")
admin_backend_service_url = admin_backend_stack.get_output("ecs_express_service_url")

admin_frontend.service.service_url.apply(
    lambda url: pulumi.info(f"Admin Frontend app runner URL: {url}")
)
admin_backend_service_url.apply(
    lambda url: pulumi.info(f"Admin Backend ECS Express Service URL: {url}")
)

# Create origins for both admin frontend and adminAPI
origins = [
    OriginConfig(
        origin_id="admin-frontend",
        domain_name=cast(
            str,
            ecs_express_service.ingress_paths.apply(
                lambda paths: (
                    paths[0].endpoint.replace("https://", "") if paths else None
                )
            ),
        ),
    )
]
origins.append(
    OriginConfig(
        origin_id="admin-api",
        domain_name=cast(
            str,
            admin_backend_service_url.apply(
                lambda url: cast(str, url).replace("https://", "")
            ),
        ),
    )
)

# Define ordered cache behaviors for API routes
ordered_cache_behaviors = None
ordered_cache_behaviors = [
    {
        "allowed_methods": [
            "GET",
            "HEAD",
            "OPTIONS",
            "PUT",
            "POST",
            "PATCH",
            "DELETE",
        ],
        "cached_methods": ["GET", "HEAD", "OPTIONS"],
        "cache_policy_id": cache_policy.policy.id,
        "compress": True,
        "path_pattern": "/api/tokens",
        "target_origin_id": "admin-api",
        "viewer_protocol_policy": "redirect-to-https",
    },
    {
        "allowed_methods": [
            "GET",
            "HEAD",
            "OPTIONS",
            "PUT",
            "POST",
            "PATCH",
            "DELETE",
        ],
        "cached_methods": ["GET", "HEAD", "OPTIONS"],
        "cache_policy_id": cache_policy.policy.id,
        "compress": True,
        "path_pattern": "/api/v1/*",
        "target_origin_id": "admin-api",
        "viewer_protocol_policy": "redirect-to-https",
    },
]

# Create the CloudFront distribution
cf = CloudFrontDistribution(
    "AdminFrontendDistribution",
    DistributionType.FRONTEND,
    description="Admin Service",
    aliases=[apex_domain, www_domain],
    origins=origins,
    cache_policy_id=cast(str, cache_policy.policy.id),
    acm_certificate=dns.certificate,
    origin_request_policy_id=cast(str, cors_policy.policy.id),
    ordered_cache_behaviors=ordered_cache_behaviors,
    tags={"Environment": env},
)

# Create A record for apex domain
dns.create_alias_record(
    name=apex_domain,  # Use full domain name
    target_zone_id=CLOUDFRONT_ZONE_ID,
    target_dns_name=cast(str, cf.distribution.domain_name),
    record_type="A",
    evaluate_target_health=False,
)

# Create CNAME record for www subdomain pointing to apex domain
dns.create_record(
    name=www_domain,  # Use full www domain name
    record_type=aws.route53.RecordType.CNAME,
    records=[apex_domain],  # Point to apex domain
    ttl=300,
)


pulumi.export(
    "ecs_express_service_url",
    ecs_express_service.ingress_paths.apply(
        lambda paths: paths[0].endpoint.removeprefix("https://") if paths else None
    ),
)
