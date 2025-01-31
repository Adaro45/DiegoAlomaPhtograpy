from rest_framework import serializers
from .models import Image
from PIL import Image as PilImage
from io import BytesIO
import sys

class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Image
        fields = ['id', 'title', 'image','image_url', 'category', 'creation_date']
        read_only_fields = ['creation_date']

    def validate_image(self, value):
        img = PilImage.open(value)
        
        # Convertir modos no compatibles con JPEG
        if img.mode in ('RGBA', 'LA', 'P'):
            if img.mode == 'P':
                img = img.convert('RGB')
            else:
                background = PilImage.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background

        # Asegurar modo RGB para JPEG
        if img.mode != 'RGB':
            img = img.convert('RGB')

        # Redimensionar
        max_size = (1920, 1080)
        img.thumbnail(max_size, PilImage.LANCZOS)
        
        # Optimizar
        output = BytesIO()
        img.save(output, format='JPEG', quality=85, optimize=True)
        output.seek(0)
        
        value.file = output
        value.name = f"{value.name.split('.')[0]}.jpg"
        
        return value
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
    def update(self, instance, validated_data):
        # Elimina la imagen anterior si se sube una nueva
        if 'image' in validated_data and instance.image:
            instance.image.delete(save=False)
        return super().update(instance, validated_data)