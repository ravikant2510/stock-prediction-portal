import os
import sys

# Add the backend-drf directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend-drf'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')

# Initialize Django
import django
django.setup()

# Import Django WSGI application
from django.core.wsgi import get_wsgi_application

# Get the WSGI application (name it 'app' to match Render's auto-detection)
app = get_wsgi_application()