.PHONEY: build run 

TAG = navigator-admin-frontend

run: build
	docker run -p 5173:5173 navigator-admin-frontend


build:
	docker build -t ${TAG} .