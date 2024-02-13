.PHONEY: build build_dev run run_dev

TAG = navigator-admin-frontend
VITE_PORT ?= 3000

stop:
	docker stop ${TAG} && docker rm ${TAG}

build:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile .

build_dev:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile.dev .

run_dev:
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} --env-file "${PWD}/.env" --mount type=bind,source="${PWD}",target=/app ${TAG}

run:
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} ${TAG}

run_ci:
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} -e MY_APP_API_URL=https://admin.dev.climatepolicyradar.org/api/ ${TAG}

rebuild: stop build run

with_local: build_dev
	docker run --rm -it \
		-p ${VITE_PORT}:${VITE_PORT} \
		--network=navigator-backend_default \
		--env-file "${PWD}/.env" \
		--mount type=bind,source="${PWD}",target=/app \
		$(TAG)