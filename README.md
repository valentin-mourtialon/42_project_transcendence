# Pong game web app

## Project Architecture

Single page application using Django Rest Framework for the API, PostgreSQL for
the database, Vanilla Javascript for the frontend and Nginx as a reverse-proxy.
The entire application is containerized using Docker.

### Components

1. **Frontend**: Vanilla JS
2. **Backend**: Django with Django Rest Framework
3. **Web Server**: Nginx
4. **Database**: PostgreSQL
5. **Container Orchestration**: Docker and Docker Compose

### Directory Structure

/
├── frontend/
│ └── static/
│ index.html
├── api/
│ ├── manage.py
│ ├── requirements.txt
│ └── staticfiles/
├── nginx/
│ ├── Dockerfile
│ └── nginx.conf
└── docker-compose.yml

## Configuration Details

### Django (Backend)

1. **Static Files**:

- URL: `/django-static/` (avoid conflicts with `frontend/static/` directory)
- Directory: `api/staticfiles/`

2. **Static Files Configuration** (`settings.py`):

```python
STATIC_URL = '/django-static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

3. **Database Configuration** (`settings.py`):

```python
DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.postgresql",
		"NAME": os.environ.get("POSTGRES_DB"),
		"USER": os.environ.get("POSTGRES_USER"),
		"PASSWORD": os.environ.get("POSTGRES_PASSWORD"),
		"HOST": "db",
		"PORT": 5432,
	}
}
```

## Setup and Running

- Ensure Docker and Docker Compose are installed.
- Clone the repository.
- Create a `.env` file with necessary environment variables (`POSTGRES_DB`,
  `POSTGRES_USER`, `POSTGRES_PASSWORD`).
- Build and start the containers `make up-build`
- Access the application at `http://localhost`.
