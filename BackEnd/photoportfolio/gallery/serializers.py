from rest_framework import serializers
from .models import Image
from PIL import Image as PilImage
from io import BytesIO
import sys

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'title', 'image', 'category', 'creation_date']
        read_only_fields = ['creation_date']

    def validate_image(self, value):
        # Procesar la imagen antes de validación
        img = PilImage.open(value)
        
        # Convertir a RGB si es PNG con canal alpha
        if img.mode in ('RGBA', 'LA'):
            background = PilImage.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1])
            img = background

        # Redimensionar manteniendo aspect ratio
        max_size = (1920, 1080)
        img.thumbnail(max_size, PilImage.LANCZOS)
        
        # Optimizar y guardar en buffer
        output = BytesIO()
        img.save(output, format='JPEG', quality=85, optimize=True)
        output.seek(0)
        
        # Reemplazar el archivo original con el optimizado
        value.file = output
        value.name = value.name.split('.')[0] + '.jpg'  # Cambiar extensión si era PNG
        
        return value