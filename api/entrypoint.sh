#!/bin/sh

# Handle migrations
python manage.py makemigrations
python manage.py migrate

# Create a super user
python manage.py createsuperuser --noinput

# Create mock data
# python manage.py load_mocks

python manage.py runserver 0.0.0.0:8000