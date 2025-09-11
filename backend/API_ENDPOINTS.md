# SQLNAUTICA - API Endpoints Documentation

## Descripción del Proyecto

SQLNAUTICA es una aplicación Django REST Framework que simula un juego educativo de SQL. Los usuarios pueden registrarse, completar niveles con desafíos SQL, recolectar partes de códigos para avanzar entre niveles, y competir en un ranking basado en puntuaciones. Cada nivel presenta desafíos SQL progresivos que otorgan puntos y partes de un código de finalización.

## Configuración de Autenticación

- **Tipo de Autenticación**: JWT (JSON Web Tokens)
- **Duración del Access Token**: 30 minutos
- **Duración del Refresh Token**: 1 día
- **Header de Autenticación**: `Authorization: Bearer <token>`
- **Permisos por defecto**: Requiere autenticación para todos los endpoints (excepto los marcados como `AllowAny`)

---

## 🔐 Autenticación

### 1. Obtener Token de Acceso
- **Endpoint**: `POST /api/token/`
- **Autenticación**: No requerida
- **Descripción**: Obtiene un access token y refresh token usando credenciales de usuario

**Body:**
```json
{
    "username": "nombre_usuario",
    "password": "contraseña"
}
```

**Respuesta:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Renovar Token de Acceso
- **Endpoint**: `POST /api/token/refresh/`
- **Autenticación**: No requerida
- **Descripción**: Renueva el access token usando el refresh token

**Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Respuesta:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 👥 Usuarios

### 1. Listar Usuarios
- **Endpoint**: `GET /api/users/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene la lista de todos los usuarios

**Respuesta:**
```json
[
    {
        "id": 1,
        "username": "usuario1",
        "score": 150
    }
]
```

### 2. Crear Usuario (Registro)
- **Endpoint**: `POST /api/users/`
- **Autenticación**: No requerida (`AllowAny`)
- **Descripción**: Registra un nuevo usuario en el sistema

**Body:**
```json
{
    "username": "nuevo_usuario",
    "password": "contraseña_segura",
    "score": 0
}
```

**Respuesta:**
```json
{
    "id": 2,
    "username": "nuevo_usuario",
    "score": 0
}
```

### 3. Obtener Usuario Específico
- **Endpoint**: `GET /api/users/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene los datos de un usuario específico

**Respuesta:**
```json
{
    "id": 1,
    "username": "usuario1",
    "score": 150
}
```

### 4. Actualizar Usuario
- **Endpoint**: `PUT /api/users/{id}/` o `PATCH /api/users/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Actualiza los datos de un usuario

**Body (PUT - completo):**
```json
{
    "username": "usuario_actualizado",
    "password": "nueva_contraseña",
    "score": 200
}
```

**Body (PATCH - parcial):**
```json
{
    "score": 200
}
```

### 5. Eliminar Usuario
- **Endpoint**: `DELETE /api/users/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Elimina un usuario del sistema

### 6. Ranking de Usuarios
- **Endpoint**: `GET /api/users/ranking/`
- **Autenticación**: No requerida (`AllowAny`)
- **Descripción**: Obtiene el ranking de usuarios ordenado por puntuación

**Respuesta:**
```json
[
    {
        "username": "usuario_ganador",
        "score": 500,
        "last_score_update": "15/12/2024 14:30:25"
    },
    {
        "username": "usuario_segundo",
        "score": 300,
        "last_score_update": "15/12/2024 13:45:10"
    }
]
```

---

## 🎮 Niveles

### 1. Listar Niveles
- **Endpoint**: `GET /api/levels/levels/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene la lista de todos los niveles con sus pistas y desafíos

**Respuesta:**
```json
[
    {
        "id": 1,
        "name": "Nivel 1: Introducción a SQL",
        "description": "Aprende los conceptos básicos de SQL",
        "code": "1234",
        "created_at": "2024-12-15T10:00:00Z",
        "clues": [
            {
                "id": 1,
                "level": 1,
                "text": "Usa CREATE TABLE para crear una tabla",
                "order": 1
            }
        ],
        "challenges": [
            {
                "id": 1,
                "level": 1,
                "question": "Crea una tabla llamada 'mochila'",
                "answer": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT)",
                "score": 10
            }
        ]
    }
]
```

### 2. Crear Nivel
- **Endpoint**: `POST /api/levels/levels/`
- **Autenticación**: Requerida
- **Descripción**: Crea un nuevo nivel

**Body:**
```json
{
    "name": "Nuevo Nivel",
    "description": "Descripción del nivel",
    "code": "5678"
}
```

### 3. Obtener Nivel Específico
- **Endpoint**: `GET /api/levels/levels/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene un nivel específico con todos sus datos

### 4. Actualizar Nivel
- **Endpoint**: `PUT /api/levels/levels/{id}/` o `PATCH /api/levels/levels/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Actualiza un nivel existente

### 5. Eliminar Nivel
- **Endpoint**: `DELETE /api/levels/levels/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Elimina un nivel

### 6. Detalle de Nivel
- **Endpoint**: `GET /api/levels/levels/{id}/detail/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene el detalle específico de un nivel (solo pistas y desafíos)

**Respuesta:**
```json
{
    "id": 1,
    "challenges": [
        {
            "id": 1,
            "level": 1,
            "question": "Crea una tabla llamada 'mochila'",
            "answer": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT)",
            "score": 10
        }
    ],
    "clues": [
        {
            "id": 1,
            "level": 1,
            "text": "Usa CREATE TABLE para crear una tabla",
            "order": 1
        }
    ]
}
```

---

## 🔍 Pistas (Clues)

### 1. Listar Pistas
- **Endpoint**: `GET /api/levels/clues/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todas las pistas

**Respuesta:**
```json
[
    {
        "id": 1,
        "level": 1,
        "text": "Usa CREATE TABLE para crear una tabla",
        "order": 1
    }
]
```

### 2. Crear Pista
- **Endpoint**: `POST /api/levels/clues/`
- **Autenticación**: Requerida
- **Descripción**: Crea una nueva pista

**Body:**
```json
{
    "level": 1,
    "text": "Nueva pista para el nivel",
    "order": 2
}
```

### 3. Obtener Pista Específica
- **Endpoint**: `GET /api/levels/clues/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene una pista específica

### 4. Actualizar Pista
- **Endpoint**: `PUT /api/levels/clues/{id}/` o `PATCH /api/levels/clues/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Actualiza una pista

### 5. Eliminar Pista
- **Endpoint**: `DELETE /api/levels/clues/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Elimina una pista

---

## 🎯 Desafíos (Challenges)

### 1. Listar Desafíos
- **Endpoint**: `GET /api/levels/challenges/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene todos los desafíos

**Respuesta:**
```json
[
    {
        "id": 1,
        "level": 1,
        "question": "Crea una tabla llamada 'mochila'",
        "answer": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT)",
        "score": 10
    }
]
```

### 2. Crear Desafío
- **Endpoint**: `POST /api/levels/challenges/`
- **Autenticación**: Requerida
- **Descripción**: Crea un nuevo desafío

**Body:**
```json
{
    "level": 1,
    "question": "Nueva pregunta del desafío",
    "answer": "CREATE TABLE ejemplo (id INTEGER PRIMARY KEY)",
    "score": 15
}
```

### 3. Obtener Desafío Específico
- **Endpoint**: `GET /api/levels/challenges/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Obtiene un desafío específico

### 4. Actualizar Desafío
- **Endpoint**: `PUT /api/levels/challenges/{id}/` o `PATCH /api/levels/challenges/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Actualiza un desafío

### 5. Eliminar Desafío
- **Endpoint**: `DELETE /api/levels/challenges/{id}/`
- **Autenticación**: Requerida
- **Descripción**: Elimina un desafío

---

## 🗄️ Ejecución de SQL

### 1. Ejecutar Consulta SQL
- **Endpoint**: `POST /api/levels/{level_id}/execute-sql/`
- **Autenticación**: Requerida
- **Descripción**: Ejecuta una consulta SQL en la base de datos específica del nivel

**Body:**
```json
{
    "sql": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT);"
}
```

**Respuesta para SELECT:**
```json
{
    "success": true,
    "message": "Query executed successfully",
    "results": [
        [1, "lampara"],
        [2, "cuerda"]
    ],
    "columns": ["id", "item"]
}
```

**Respuesta para INSERT/UPDATE/DELETE:**
```json
{
    "success": true,
    "message": "Query executed successfully",
    "affected_rows": 1
}
```

**Respuesta de Error:**
```json
{
    "error": "SQL Error: syntax error near 'CREAT'"
}
```

### 2. Verificar Código de Nivel
- **Endpoint**: `POST /api/levels/{level_id}/verify-code/`
- **Autenticación**: Requerida
- **Descripción**: Verifica si el código proporcionado es correcto para completar el nivel

**Body:**
```json
{
    "code": "1234"
}
```

**Respuesta Correcta:**
```json
{
    "success": true,
    "message": "¡Nivel completado!",
    "level_id": 1,
    "next_level_available": true
}
```

**Respuesta Incorrecta:**
```json
{
    "success": false,
    "message": "Código incorrecto. Vuelve a intentar!",
    "expected_code": "1234",
    "provided_code": "12"
}
```

### 3. Validar Desafío
- **Endpoint**: `POST /api/levels/{level_id}/challenges/{challenge_id}/validate/`
- **Autenticación**: Requerida
- **Descripción**: Valida si la consulta SQL del usuario coincide con la respuesta esperada del desafío

**Body:**
```json
{
    "sql": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT)"
}
```

**Respuesta Correcta:**
```json
{
    "success": true,
    "message": "¡Reto completado correctamente!",
    "score": 10,
    "challenge_id": 1,
    "user_total_score": 25,
    "code_part": "1",
    "code_part_saved": true
}
```

**Respuesta Incorrecta:**
```json
{
    "success": false,
    "message": "La consulta no coincide con la respuesta esperada",
    "expected": "CREATE TABLE mochila (id INTEGER PRIMARY KEY, item TEXT)",
    "received": "CREATE TABLE mochila (id INTEGER, item TEXT)"
}
```

---

##  Sistema de Código por Partes

### Descripción
Cada nivel tiene un código de finalización (ej: "1234") que se obtiene completando desafíos individuales. Cada desafío otorga una parte del código (ej: "1", "2", "3", "4").

### Flujo de Funcionamiento
1. **Usuario completa desafío** → Obtiene parte del código
2. **Parte se guarda** en tabla `code_parts` de la base de datos SQLite del nivel
3. **Usuario consulta partes** con `SELECT * FROM code_parts`
4. **Usuario reconstruye código** completo (ej: "1234")
5. **Usuario verifica código** con endpoint `verify-code`

### Tabla code_parts (SQLite por nivel)
```sql
CREATE TABLE code_parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER,
    code_part TEXT,
    username TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Ejemplo de Uso
```sql
-- Ver partes recolectadas
SELECT * FROM code_parts;

-- Resultado:
-- id | challenge_id | code_part | username | completed_at
-- 1  | 1           | "1"       | usuario  | 2025-09-10 23:00:00
-- 2  | 2           | "2"       | usuario  | 2025-09-10 23:01:00
-- 3  | 3           | "3"       | usuario  | 2025-09-10 23:02:00
-- 4  | 4           | "4"       | usuario  | 2025-09-10 23:03:00

-- Código reconstruido: "1234"
```

---

##  Modelos de Datos

### CustomUser
```python
{
    "id": "integer (auto)",
    "username": "string (unique)",
    "password": "string (hashed)",
    "score": "integer (default: 0)",
    "last_score_update": "datetime (auto_now)"
}
```

### Level
```python
{
    "id": "integer (auto)",
    "name": "string (max_length: 100, unique)",
    "description": "text (optional)",
    "code": "string (max_length: 10, unique, default: '0000')",
    "created_at": "datetime (auto_now_add)"
}
```

### Clue
```python
{
    "id": "integer (auto)",
    "level": "foreign_key (Level)",
    "text": "text",
    "order": "integer (default: 0)"
}
```

### Challenge
```python
{
    "id": "integer (auto)",
    "level": "foreign_key (Level)",
    "question": "text",
    "answer": "string (max_length: 200)",
    "score": "integer (default: 0)",
    "code_part": "string (max_length: 10, blank=True)"
}
```

---

## 🔧 Configuración Técnica

### Base de Datos
- **Principal**: SQLite (`db.sqlite3`)
- **Por Nivel**: SQLite (`level_{level_id}_db.sqlite3`)

### Configuración de REST Framework
- **Autenticación**: JWT Authentication
- **Permisos por defecto**: IsAuthenticated
- **Formato de fecha**: `%d/%m/%Y %H:%M:%S`

### Códigos de Estado HTTP
- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Error en la solicitud
- **401**: Unauthorized - No autenticado
- **403**: Forbidden - Sin permisos
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

---

## 📝 Notas Importantes

1. **Autenticación**: La mayoría de endpoints requieren autenticación JWT, excepto:
   - Registro de usuarios (`POST /api/users/`)
   - Ranking de usuarios (`GET /api/users/ranking/`)
   - Endpoints de tokens (`/api/token/`)

2. **Bases de Datos por Nivel**: Cada nivel tiene su propia base de datos SQLite para ejecutar consultas SQL de forma aislada.

3. **Validación de Desafíos**: Las consultas SQL se normalizan (minúsculas, sin espacios extra, sin punto y coma) antes de comparar con la respuesta esperada.

4. **Sistema de Código por Partes**: 
   - Cada desafío puede otorgar una parte del código de finalización del nivel
   - Las partes se almacenan automáticamente en la tabla `code_parts` de la base de datos SQLite del nivel
   - El usuario debe reconstruir el código completo para avanzar al siguiente nivel

5. **Suma Automática de Puntos**: Al completar un desafío correctamente, se suman automáticamente los puntos al score del usuario y se actualiza `last_score_update`.

6. **Ranking**: Se ordena por puntuación descendente y luego por fecha de última actualización de puntuación.

7. **Seguridad**: Las contraseñas se almacenan hasheadas y no se devuelven en las respuestas de la API.
