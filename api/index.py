import os
import sys

# Add the backend-drf directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend-drf'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')

# Initialize Django
import django
django.setup()

# Import Django application
from django.core.wsgi import get_wsgi_application

# Get the WSGI application
django_app = get_wsgi_application()

# Vercel serverless function handler
from vercel_wsgi import handle_wsgi_event

def handler(event, context):
    return handle_wsgi_event(django_app, event, context)