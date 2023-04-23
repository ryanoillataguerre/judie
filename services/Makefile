MAKEFLAGS += -j2

.PHONY: run
run:
	docker compose down
	docker compose up

.PHONY: rebuild
rebuild:
	docker compose down
	docker compose up --build