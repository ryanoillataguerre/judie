MAKEFLAGS += -j2

.PHONY: run
run:
	docker compose down
	docker compose -f docker-compose.yml up

.PHONY: rebuild
rebuild:
	docker compose down
	docker compose -f docker-compose.yml up --build

.PHONY: test
test:
	docker compose -f docker-compose-test.yml down
	docker compose -f docker-compose-test.yml up --abort-on-container-exit
	docker compose -f docker-compose-test.yml down
# docker run services_app-service-test yarn run setup
# docker run services_app-service-test yarn run db:seed
# docker run services_app-service-test yarn run test
# cd app-service; yarn run setup; yarn run db:seed; yarn run test; cd ..
# docker compose -f docker-compose-test.yml down