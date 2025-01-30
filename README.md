# 📸 FotografíaPro - Portfolio Digital para Fotógrafos

**Backend API + Panel de Administración para Portafolio Fotográfico**

## 🚀 Descripción
Solución completa para fotógrafos profesionales que incluye:
- **Backend API** con Django REST Framework para gestión de imágenes
- **Frontend React** con panel de administración tipo CRUD
- Sistema optimizado para carga rápida de imágenes
- Organización por categorías profesionales

## ✨ Características Principales

### Backend (Django)
✅ Almacenamiento optimizado de imágenes (JPEG 85% calidad)  
✅ Categorización profesional: Bodas, Recién nacidos, Retratos, etc.  
✅ Base de datos PostgreSQL profesional  
✅ Configuración CORS segura  
✅ API RESTful con Django REST Framework  

### Frontend (React)
🎨 Panel de administración moderno y responsivo  
📤 Subida de imágenes con vista previa  
🗂️ Visualización por categorías  
📱 Diseño mobile-first  
🔒 Validación de formularios con Formik/Yup  
🔄 Manejo de estado con Axios  

## 🛠️ Instalación

### Requisitos Previos
- Python 3.10+
- Node.js 16+
- PostgreSQL
- Pipenv (recomendado)

### Configuración Backend
```bash
# Clonar repositorio
git clone https://github.com/tuusuario/fotografiapro.git
cd fotografiapro
```
# Entorno virtual y dependencias
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```
```bash
# Configurar variables de entorno (crear .env)
echo "SECRET_KEY=tu_super_secreto
DEBUG=True
DB_NAME=fotografia_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost" > .env
```
# Migraciones y datos iniciales
```bash
python manage.py migrate
python manage.py runserver
```
# Configuracion frontend
```bash
npm install
```
# Iniciar aplicacion React
```bash
npm start
```
⚙️ Configuración Clave
```python
# photoportfolio/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': '5432',
    }
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://tudominio.com",
]
```
📡 Endpoints API
Método	Endpoint	Descripción
GET	/api/images/	Listar todas las imágenes
POST	/api/images/	Crear nueva imagen
GET	/api/images/{id}/	Detalle de imagen
PUT	/api/images/{id}/	Actualizar imagen
DELETE	/api/images/{id}/	Eliminar imagen
🛡️ Consideraciones de Seguridad
Optimización automática de imágenes al subir

Validación estricta de tipos de archivo

Configuración CORS restringida

Protección contra XSS y CSRF

Variables sensibles en entorno (.env)

🌍 Despliegue en Producción
Configurar DEBUG=False

Establecer allowed hosts

Usar servicio de almacenamiento en la nube (AWS S3)

Configurar reverse proxy (Nginx)

Implementar HTTPS

Configurar backup automático de PostgreSQL

🧩 Tecnologías Utilizadas
Área	Tecnologías
Backend	Django PostgreSQL
Frontend	React React Router
Herramientas	Pillow Axios
📄 Licencia
MIT License - Ver LICENSE para más detalles

¿Quieres contribuir?

🍴 Haz fork del proyecto

🌿 Crea una rama feature (git checkout -b feature/nueva-funcionalidad)

💾 Commit cambios (git commit -am 'Add nueva funcionalidad')

🚀 Push a la rama (git push origin feature/nueva-funcionalidad)

🔄 Abre un Pull Request
✨ Creado con pasión por Daro - ¡Fotografía profesional al siguiente nivel!
