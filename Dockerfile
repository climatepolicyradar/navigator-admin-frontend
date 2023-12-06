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

# TODO: This should really be yarn install --production, but in the interest of
# speedy deployment I'll come and revisit this another time and revert to yarn
# install for now. PDCT-662.
RUN yarn install

CMD yarn prod
