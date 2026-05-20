"""An AWS Python Pulumi program."""

import sys
from pathlib import Path
from typing import cast

import pulumi  # type: ignore
import pulumi_aws as aws  # type: ignore

sys.path.append(str(Path(__file__).parent.parent))

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
# Create CloudFront distribution
########################################################################

# Get admin backend stack reference
admin_backend_stack = pulumi.StackReference(f"climatepolicyradar/admin_backend/{env}")
admin_backend_service_url = admin_backend_stack.get_output("new_apprunner_service_url")

admin_frontend.service.service_url.apply(
    lambda url: pulumi.info(f"Admin Frontend app runner URL: {url}")
)
admin_backend_service_url.apply(
    lambda url: pulumi.info(f"Admin Backend app runner URL: {url}")
)

# Create origins for both admin frontend and adminAPI
origins = [
    OriginConfig(
        origin_id="admin-frontend",
        domain_name=cast(
            str,
            admin_frontend.service.service_url.apply(
                lambda url: cast(str, url).replace("https://", "")
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
