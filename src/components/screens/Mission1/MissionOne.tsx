import React, { useEffect, useRef, useState } from "react";
import bg1Src from "../../../assets/background_mision1.png";
import bg2Src from "../../../assets/background_mision2.png";
import bg3Src from "../../../assets/background_mision3.png";
import jugador from "../../../assets/robot.png";

/** =========================
 *  Configuración de la API
 *  ========================= */
const BASE_URL =
  (import.meta as any)?.env?.VITE_API_BASE_URL ?? "http://3.150.70.81:8000";
const levelUrl = (id: number) => `${BASE_URL}/api/levels/levels/${id + 1}/`;
const execUrl = (id: number) => `${BASE_URL}/api/levels/${id + 1}/execute-sql/`;

/** =========================
 *  Tipos de datos del nivel
 *  ========================= */
type Clue = {
  id: number;
  level: number;
  text: string;
  order: number;
};

type Challenge = {
  id: number;
  level: number;
  question: string;
  answer: string;
  score: number;
};

type LevelPayload = {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  instructions?: string;
  clues?: Clue[];
  challenges?: Challenge[];
};

/** =========================
 *  Helpers auxiliares
 *  ========================= */
function pickField<T extends Record<string, any>>(
  obj: T | null | undefined,
  candidates: string[],
  fallback = ""
): string {
  if (!obj) return fallback;
  for (const k of candidates) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v;
  }
  return fallback;
}

const PlayerXYCanvasWithQuiz: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /** Entrada */
  const keysRef = useRef({ left: false, right: false, up: false, down: false });
  const setLeft = (v: boolean) => (keysRef.current.left = v);
  const setRight = (v: boolean) => (keysRef.current.right = v);
  const setUp = (v: boolean) => (keysRef.current.up = v);
  const setDown = (v: boolean) => (keysRef.current.down = v);

  /** Animación */
  const rafRef = useRef<number | null>(null);
  const prevTsRef = useRef<number | null>(null);

  /** Fondos (secuenciales, sin repetir) */
  const bgImgsRef = useRef<HTMLImageElement[]>([]);
  const scaledWidthsRef = useRef<number[]>([]);
  const totalTrackWRef = useRef<number>(0);
  const bgsLoadedRef = useRef(false);

  /** Mundo y jugador */
  const worldOffsetRef = useRef(0);
  const playerImgRef = useRef<HTMLImageElement | null>(null);
  const playerLoadedRef = useRef(false);
  const playerHeightRef = useRef<number>(600);
  const playerYRef = useRef<number | null>(null);
  const facingRightRef = useRef<boolean>(true);

  /** Velocidades */
  const moveSpeedXRef = useRef<number>(300);
  const moveSpeedYRef = useRef<number>(300);

  /** Estado del Quiz (dinámico por nivel) */
  const [quizOpen, setQuizOpen] = useState(false);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  const [levelData, setLevelData] = useState<LevelPayload | null>(null);
  const [answerSQL, setAnswerSQL] = useState("");
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  /** Fix de caret (cursor) en textarea para evitar saltos al inicio */
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const caretStartRef = useRef<number | null>(null);
  const caretEndRef = useRef<number | null>(null);

  /** Disparadores para no reabrir el mismo nivel múltiples veces */
  const firedLevel1 = useRef(false);
  const firedLevel2 = useRef(false);
  const firedLevel3 = useRef(false);

  /** Pausa del juego cuando el modal está abierto */
  const gamePausedRef = useRef(false);

  /** ------- Helpers de API ------- */
  const buildHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("auth_token");
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const fetchLevel = async (levelId: number) => {
    setQuizLoading(true);
    setQuizError(null);
    try {
      const res = await fetch(levelUrl(levelId), { headers: buildHeaders() });
      if (!res.ok)
        throw new Error(
          `No se pudo obtener el nivel ${levelId - 1} (${res.status})`
        );
      const data = (await res.json()) as LevelPayload;
      // console.log("Nivel recibido:", data);
      setLevelData(data);
    } catch (err: any) {
      setQuizError(err?.message || "Error cargando el nivel.");
    } finally {
      setQuizLoading(false);
    }
  };

  const executeSQL = async (levelId: number, sql: string) => {
    setQuizLoading(true);
    setQuizError(null);
    setQuizFeedback(null);
    try {
      const res = await fetch(execUrl(levelId), {
        method: "POST",
        headers: buildHeaders(),
        body: JSON.stringify({ sql }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || data?.detail || `Error al validar (${res.status})`
        );
      }

      const ok = data?.ok ?? data?.success ?? false;
      const msg =
        data?.message || (ok ? "✅ ¡Correcto!" : "⚠️ Revisa tu consulta.");
      setQuizFeedback(msg);

      if (ok) {
        setTimeout(() => {
          setQuizOpen(false);
          setLevelData(null);
          setAnswerSQL("");
          gamePausedRef.current = false;
          setQuizFeedback(null);
        }, 900);
      }
    } catch (err: any) {
      setQuizError(err?.message || "No se pudo validar la consulta.");
    } finally {
      setQuizLoading(false);
    }
  };

  /** Recalcular escalados para fondos */
  const recalcScaled = () => {
    const canvas = canvasRef.current;
    if (!canvas || !bgsLoadedRef.current) return;
    const H = canvas.clientHeight || window.innerHeight;
    const imgs = bgImgsRef.current;
    const scaled = imgs.map(
      (img) => img.naturalWidth * (H / img.naturalHeight)
    );
    scaledWidthsRef.current = scaled;
    totalTrackWRef.current = scaled.reduce((a, b) => a + b, 0);
  };

  /** Carga de imágenes */
  useEffect(() => {
    const sources = [bg1Src, bg2Src, bg3Src];
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;

    sources.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imgs[i] = img;
        loaded += 1;
        if (loaded === sources.length) {
          bgImgsRef.current = imgs;
          bgsLoadedRef.current = true;
          recalcScaled();
        }
      };
    });

    const p = new Image();
    p.src = jugador;
    p.onload = () => {
      playerImgRef.current = p;
      playerLoadedRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Bucle de animación y entrada */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);

      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      recalcScaled();

      if (playerYRef.current === null) {
        playerYRef.current = canvas.clientHeight / 2;
      } else {
        const H = canvas.clientHeight;
        playerYRef.current = Math.max(0, Math.min(playerYRef.current, H));
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Teclado
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!quizOpen) {
        if (k === "arrowleft" || k === "a") setLeft(true);
        if (k === "arrowright" || k === "d") setRight(true);
        if (k === "arrowup" || k === "w") setUp(true);
        if (k === "arrowdown" || k === "s") setDown(true);
      }
      if (k === "enter" && quizOpen && currentLevelId) {
        executeSQL(currentLevelId, answerSQL);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") setLeft(false);
      if (k === "arrowright" || k === "d") setRight(false);
      if (k === "arrowup" || k === "w") setUp(false);
      if (k === "arrowdown" || k === "s") setDown(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Dibuja fondos en secuencia (sin repetir)
    const drawBackgroundOnce = () => {
      if (!bgsLoadedRef.current) return;
      const imgs = bgImgsRef.current;
      const scaledWidths = scaledWidthsRef.current;

      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const offset = worldOffsetRef.current;

      let accX = 0;
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        const w = scaledWidths[i] || 0;
        const drawX = accX - offset;

        if (drawX + w >= 0 && drawX <= W) {
          ctx.drawImage(img, drawX, 0, w, H);
        }
        accX += w;
      }
    };

    // Dibuja al jugador (incluye flip horizontal según dirección)
    const drawPlayer = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      const targetH = playerHeightRef.current;
      const halfH = targetH / 2;

      if (playerYRef.current === null) playerYRef.current = H / 2;
      playerYRef.current = Math.max(
        halfH,
        Math.min(H - halfH, playerYRef.current)
      );

      const img = playerImgRef.current;
      const ratio =
        img && playerLoadedRef.current
          ? img.naturalWidth / img.naturalHeight
          : 1;

      const targetW = targetH * ratio;
      const y = (playerYRef.current ?? H / 2) - halfH;

      ctx.save();
      if (img && playerLoadedRef.current) {
        if (facingRightRef.current) {
          const x = W / 2 - targetW / 2;
          ctx.drawImage(img, x, y, targetW, targetH);
        } else {
          // flip horizontal
          ctx.translate(W / 2 + targetW / 2, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, y, targetW, targetH);
        }
      } else {
        const x = W / 2 - targetH / 2;
        ctx.fillStyle = "#00E5FF";
        ctx.fillRect(x, y, targetH, targetH);
      }
      ctx.restore();
    };

    // Loop principal
    const loop = (ts: number) => {
      const prev = prevTsRef.current ?? ts;
      const dt = (ts - prev) / 1000;
      prevTsRef.current = ts;

      const W = canvas.clientWidth;
      const H = canvas.clientHeight;

      if (!gamePausedRef.current) {
        if (keysRef.current.left) {
          worldOffsetRef.current -= moveSpeedXRef.current * dt;
          facingRightRef.current = false;
        }
        if (keysRef.current.right) {
          worldOffsetRef.current += moveSpeedXRef.current * dt;
          facingRightRef.current = true;
        }

        // Clamp del offset (mundo finito)
        const total = totalTrackWRef.current || 0;
        const maxOffset = Math.max(0, total - W);
        worldOffsetRef.current = Math.max(
          0,
          Math.min(worldOffsetRef.current, maxOffset)
        );

        // Movimiento vertical
        if (keysRef.current.up)
          playerYRef.current =
            (playerYRef.current ?? H / 2) - moveSpeedYRef.current * dt;
        if (keysRef.current.down)
          playerYRef.current =
            (playerYRef.current ?? H / 2) + moveSpeedYRef.current * dt;

        // === Disparadores de niveles ===
        const firstBgWidth = scaledWidthsRef.current[0] || 0;

        // Nivel 1: después de 10px
        if (!firedLevel1.current && worldOffsetRef.current >= 10) {
          firedLevel1.current = true;
          openQuiz(0);
        }

        // Nivel 2: 10% del primer fondo
        if (
          !firedLevel2.current &&
          worldOffsetRef.current >= firstBgWidth * 0.1
        ) {
          firedLevel2.current = true;
          openQuiz(1);
        }

        // Nivel 3: 20% del primer fondo
        if (
          !firedLevel3.current &&
          worldOffsetRef.current >= firstBgWidth * 0.2
        ) {
          firedLevel3.current = true;
          openQuiz(2);
        }
      }

      // Render
      ctx.clearRect(0, 0, W, H);
      drawBackgroundOnce();
      drawPlayer();

      // HUD (opcional)
      ctx.font = "14px JetBrains Mono, monospace";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(
        "Mover: ← → / A-D   ↑ ↓ / W-S   |   ENTER valida en el quiz",
        12,
        28
      );

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [quizOpen, currentLevelId, answerSQL]);

  /** Abrir modal del quiz para un levelId */
  const openQuiz = (levelId: number) => {
    setCurrentLevelId(levelId);
    setAnswerSQL("");
    setQuizFeedback(null);
    setQuizError(null);
    setQuizOpen(true);
    gamePausedRef.current = true;
    fetchLevel(levelId);
  };

  /** =========================
   *  Modal del Quiz Dinámico
   *  ========================= */
  const ModalQuiz = () => {
    if (!quizOpen) return null;

    const title = pickField(
      levelData,
      ["title", "name"],
      currentLevelId ? `Nivel ${currentLevelId}` : "Nivel"
    );
    const description = pickField(
      levelData,
      ["description", "instructions"],
      ""
    );

    const cluesSorted: Clue[] = (levelData?.clues || [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h2
            style={{ margin: 0, fontFamily: "Tiny5, sans-serif", fontSize: 28 }}
          >
            {title}
          </h2>

          {description && (
            <p style={{ marginTop: 8, opacity: 0.9 }}>{description}</p>
          )}

          <div style={cardStyle}>
            <strong>PISTAS:</strong>

            {cluesSorted.length === 0 ? (
              <div style={{ marginTop: 6, opacity: 0.8 }}>
                (Este nivel no tiene pistas registradas)
              </div>
            ) : (
              <ul style={{ marginTop: 8, paddingLeft: 18, lineHeight: 1.4 }}>
                {cluesSorted.map((c) => (
                  <li key={c.id} style={{ marginBottom: 6 }}>
                    {c.text}
                  </li>
                ))}
              </ul>
            )}

            <textarea
              ref={textareaRef}
              autoFocus
              placeholder="Escribe aquí tu SQL..."
              value={answerSQL}
              onChange={(e) => {
                // Guardamos la posición del caret antes del setState
                const el = e.currentTarget;
                caretStartRef.current = el.selectionStart ?? null;
                caretEndRef.current = el.selectionEnd ?? null;
                setAnswerSQL(e.target.value);
                // Restauramos la posición del caret después del render
                requestAnimationFrame(() => {
                  const ta = textareaRef.current;
                  if (!ta) return;
                  if (
                    caretStartRef.current !== null &&
                    caretEndRef.current !== null
                  ) {
                    try {
                      ta.setSelectionRange(
                        caretStartRef.current,
                        caretEndRef.current
                      );
                    } catch {
                      // ignore
                    }
                  }
                });
              }}
              style={{ ...inputStyle, minHeight: 120, fontSize: 14 }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  (e.ctrlKey || e.metaKey) &&
                  currentLevelId
                ) {
                  executeSQL(currentLevelId, answerSQL);
                }
              }}
            />
          </div>

          {quizLoading && (
            <div style={{ marginTop: 8, opacity: 0.8 }}>Procesando...</div>
          )}
          {quizError && (
            <div style={{ marginTop: 8, color: "#ffb4b4" }}>{quizError}</div>
          )}
          {quizFeedback && <div style={{ marginTop: 8 }}>{quizFeedback}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              style={btnPrimary}
              onClick={() =>
                currentLevelId && executeSQL(currentLevelId, answerSQL)
              }
              disabled={quizLoading || !answerSQL.trim()}
            >
              Validar
            </button>
            <button
              style={btnGhost}
              onClick={() => {
                setQuizOpen(false);
                setLevelData(null);
                setAnswerSQL("");
                setQuizFeedback(null);
                setQuizError(null);
                gamePausedRef.current = false;
              }}
            >
              Omitir
            </button>
          </div>
        </div>
      </div>
    );
  };

  /** Render principal */
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100vw",
          height: "100vh",
          background: "#000",
        }}
      />
      <ModalQuiz />
    </div>
  );
};

/** =========================
 *  Estilos del modal (inline)
 *  ========================= */
const overlayStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "grid",
  placeItems: "center",
  zIndex: 20,
  backdropFilter: "blur(2px)",
};

const modalStyle: React.CSSProperties = {
  width: "min(560px, 92vw)",
  maxHeight: "80vh",
  overflow: "auto",
  background: "linear-gradient(180deg,#072030 0%, #0a2a3f 100%)",
  color: "#E6F4F1",
  border: "1px solid rgba(173,221,255,0.25)",
  borderRadius: 16,
  boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
  padding: 16,
};

const cardStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 12,
  padding: 12,
  background: "rgba(0,0,0,0.25)",
  border: "1px solid rgba(173,221,255,0.18)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.35)",
  color: "#E6F4F1",
  fontFamily: "JetBrains Mono, monospace",
};

const btnPrimary: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #60BDFF",
  background: "linear-gradient(180deg,#00E5FF 0%, #3A7199 100%)",
  color: "#012",
  fontWeight: 700,
};

const btnGhost: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.25)",
  color: "#E6F4F1",
};

export default PlayerXYCanvasWithQuiz;
