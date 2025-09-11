import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../../services/api.ts";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("auth_token", data.access);
      navigate("/audifono");
    } catch (err) {
      setErrorMsg(err.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await registerUser(username, password);
      const data = await loginUser(username, password);
      localStorage.setItem("auth_token", data.access);
      navigate("/audifono");
    } catch (err) {
      setErrorMsg(err.message || "No se pudo registrar.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = !username || !password || loading;

  return (
    <div className="min-h-screen w-screen grid place-items-center bg-[#06141d] text-white px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6"
      >
        <h1 className="text-xl font-bold mb-1">Acceso</h1>
        <p className="text-white/70 text-sm mb-6">
          Ingresa con tu usuario y contraseña.
        </p>

        <label className="block text-sm text-white/80 mb-2">Usuario</label>
        <input
          className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none focus:border-cyan-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="block text-sm text-white/80 mt-4 mb-2">
          Contraseña
        </label>
        <input
          type="password"
          className="w-full rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none focus:border-cyan-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {errorMsg && (
          <div className="mt-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-red-200 text-sm">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={disabled}
          className={`mt-6 w-full rounded-xl px-4 py-2 font-semibold ${
            disabled
              ? "bg-white/10 text-white/50 cursor-not-allowed"
              : "bg-gradient-to-b from-cyan-300 to-[#3A7199] text-black hover:brightness-105"
          }`}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={disabled}
          className="mt-3 w-full rounded-xl px-4 py-2 border border-white/20 hover:border-cyan-300/70"
        >
          {loading ? "Procesando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
};

export default Login;
