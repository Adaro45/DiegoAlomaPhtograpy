from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Image
from .serializers import ImageSerializer
from django.http import Http404
class ImageListCreateView(APIView):
    def get(self, request):
        images = Image.objects.all().order_by('-creation_date')
        serializer = ImageSerializer(images, many=True, context={'request': request})
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