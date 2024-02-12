.PHONEY: build build_dev run run_dev

TAG = navigator-admin-frontend
VITE_PORT ?= 3000


build:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile .

build_dev:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile.dev .

run_dev:
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} --env-file "${PWD}/.env" --mount type=bind,source="${PWD}",target=/app ${TAG}

run:
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} ${TAG}

with_local: build_dev
	docker run --rm -it \
		-p ${VITE_PORT}:${VITE_PORT} \
		--network=navigator-backend_default \
		--env-file "${PWD}/.env" \
		--mount type=bind,source="${PWD}",target=/app \
		$(TAG)