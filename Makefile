.PHONEY: build build_prod run run_prod

TAG = navigator-admin-frontend
VITE_API_URL ?= https://admin.dev.climatepolicyradar.org/api/
VITE_PORT ?= 3000


build:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile.dev .


build_prod:
	docker build --build-arg VITE_PORT=${VITE_PORT} -t ${TAG} -f Dockerfile .


run: build
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} --env-file "${PWD}/.env" --mount type=bind,source="${PWD}",target=/app ${TAG}


run_prod: build_prod
	docker run --name ${TAG} -p ${VITE_PORT}:${VITE_PORT} -e VITE_API_URL=${VITE_API_URL} ${TAG}


with_local: build
	docker run --rm -it \
		-p ${VITE_PORT}:${VITE_PORT} \
		--network=navigator-backend_default \
		--env-file "${PWD}/.env" \
		--mount type=bind,source="${PWD}",target=/app \
		$(TAG)
