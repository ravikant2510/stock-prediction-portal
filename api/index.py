import os
import sys

# Add the backend-drf directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend-drf'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')

# Initialize Django
import django
django.setup()

# Import Django ASGI application
from django.core.asgi import get_asgi_application

# Vercel expects a top-level 'app' variable
app = get_asgi_application()