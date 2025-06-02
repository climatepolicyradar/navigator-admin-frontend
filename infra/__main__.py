"""An AWS Python Pulumi program."""

import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

import pulumi  # type: ignore

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
# Create ECR repo
########################################################################

# Create ECR repo in production account
ecr_repo = ECRRepository(
    "navigator-admin-frontend",
    config=ECRRepositoryConfig(
        principal_service=PolicyOptions.APPRUNNER, image_scan_on_push=False
    ),
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
# Create new App Runner service
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
frontend = AppRunnerService(
    name=name_prefix,
    config=apprunner_config,
    image_identifier=image_identifier,
    env_vars=frontend_env,
    opts=pulumi.ResourceOptions(depends_on=[ecr_repo.repository]),
)

pulumi.export("admin frontend service name", frontend.service.service_name)
pulumi.export("admin frontend arn", frontend.service.arn)

########################################################################
# Create new GitHub Actions role
########################################################################

# Create GitHub Actions role
github_actions_role = GitHubActionsRole(
    name="navigator-admin-frontend-github-actions",
)
