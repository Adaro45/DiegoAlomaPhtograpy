from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from gallery.views import  (
    ImageListCreateView,
    ImageDetailView,
    SlideshowListCreateView,
    SlideshowDetailView,
    AvailableImagesView
    )
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/images/', ImageListCreateView.as_view(), name='image-list-create'),
    path('api/images/<int:pk>/', ImageDetailView.as_view(), name='image-detail'),
    path('api/slideshows/', SlideshowListCreateView.as_view(), name='slideshow-list'),
    path('api/slideshows/<int:pk>/', SlideshowDetailView.as_view(), name='slideshow-detail'),
    path('api/available-images/', AvailableImagesView.as_view(), name='available-images'),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)