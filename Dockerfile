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
ARG VITE_PORT=${VITE_PORT}
##############
# Stage 1: Compiling and building the frontend assets using Node.
##############
FROM node:20-alpine3.17 as builder

WORKDIR /app

COPY . /app

# Install all the project dependencies, including the development dependencies,
# to ensure we can compile the project.
RUN yarn install

RUN yarn build

##############
# Stage 2: Serve the built static assets using Nginx.
##############
# Use the non-privileged Nginx image, which serves on port 8080 by default.
FROM nginxinc/nginx-unprivileged:stable-alpine

# Copy static assets from our builder image to Nginx asset directory.
ARG ASSET_DIR=/usr/share/nginx/html
WORKDIR ${ASSET_DIR}
COPY --from=builder /app/dist ${ASSET_DIR}

# Handle routing of static assets.
ARG NGINX_CONF_FILE=/etc/nginx/conf.d/default.conf
COPY nginx.conf ${NGINX_CONF_FILE}

# Override the default Nginx host port.
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
ENTRYPOINT ["nginx", "-g", "daemon off;"]