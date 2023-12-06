# Production Dockerfile
#
# TODO: This will do for now - Vite's hot reloader does not run.
#
# It might not be best practice to use vite preview for production though.
#
# To fix it would probably be best to have a 2 stage docker file, this being
# the first buld stage, then a second stage to build from an nginx container.
# Something like:
#     https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
#
FROM node:20-alpine3.17

WORKDIR /app

COPY . /app
RUN yarn install --production

CMD yarn prod
