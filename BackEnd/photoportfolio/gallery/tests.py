# gallery/tests.py
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from .models import Image
from PIL import Image as PilImage
import os
import tempfile

class ImageModelTest(TestCase):
    def setUp(self):
        self.test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=open('gallery/tests/test_images/test.jpeg', 'rb').read(),
            content_type='image/jpeg'
        )
    
    def test_image_creation(self):
        image = Image.objects.create(
            title="Test Image",
            image=self.test_image,
            category="wedding"
        )
        self.assertEqual(image.title, "Test Image")
        self.assertTrue(image.image.name.startswith('gallery/'))
        self.assertIsNotNone(image.creation_date)

class ImageAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.temp_media_dir = tempfile.TemporaryDirectory()
        self.test_image_path = 'gallery/tests/test_images/'

    def test_get_images(self):
        response = self.client.get('/api/images/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_image_upload_and_processing(self):
        # Test con imagen JPEG
        with open(self.test_image_path + 'test.jpeg', 'rb') as img:
            response = self.client.post(
                '/api/images/',
                {
                    'title': 'Test JPEG',
                    'image': img,
                    'category': 'wedding'
                },
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verificar procesamiento de imagen
        image_instance = Image.objects.get(id=response.data['id'])
        img = PilImage.open(image_instance.image.path)
        self.assertTrue(img.width <= 1920)
        self.assertTrue(img.height <= 1080)
        self.assertEqual(img.format, 'JPEG')

        # Test con PNG transparente
        with open(self.test_image_path + 'transparent.png', 'rb') as img:
            response = self.client.post(
                '/api/images/',
                {
                    'title': 'Test PNG',
                    'image': img,
                    'category': 'artistic'
                },
                format='multipart'
            )
        img = PilImage.open(Image.objects.last().image.path)
        self.assertEqual(img.mode, 'RGB')  # Verificar conversión de PNG a JPG con fondo blanco

    def test_invalid_upload(self):
        # Sin imagen
        response = self.client.post(
            '/api/images/',
            {'title': 'Invalid', 'category': 'wedding'},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Categoría inválida
        with open(self.test_image_path + 'test.jpeg', 'rb') as img:
            response = self.client.post(
                '/api/images/',
                {
                    'title': 'Invalid Category',
                    'image': img,
                    'category': 'invalid'
                },
                format='multipart'
            )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        # Limpiar archivos temporales
        for image in Image.objects.all():
            image.image.delete(save=False)
        self.temp_media_dir.cleanup()