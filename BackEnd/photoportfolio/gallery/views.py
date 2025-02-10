from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,viewsets
from rest_framework.decorators import action
from .models import Image,Slideshow, SlideshowImage
from .serializers import ImageSerializer,SlideshowSerializer
from django.http import Http404
class ImageListCreateView(APIView):
    def get(self, request):
        category = request.query_params.get('category', None)
        title = request.query_params.get('title', None)
        
        queryset = Image.objects.all().order_by('-creation_date')
        
        if category:
            queryset = queryset.filter(category=category)
        if title:
            queryset = queryset.filter(title__icontains=title)
            
        serializer = ImageSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = ImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ImageDetailView(APIView):
    def get_object(self, pk):
        try:
            return Image.objects.get(pk=pk)
        except Image.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        image = self.get_object(pk)
        serializer = ImageSerializer(image, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        image = self.get_object(pk)
        serializer = ImageSerializer(
            image, 
            data=request.data, 
            context={'request': request},
            partial=True  # Permite actualización parcial
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        image = self.get_object(pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class SlideshowListCreateView(APIView):
    def get(self, request):
        slideshows = Slideshow.objects.prefetch_related('images').all()
        serializer = SlideshowSerializer(slideshows, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = SlideshowSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SlideshowDetailView(APIView):
    def get_object(self, pk):
        try:
            return Slideshow.objects.get(pk=pk)
        except Slideshow.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        slideshow = self.get_object(pk)
        serializer = SlideshowSerializer(slideshow, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk):
        slideshow = self.get_object(pk)
        serializer = SlideshowSerializer(slideshow, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        slideshow = self.get_object(pk)
        slideshow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AvailableImagesView(APIView):
    def get(self, request):
        used_images = SlideshowImage.objects.values_list('image_id', flat=True)
        available_images = Image.objects.exclude(id__in=used_images)
        serializer = ImageSerializer(available_images, many=True, context={'request': request})
        return Response(serializer.data)