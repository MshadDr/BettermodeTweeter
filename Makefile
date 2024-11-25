.PHONY: build start stop clean migrate seed dev prod

NODE_ENV ?= $(shell grep NODE_ENV .env | cut -d '=' -f2)

DC = docker-compose

build:
	$(DC) build

start:
	$(DC) up -d

stop:
	$(DC) down

clean: stop
	$(DC) down -v

# Wait 10 sec for database to be ready
wait-for-db:
	@echo "Waiting for database to be ready..."
	@sleep 10

# Run migrations and seed if in dev env
migrate: wait-for-db
	$(DC) exec bettermode-app npm run build
	@if [ "$(NODE_ENV)" = "dev" ]; then \
		echo "Running in dev mode - executing migrations and seeds..."; \
		$(DC) exec bettermode-app npm run seed; \
	else \
		echo "Running in production mode - executing migrations only..."; \
	fi

dev: build start migrate

prod: build start migrate

logs:
	$(DC) logs -f

restart: stop start

# ==============TRUNCATE DB==============
truncate-db:
	@echo "Truncating all database tables..."
	@$(DC) exec postgres-bettermode psql -U $(shell grep DB_USERNAME .env | cut -d '=' -f2) -d $(shell grep DB_NAME .env | cut -d '=' -f2) -c "\
		DO \$$\$$ \
		DECLARE \
			r RECORD; \
		BEGIN \
			FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP \
				EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' CASCADE'; \
			END LOOP; \
		END \$$\$$;"
	@echo "All tables have been truncated!"

reset-db: truncate-db
	@if [ "$(NODE_ENV)" = "dev" ]; then \
		echo "Reseeding database..."; \
		$(DC) exec bettermode-app npm run seed; \
	fi