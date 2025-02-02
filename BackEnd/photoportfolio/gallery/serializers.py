from rest_framework import serializers
from django.core.files.uploadedfile import InMemoryUploadedFile
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
        # Abrir la imagen original
        img = PilImage.open(value)
        
        # Convertir modos no compatibles
        if img.mode in ('RGBA', 'LA', 'P'):
            if img.mode == 'P':
                img = img.convert('RGB')
            else:
                background = PilImage.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
        
        # Redimensionar
        max_size = (1920, 1080)
        img.thumbnail(max_size, PilImage.LANCZOS)
        
        # Crear buffer de salida
        output = BytesIO()
        
        # Determinar formato y parámetros
        original_format = value.name.split('.')[-1].lower() if value.name else 'jpeg'
        format = 'JPEG' if original_format in ['jpg', 'jpeg'] else 'PNG'
        
        # Guardar imagen procesada
        img.save(output, format=format, quality=85, optimize=True)
        output.seek(0)
        
        # Crear nuevo archivo con nombre original
        original_name = value.name.split('.')[0] if value.name else 'processed_image'
        new_name = f"{original_name}.{format.lower()}"
        
        # Crear InMemoryUploadedFile con atributo name
        new_file = InMemoryUploadedFile(
            file=output,
            field_name='image',
            name=new_name,
            content_type=f'image/{format.lower()}',
            size=sys.getsizeof(output),
            charset=None
        )
        
        return new_file
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
    def update(self, instance, validated_data):
        # Elimina la imagen anterior si se sube una nueva
        if 'image' in validated_data and instance.image:
            instance.image.delete(save=False)
        return super().update(instance, validated_data)