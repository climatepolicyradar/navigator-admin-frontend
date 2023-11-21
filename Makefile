.PHONEY: build build_prod run run_prod

TAG = navigator-admin-frontend
VITE_API_URL ?= https://admin.dev.climatepolicyradar.org/api/
VITE_PORT ?= 3000


build:
	docker build -t ${TAG} -f Dockerfile.dev .


build_prod:
	docker build -t ${TAG} -f Dockerfile .


run: build
	docker run -p ${VITE_PORT}:${VITE_PORT} --env-file "$(PWD)/.env" --mount type=bind,source="$(PWD)",target=/app ${TAG}


run_prod: build_prod
	docker run -p ${VITE_PORT}:${VITE_PORT} --env-file "$(PWD)/.env" ${TAG}


with_local: build
	docker run --rm -it \
		-p ${VITE_PORT}:${VITE_PORT} \
		--network=navigator-backend_default \
		--env-file "$(PWD)/.env" \
		--mount type=bind,source="$(PWD)",target=/app \
		$(TAG)
