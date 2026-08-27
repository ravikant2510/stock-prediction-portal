import os
from django.conf import settings
import matplotlib.pyplot as plt


def save_plot(plot_image_path):
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
    image_path = os.path.join(settings.MEDIA_ROOT, plot_image_path)
    plt.savefig(image_path, bbox_inches='tight')
    plt.close()
    image_url = f'{settings.MEDIA_URL}{plot_image_path}'
    return image_url
