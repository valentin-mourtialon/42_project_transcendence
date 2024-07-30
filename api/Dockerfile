FROM python:3.10

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

COPY mock_data.json .

# Create the folder for the avatars pictures (see volumes)
RUN mkdir -p /app/media/avatars

COPY ./media/avatars/*.png /app/media/avatars/

COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

RUN mkdir -p /app/staticfiles

RUN python manage.py collectstatic --noinput

CMD ["/entrypoint.sh"]