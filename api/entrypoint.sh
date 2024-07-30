#!/bin/sh

python manage.py migrate

python manage.py createsuperuser --noinput

python manage.py load_mocks

python manage.py runserver 0.0.0.0:8000