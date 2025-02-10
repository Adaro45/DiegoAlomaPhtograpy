from django.db import models

class Image(models.Model):
    CATEGORY_CHOICES = [
        ('wedding', 'Bodas'),
        ('newborn', 'Recién Nacidos'),
        ('portrait', 'Retratos'),
        ('artistic', 'Artístico'),
        # ('couples', 'Parejas'),
        # ('partys', 'Fiestas'),
        # ('others', 'Otros'),
    ]
    
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='gallery/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
class Slideshow(models.Model):
    name = models.CharField(max_length=100, unique=True)
    images = models.ManyToManyField('Image', through='SlideshowImage')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class SlideshowImage(models.Model):
    slideshow = models.ForeignKey(Slideshow, on_delete=models.CASCADE)
    image = models.ForeignKey('Image', on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']