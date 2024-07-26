DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./docker-compose.yml

# Build the image (or rebuild it)
build:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

# Create all the containers
up:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up -d

# Create containers and make sure at the same time images have been built
up-build:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build -d

# Remove containers
down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

# Removes and create containers again
reup: down up

# Start again all the containers
start:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) start

# Stop all containers
stop:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop

# Stop and start containers again
restart: stop start

# Display logs
logs:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) logs

# Remove all images and volumes
clean:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --volumes --remove-orphans

# Remove everything (including named volumes)
fclean: clean
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down -v

# Clean everything, then rebuild the image
rebuild: fclean build

# Clean everything, rebuild the image and start containers
reupbuild: fclean up-build

.PHONY: build up up-build down reup start stop restart logs clean fclean rebuild reupbuild