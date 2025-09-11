Django REST Framework Project Setup

This project is an API built with Django REST Framework that requires initial setup before use.

Prerequisites

    Python 3.8 or higher
    pip (Python package manager)


Project Setup

Follow these steps to set up the project in your local environment:
For Linux Ubuntu:
bash

#  Create hidden virtual environment
python3 -m venv .venv

#  Activate the virtual environment
source .venv/bin/activate

#  Install dependencies
pip install -r requirements.txt

#  Run migrations
python3 manage.py migrate

#  Create superuser (follow on-screen instructions)
python3 manage.py createsuperuser

#  Run the server
python3 manage.py runserver


# For Windows:
bash

#  Create hidden virtual environment
python -m venv .venv

#  Activate the virtual environment
cd .venv\Scripts\

\> activate

#  Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

#  Create superuser (follow on-screen instructions)
python manage.py createsuperuser

#  Run the server
python manage.py runserver

Using the Project

After completing the setup:

    The server will be running at http://127.0.0.1:8000/

    Access the admin panel at http://127.0.0.1:8000/admin/

    Use the superuser credentials to log in