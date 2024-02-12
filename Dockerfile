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
ARG VITE_API_URL
##############
# Stage 1: Compiling and building the frontend assets using Node.
##############
FROM node:20.11.0-bullseye as builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app
COPY . /app

# Install all the project dependencies, including the development dependencies,
# to ensure we can compile the project.
RUN yarn install
RUN yarn build

# Run container as non-privileged user as per principle of least trust.
USER node

##############
# Stage 2: Serve the built static assets using Nginx.
##############
# Use the non-privileged Nginx image, which serves on port 8080 by default.
FROM nginxinc/nginx-unprivileged:stable

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

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

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

# Run the container with global directives and daemon off.
ENTRYPOINT ["nginx", "-g", "daemon off;"]