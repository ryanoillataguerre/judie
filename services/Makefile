MAKEFLAGS += -j2

.PHONY: run-backend
run-backend:
	docker compose down
	docker compose up

.PHONY: run-app
run-app:
	cd web; yarn dev

.PHONY: run
run: run-backend run-app