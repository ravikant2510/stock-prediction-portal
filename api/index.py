import os
import sys
import json

# Add the backend-drf directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend-drf'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stock_prediction_main.settings')

# Initialize Django
import django
django.setup()

# Import Django application
from django.core.wsgi import get_wsgi_application
from django.http import HttpResponse

# Get the WSGI application
django_app = get_wsgi_application()

def handler(event, context):
    """
    Vercel serverless function handler for Django
    """
    from django.core.handlers.wsgi import WSGIHandler
    from io import BytesIO
    
    # Parse the event
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    query_string = event.get('queryStringParameters', {})
    headers = event.get('headers', {})
    body = event.get('body', '')
    
    # Build query string
    query_string_str = '&'.join(f"{k}={v}" for k, v in query_string.items())
    
    # Create WSGI environ
    environ = {
        'REQUEST_METHOD': method,
        'PATH_INFO': path,
        'QUERY_STRING': query_string_str,
        'CONTENT_TYPE': headers.get('content-type', ''),
        'CONTENT_LENGTH': str(len(body)) if body else '0',
        'SERVER_NAME': 'vercel',
        'SERVER_PORT': '443',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'wsgi.version': (1, 0),
        'wsgi.url_scheme': 'https',
        'wsgi.input': BytesIO(body.encode() if body else b''),
        'wsgi.errors': sys.stderr,
        'wsgi.multithread': False,
        'wsgi.multiprocess': False,
        'wsgi.run_once': False,
    }
    
    # Add headers to environ
    for key, value in headers.items():
        environ[f'HTTP_{key.upper().replace("-", "_")}'] = value
    
    # Call Django application
    response_data = {}
    def start_response(status, response_headers, exc_info=None):
        response_data['status'] = status
        response_data['headers'] = dict(response_headers)
    
    try:
        wsgi_handler = WSGIHandler()
        response = wsgi_handler(environ, start_response)
        
        # Get response body
        response_body = b''.join(response)
        
        # Parse status code
        status_code = int(response_data['status'].split()[0])
        
        # Return Vercel response format
        return {
            'statusCode': status_code,
            'headers': response_data['headers'],
            'body': response_body.decode('utf-8')
        }
    except Exception as e:
        import traceback
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'text/plain',
            },
            'body': f'Error: {str(e)}\n{traceback.format_exc()}'
        }