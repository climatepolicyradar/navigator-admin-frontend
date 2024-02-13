###############################################################################
# Production Dockerfile
###############################################################################
# This file comprises the Dockerfile image layers that are required to build the
# production version of the 'navigator-admin-frontend' container.
#
# The image is built in two stages:
# 1) A Node image that used to compile and build the frontend assets.
# 2) A Nginx image which is used to serve the built frontend assets.
###############################################################################
ARG VITE_PORT
##############
# Stage 1: Compiling and building the frontend assets using Node.
##############
FROM node:20.11.0-bullseye as builder

WORKDIR /app
COPY . /app

# Install all the project dependencies, including the development dependencies,
# to ensure we can compile the project & build.
RUN yarn install && yarn cache clean && yarn build

# Run container as non-privileged user as per principle of least trust.
USER node

##############
# Stage 2: Serve the built static assets using Nginx.
##############
FROM nginx:stable as injector

# Copy static assets from our builder image to Nginx asset directory.
ARG ASSET_DIR=/usr/share/nginx/html
WORKDIR ${ASSET_DIR}
COPY --chmod=0777 --from=builder /app/dist ${ASSET_DIR}

# Copy in custom entrypoint script to replace static variables with environment
# variables.
COPY --chmod=0775 env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Handle routing of static assets.
ARG NGINX_CONF_FILE=/etc/nginx/conf.d/default.conf
COPY --chmod=0555 nginx.conf ${NGINX_CONF_FILE}

# Override the default Nginx host port, which is 8080.
ARG VITE_PORT
RUN                                                                     \
    DEFAULT_PORT=8080;                                                  \
    if  grep ${DEFAULT_PORT} ${NGINX_CONF_FILE};                        \
    then                                                                \
        sed -i "s/${DEFAULT_PORT}/${VITE_PORT}/g" ${NGINX_CONF_FILE};   \
    else                                                                \
        echo 'Unable to find default port to override. Exiting...';     \
        false;                                                          \
    fi

# Run the container with global directives and daemon off.
CMD ["nginx", "-g", "daemon off;"]

# Simulates running NGINX as a non root. Ideally we would use the non-privileged
# Nginx image "FROM nginxinc/nginx-unprivileged:stable", but it is unclear how
# to do this whilst injecting environment variables in at runtime in Vite.
RUN chmod 0777 /var/cache/nginx/ /var/run/ /etc/nginx/conf.d

USER nginx
