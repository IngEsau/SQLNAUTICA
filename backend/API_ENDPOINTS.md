# SQLNAUTICA API - Documentación de Endpoints

## 📋 Información General

- **Base URL**: `http://127.0.0.1:8000/`
- **Autenticación**: JWT (JSON Web Tokens)
- **Formato de fechas**: `dd/mm/yyyy hh:mm:ss`

---

## 🔐 Autenticación

### Obtener Token de Acceso
- **Endpoint**: `POST /api/token/`
- **Descripción**: Obtener token de acceso para autenticación
- **Autenticación**: No requerida
- **Body**:
  ```json
  {
    "username": "tu_usuario",
    "password": "tu_contraseña"
  }
  ```
- **Respuesta**:
  ```json
  {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```

### Renovar Token de Acceso
- **Endpoint**: `POST /api/token/refresh/`
- **Descripción**: Renovar token de acceso usando refresh token
- **Autenticación**: No requerida
- **Body**:
  ```json
  {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  }
  ```

---

## 👥 Usuarios

### Listar Usuarios
- **Endpoint**: `GET /api/users/users/`
- **Descripción**: Obtener lista de todos los usuarios
- **Autenticación**: No requerida
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "username": "usuario1",
      "score": 1500
    }
  ]
  ```

### Crear Usuario
- **Endpoint**: `POST /api/users/users/`
- **Descripción**: Registrar nuevo usuario
- **Autenticación**: No requerida
- **Body**:
  ```json
  {
    "username": "nuevo_usuario",
    "password": "contraseña_segura"
  }
  ```

### Obtener Usuario Específico
- **Endpoint**: `GET /api/users/users/{id}/`
- **Descripción**: Obtener información de un usuario específico
- **Autenticación**: No requerida

### Actualizar Usuario Completo
- **Endpoint**: `PUT /api/users/users/{id}/`
- **Descripción**: Actualizar todos los campos de un usuario
- **Autenticación**: No requerida
- **Body**:
  ```json
  {
    "username": "usuario_actualizado",
    "password": "nueva_contraseña",
    "score": 2000
  }
  ```

### Actualizar Usuario Parcialmente
- **Endpoint**: `PATCH /api/users/users/{id}/`
- **Descripción**: Actualizar campos específicos de un usuario
- **Autenticación**: No requerida
- **Body**:
  ```json
  {
    "score": 2500
  }
  ```

### Eliminar Usuario
- **Endpoint**: `DELETE /api/users/users/{id}/`
- **Descripción**: Eliminar un usuario
- **Autenticación**: No requerida

### 🏆 Ranking de Usuarios
- **Endpoint**: `GET /api/users/users/ranking/`
- **Descripción**: Obtener ranking de usuarios ordenado por score (del mayor al menor)
- **Autenticación**: No requerida
- **Características**:
  - Ordenado por score descendente
  - En caso de empate, ordenado por `last_score_update` ascendente (el que actualizó primero tiene prioridad)
  - Solo devuelve: `username`, `score`, `last_score_update`
- **Respuesta**:
  ```json
  [
    {
      "username": "player1",
      "score": 1500,
      "last_score_update": "15/01/2024 10:30:00"
    },
    {
      "username": "player2",
      "score": 1200,
      "last_score_update": "20/01/2024 14:45:00"
    },
    {
      "username": "player3",
      "score": 1200,
      "last_score_update": "25/01/2024 09:15:00"
    }
  ]
  ```

---

## 🎮 Niveles

### Listar Niveles
- **Endpoint**: `GET /api/levels/levels/`
- **Descripción**: Obtener lista de todos los niveles
- **Autenticación**: JWT requerida
- **Headers**: `Authorization: Bearer {token}`
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "name": "Nivel 1",
      "description": "Descripción del nivel",
      "key": "nivel_1",
      "created_at": "15/01/2024 10:30:00",
      "clues": [],
      "challenges": []
    }
  ]
  ```

### Crear Nivel
- **Endpoint**: `POST /api/levels/levels/`
- **Descripción**: Crear nuevo nivel
- **Autenticación**: JWT requerida
- **Body**:
  ```json
  {
    "name": "Nuevo Nivel",
    "description": "Descripción del nuevo nivel",
    "key": "nuevo_nivel"
  }
  ```

### Obtener Nivel Específico
- **Endpoint**: `GET /api/levels/levels/{id}/`
- **Descripción**: Obtener información de un nivel específico
- **Autenticación**: JWT requerida

### Actualizar Nivel Completo
- **Endpoint**: `PUT /api/levels/levels/{id}/`
- **Descripción**: Actualizar todos los campos de un nivel
- **Autenticación**: JWT requerida

### Actualizar Nivel Parcialmente
- **Endpoint**: `PATCH /api/levels/levels/{id}/`
- **Descripción**: Actualizar campos específicos de un nivel
- **Autenticación**: JWT requerida

### Eliminar Nivel
- **Endpoint**: `DELETE /api/levels/levels/{id}/`
- **Descripción**: Eliminar un nivel
- **Autenticación**: JWT requerida

---

## 🔍 Pistas (Clues)

### Listar Pistas
- **Endpoint**: `GET /api/levels/clues/`
- **Descripción**: Obtener lista de todas las pistas
- **Autenticación**: JWT requerida
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "level": 1,
      "text": "Esta es una pista",
      "order": 1
    }
  ]
  ```

### Crear Pista
- **Endpoint**: `POST /api/levels/clues/`
- **Descripción**: Crear nueva pista
- **Autenticación**: JWT requerida
- **Body**:
  ```json
  {
    "level": 1,
    "text": "Nueva pista",
    "order": 2
  }
  ```

### Obtener Pista Específica
- **Endpoint**: `GET /api/levels/clues/{id}/`
- **Descripción**: Obtener información de una pista específica
- **Autenticación**: JWT requerida

### Actualizar Pista Completa
- **Endpoint**: `PUT /api/levels/clues/{id}/`
- **Descripción**: Actualizar todos los campos de una pista
- **Autenticación**: JWT requerida

### Actualizar Pista Parcialmente
- **Endpoint**: `PATCH /api/levels/clues/{id}/`
- **Descripción**: Actualizar campos específicos de una pista
- **Autenticación**: JWT requerida

### Eliminar Pista
- **Endpoint**: `DELETE /api/levels/clues/{id}/`
- **Descripción**: Eliminar una pista
- **Autenticación**: JWT requerida

---

## 🎯 Retos (Challenges)

### Listar Retos
- **Endpoint**: `GET /api/levels/challenges/`
- **Descripción**: Obtener lista de todos los retos
- **Autenticación**: JWT requerida
- **Respuesta**:
  ```json
  [
    {
      "id": 1,
      "level": 1,
      "question": "¿Cuál es la respuesta?",
      "answer": "La respuesta correcta",
      "points": 10
    }
  ]
  ```

### Crear Reto
- **Endpoint**: `POST /api/levels/challenges/`
- **Descripción**: Crear nuevo reto
- **Autenticación**: JWT requerida
- **Body**:
  ```json
  {
    "level": 1,
    "question": "Nueva pregunta",
    "answer": "Nueva respuesta",
    "points": 15
  }
  ```

### Obtener Reto Específico
- **Endpoint**: `GET /api/levels/challenges/{id}/`
- **Descripción**: Obtener información de un reto específico
- **Autenticación**: JWT requerida

### Actualizar Reto Completo
- **Endpoint**: `PUT /api/levels/challenges/{id}/`
- **Descripción**: Actualizar todos los campos de un reto
- **Autenticación**: JWT requerida

### Actualizar Reto Parcialmente
- **Endpoint**: `PATCH /api/levels/challenges/{id}/`
- **Descripción**: Actualizar campos específicos de un reto
- **Autenticación**: JWT requerida

### Eliminar Reto
- **Endpoint**: `DELETE /api/levels/challenges/{id}/`
- **Descripción**: Eliminar un reto
- **Autenticación**: JWT requerida

---

## 🛠️ Panel de Administración

### Panel de Administración Django
- **Endpoint**: `GET /admin/`
- **Descripción**: Acceso al panel de administración de Django
- **Autenticación**: Requiere superusuario

---

## 📝 Notas Importantes

### Autenticación
- Los endpoints de **niveles**, **pistas** y **retos** requieren autenticación JWT
- Los endpoints de **usuarios** y **autenticación** son públicos
- Para endpoints protegidos, incluir header: `Authorization: Bearer {token}`

### Formato de Fechas
- Todas las fechas se muestran en formato: `dd/mm/yyyy hh:mm:ss`

### Ranking
- El ranking se ordena por score descendente
- En caso de empate, se ordena por `last_score_update` ascendente (el que actualizó primero tiene prioridad)

### Modelos de Datos

#### Usuario (CustomUser)
- `id`: Identificador único
- `username`: Nombre de usuario
- `password`: Contraseña (solo para creación/actualización)
- `score`: Puntuación del usuario
- `last_score_update`: Fecha de última actualización del score

#### Nivel (Level)
- `id`: Identificador único
- `name`: Nombre del nivel
- `description`: Descripción del nivel
- `key`: Clave única del nivel
- `created_at`: Fecha de creación
- `clues`: Lista de pistas relacionadas
- `challenges`: Lista de retos relacionados

#### Pista (Clue)
- `id`: Identificador único
- `level`: ID del nivel al que pertenece
- `text`: Texto de la pista
- `order`: Orden de la pista

#### Reto (Challenge)
- `id`: Identificador único
- `level`: ID del nivel al que pertenece
- `question`: Pregunta del reto
- `answer`: Respuesta correcta
- `points`: Puntos que otorga el reto

---

## 🚀 Ejemplos de Uso

### 1. Registro de Usuario
```bash
curl -X POST http://127.0.0.1:8000/api/users/users/ \
  -H "Content-Type: application/json" \
  -d '{"username": "nuevo_usuario", "password": "contraseña123"}'
```

### 2. Login
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "nuevo_usuario", "password": "contraseña123"}'
```

### 3. Obtener Ranking de Usuarios
```bash
curl -X GET http://127.0.0.1:8000/api/users/users/ranking/
```

**Respuesta esperada:**
```json
[
  {
    "username": "player1",
    "score": 1500,
    "last_score_update": "15/01/2024 10:30:00"
  },
  {
    "username": "player2",
    "score": 1200,
    "last_score_update": "20/01/2024 14:45:00"
  }
]
```

### 4. Crear Nivel (con autenticación)
```bash
curl -X POST http://127.0.0.1:8000/api/levels/levels/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu_token}" \
  -d '{"name": "Nivel 1", "description": "Primer nivel", "key": "nivel_1"}'
```

### 5. Actualizar Score de Usuario
```bash
curl -X PATCH http://127.0.0.1:8000/api/users/users/1/ \
  -H "Content-Type: application/json" \
  -d '{"score": 1500}'
```
