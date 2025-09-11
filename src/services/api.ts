const BASE_URL = "http://3.150.70.81:8000";

// Helper para construir headers
function buildHeaders(includeAuth = true) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (includeAuth) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log(token);
    }
  }
  
  return headers;
}

// === Registro de usuario ===
export async function registerUser(username, password) {
  const res = await fetch(`${BASE_URL}/api/users/`, {
    method: "POST",
    headers: buildHeaders(false), // No incluir token para registro
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = {};
    }
    throw new Error(err?.detail || `Error al registrar (${res.status})`);
  }
  return res.json();
}

// === Login de usuario ===
export async function loginUser(username, password) {
  const res = await fetch(`${BASE_URL}/api/token/`, {
    method: "POST",
    headers: buildHeaders(false), // No incluir token para login
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch {
      err = {};
    }
    throw new Error(err?.detail || `Error al iniciar sesión (${res.status})`);
  }

  const data = await res.json();
  console.log("Esta es la data",data);
  console.log("Este es el token", data.access);

  // Guardar token en localStorage después de un login exitoso
  if (data.access) {
    localStorage.setItem("auth_token", data.access);
  }
  
  return data;
}

// === Ejemplo de endpoint protegido ===
export async function fetchProfile() {
  const res = await fetch(`${BASE_URL}/api/users/me/`, {
    method: "GET",
    headers: buildHeaders(true), // Incluir token para endpoints protegidos
  });

  if (!res.ok) {
    // Si hay error de autenticación, limpiar token
    if (res.status === 401) {
      localStorage.removeItem("auth_token");
    }
    throw new Error(`Error al obtener perfil (${res.status})`);
  }

  return res.json();
}