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
FROM nginx:alpine

# Set working directory to Nginx asset directory.
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets.
RUN rm -rf ./*

# Copy static assets from our builder image.
COPY --from=builder /app/dist .

# Run the container with global directives and daemon off.
ENTRYPOINT ["nginx", "-g", "daemon off;"]