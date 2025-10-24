# Mi Repertorio — Formulario de Solicitud de Servicios

Página estática que contiene un formulario para que los clientes envíen solicitudes de contratación de servicios.

Archivo principal:
- `index.html`: formulario y estructura.
- `styles.css`: estilos responsivos.
- `script.js`: validación (obligatorio: nombre, email) y verificación de que se seleccione al menos un servicio.

Cómo probar localmente:
- Abrir `index.html` en el navegador (doble clic o con PowerShell):

```powershell
Start-Process .\index.html
```

Notas y próximos pasos:
- Actualmente la página solo muestra un resumen y no envía datos a un servidor.
- Para integrar envío real, añadir un endpoint (por ejemplo `/api/solicitudes`) y descomentar/enviar la petición `fetch` en `script.js`.
- Mejoras opcionales: validación más avanzada, mensajes personalizados, protección contra spam (reCAPTCHA), estilos y accesibilidad extendida.
