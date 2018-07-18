prod:
	docker-compose -f docker-compose-prod.yml build
	docker-compose -f docker-compose-prod.yml up -d

dev: 
	docker-compose -f docker-compose-dev.yml build
	docker-compose -f docker-compose-dev.yml up -d

rebuild_prod:
	docker-compose -f docker-compose-prod.yml build --no-cache
	docker-compose -f docker-compose-prod.yml up -d

rebuild_dev:
	docker-compose -f docker-compose-dev.yml build --no-cache
	docker-compose -f docker-compose-dev.yml up -d
	