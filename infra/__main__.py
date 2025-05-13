"""An AWS Python Pulumi program."""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pulumi
import pulumi_aws as aws
from apprunner.main import create_apprunner_config, create_frontend_auto_scaling_config
from util.naming import DEFAULT_TAGS, NAME_PREFIX

from resources.app_runner_service import AppRunnerConfig, AppRunnerService
from resources.ecr_repository import ECRRepository, ECRRepositoryConfig, PolicyOptions
from resources.github_actions_role import GitHubActionsRole
from resources.util import tag_name, validate_aws_account, validate_stack_and_branch

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
    "API_VERSION": config.require("api_version"),
    "ROBOTS": config.require("robots"),
    "HOSTNAME": config.require("hostname"),
}

########################################################################
# Create old App Runner service
########################################################################

IRELAND_RESOURCE = pulumi.ResourceOptions(
    provider=aws.Provider("eu-west-1", region="eu-west-1")
)
SMALL_INSTANCE = aws.apprunner.ServiceInstanceConfigurationArgs()

IMAGE_IDENTIFIER = f"{config.require('ecr_uri')}:{config.require('docker_tag')}"

auto_scaling_config = create_frontend_auto_scaling_config()
frontend = aws.apprunner.Service(
    resource_name=f"{NAME_PREFIX}-app",
    service_name=f"{NAME_PREFIX}-app",
    opts=IRELAND_RESOURCE,
    instance_configuration=SMALL_INSTANCE,
    auto_scaling_configuration_arn=auto_scaling_config.arn,
    source_configuration=create_apprunner_config(
        account_id=aws.get_caller_identity().account_id,
        image_identifier=IMAGE_IDENTIFIER,
        env=frontend_env,
    ),
    tags=DEFAULT_TAGS,
)

pulumi.export("frontend service name", frontend.service_name)
pulumi.export("frontend arn", frontend.arn)

########################################################################
# Create ECR repo
########################################################################

if "production" in stack:
    # Create ECR repo in production account
    ecr_repo = ECRRepository(
        "navigator-admin-frontend",
        config=ECRRepositoryConfig(
            principal_service=PolicyOptions.APPRUNNER, image_scan_on_push=False
        ),
        opts=pulumi.ResourceOptions(import_="navigator-admin-frontend"),
    )

    # Export the repository URL for use in CI/CD pipelines
    pulumi.export("ecr_repository_url", ecr_repo.repository.repository_url)
    pulumi.export("ecr_repository_name", ecr_repo.repository.name)

########################################################################
# Create new App Runner service
########################################################################

apprunner_config = AppRunnerConfig(
    max_concurrency=int(config.require("apprunner_frontend_max_concurrency")),
    max_instances=int(config.require("apprunner_frontend_max_instance_count")),
    min_instances=int(config.require("apprunner_frontend_min_instance_count")),
    port=3000,
)

# Create the frontend AppRunner service in current account
name_prefix = tag_name()
frontend = AppRunnerService(
    name=name_prefix,
    config=apprunner_config,
    image_identifier=f"{config.require('ecr_uri')}:{config.require('docker_tag')}",
    env_vars=frontend_env,
)

pulumi.export("new admin frontend service name", frontend.service.service_name)
pulumi.export("new admin frontend arn", frontend.service.arn)

########################################################################
# Create new GitHub Actions role
########################################################################

# Create GitHub Actions role only for CPR stacks (in current account)
if stack in ["production", "staging"]:
    github_actions_role = GitHubActionsRole(
        name="navigator-admin-frontend-github-actions",
    )
