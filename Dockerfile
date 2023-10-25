#
# TODO: This will do for now - but it does run Vite's hot reloader.
#
# To fix it would probably be best to have a 2 stage docker file, this being
# the first buld stage, then a second stage to build from an nginx container.
# Something like:
#     https://typeofnan.dev/how-to-serve-a-react-app-with-nginx-in-docker/
#
FROM node:20-alpine3.17

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install 
COPY . /app

RUN yarn build
CMD yarn run preview --port 3000 --host 0.0.0.0
