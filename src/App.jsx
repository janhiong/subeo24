import { useState, useEffect, useRef } from "react";

const WISHES = [
  {
    title: "#1 The Glow Up",
    message: "I wish you always look young and healthy. Also please get those 6 packs ASAP so I have something nice to look at. No pressure. Actually a lot of pressuree"
  },
  {
    title: "#2 The Big Brain Move",
    message: "Wish you get into your top PhD choice. Californiaa is waiting for youuu."
  },
  {
    title: "#3 The American Dream",
    message: "Wish you pass H1B this year!! The US better recognize what a gem you are, or so help me I will write a strongly worded letter to USCIS."
  },
  {
    title: "#4 Get Rich Please",
    message: "Wish you make SO much money. Not for you though : ) specifically so you can buy me good food. Think of yourself as my personal meal fund. Invest wisely."
  },
  {
    title: "#5nal The Real One",
    message: "Okay but forreal... I wish you everything. Health, happiness, success, good hair days, fast WiFi, and me. Always me. Happy birthday Subeo!!"
  }
];

// Put your images in the /public/Assets/ folder of your React project
// Then reference them starting with /Assets/filename.jpg
// ⚠️ HEIC files won't work in browsers — convert IMG_0845 and IMG_0864 to JPG first!
const FACES = [
  "/Assets/att.8gysL4k_mNTgGXF8SCRjtD371O-kMkebz3G43pGb8_A.JPG",
  "/Assets/att.APXwGgyuBIrxYGOsdprPEaYLIjFS40cHZK1fuf1g7aI 2.jpg",
  "/Assets/att.gYvQ1XNbHzcY1JdUCtVNBTaFu3qpmsqfdYCWgsfN9os.JPG",
  "/Assets/att.m5yejZnjkOJgSv9nxD59QHDVomOn6qf3fkTr5Pi6IQc.JPG",
  "/Assets/att.PYGXiveG0FMfExBxjkxanBQInVw8M1vWzq6QZ0f-wwc 2.jpg",
  "/Assets/att.sQqW150WdZYU2qaietsrMtTE2l5jlovJ2IcjRHt90zc.jpg",
  "/Assets/IMG_1264.jpg",
  "/Assets/IMG_1265.jpg",
  "/Assets/IMG_1266.jpg",
];

function PulsingCake() {
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "120px",
      zIndex: 1,
      animation: "pulse 1.5s ease-in-out infinite",
      pointerEvents: "none",
      opacity: 0.2,
    }}>
      🎂
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function Face({ id, emoji, onClick }) {
  const [pos, setPos] = useState({
    x: randomBetween(5, 75),
    y: randomBetween(10, 75),
  });
  const [vel, setVel] = useState({
    vx: randomBetween(-0.03, 0.03) || 0.02,
    vy: randomBetween(-0.03, 0.03) || 0.02,
  });
  const [wobble, setWobble] = useState(0);
  const [clicked, setClicked] = useState(false);
  const posRef = useRef({ x: pos.x, y: pos.y });
  const velRef = useState({ vx: vel.vx, vy: vel.vy });
  const frameRef = useRef();

  useEffect(() => {
    let lastTime = performance.now();
    const speed = randomBetween(4, 9);

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 16, 3);
      lastTime = now;

      let { x, y } = posRef.current;
      let { vx, vy } = velRef.current;

      x += vx * speed * dt;
      y += vy * speed * dt;

      if (x <= 0 || x >= 88) vx = -vx;
      if (y <= 0 || y >= 85) vy = -vy;

      x = Math.max(0, Math.min(88, x));
      y = Math.max(0, Math.min(85, y));

      posRef.current = { x, y };
      velRef.current = { vx, vy };

      setPos({ x, y });
      setWobble((w) => w + 0.08 * dt);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
    onClick(id);
  };

  const scale = 1 + Math.sin(wobble) * 0.06;
  const rotate = Math.sin(wobble * 0.7) * 8;

  return (
    <button
      onClick={handleClick}
      style={{
        position: "absolute",
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: "clamp(120px, 16vw, 180px)",
        height: "clamp(120px, 16vw, 180px)",
        cursor: "pointer",
        userSelect: "none",
        padding: 0,
        borderRadius: "50%",
        transform: `scale(${clicked ? 1.5 : scale}) rotate(${rotate}deg)`,
        transition: clicked ? "transform 0.15s cubic-bezier(.36,2,.5,1)" : "none",
        filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.25))`,
        zIndex: 10,
        willChange: "transform",
        background: "linear-gradient(#ffe4e8, #ffe4e8) padding-box, linear-gradient(135deg, #ff69b4, #ffcc00, #4d96ff) border-box",
        border: "3px solid transparent",
      }}
      title="Click me!"
    >
      <img
        src={emoji}
        alt="Su"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          display: "block",
          border: "none",
          outline: "3px solid transparent",
        }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </button>
  );
}

function WishModal({ wish, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          borderRadius: "28px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
          transform: visible ? "scale(1) translateY(0)" : "scale(0.7) translateY(40px)",
          transition: "transform 0.35s cubic-bezier(.36,2,.5,1)",
          background: "linear-gradient(135deg, #ff69b4, #ffcc00, #4d96ff)",
          padding: "3px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>{wish.emoji}</div>
        <h2 style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: "26px",
          color: "#e8334a",
          margin: "0 0 16px",
          lineHeight: 1.2,
        }}>
          {wish.title}
        </h2>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: "17px",
          color: "#444",
          lineHeight: 1.7,
          margin: "0 0 28px",
        }}>
          {wish.message}
        </p>
        <button
          onClick={handleClose}
          style={{
            background: "#e8334a",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            padding: "12px 36px",
            fontFamily: "'Lilita One', cursive",
            fontSize: "16px",
            cursor: "pointer",
            letterSpacing: "0.5px",
          }}
        >
          Wish Accepted
        </button>
      </div>
    </div>
  );
}

const BIRTHDAY_PHRASES = [
  "Happy Birthday Suu iuuu",       // English
  "CHUC MUNG SINH NHAT Suu iuuu",  // Vietnamese
  "생일 축하해 Suu iuuu",            // Korean
  "お誕生日おめでとう Suu iuuu",     // Japanese
  "生日快乐 Suu iuuu",               // Chinese
  "Feliz Cumpleaños Suu iuuu",      // Spanish
];

function HappyBirthdayText() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % BIRTHDAY_PHRASES.length);
        setFade(true);
      }, 400);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 style={{
      fontFamily: "'Lilita One', cursive",
      fontSize: "clamp(28px, 6vw, 72px)",
      background: "linear-gradient(90deg, #e8334a, #ff9f43, #ffd93d, #6bcb77, #4d96ff, #e8334a)",
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: 0,
      lineHeight: 1.2,
      animation: "shimmer 3s linear infinite",
      opacity: fade ? 1 : 0,
      transform: fade ? "translateY(0)" : "translateY(-8px)",
      transition: "opacity 0.4s ease, transform 0.4s ease",
      minHeight: "1.3em",
    }}>
      {BIRTHDAY_PHRASES[index]}
    </h1>
  );
}

function Confetti() {
  const animals = ["🐶", "💸", "🎂", "🎓", "🌉", "📱", "🎉"];
  const pieces = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    emoji: animals[Math.floor(Math.random() * animals.length)],
    delay: `${Math.random() * 3}s`,
    duration: `${3 + Math.random() * 8}s`,
    size: `${20 + Math.random() * 20}px`,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.5; }
        }
      `}</style>
      {pieces.map((p) => (
        <div key={p.id} style={{
          position: "absolute",
          top: "-40px",
          left: p.left,
          fontSize: p.size,
          animation: `fall ${p.duration} ${p.delay} infinite linear`,
        }}>
          {p.emoji}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [openWish, setOpenWish] = useState(null);
  const [clickedFaces, setClickedFaces] = useState({});
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleFaceClick = (id) => {
    const nextIndex = (clickedFaces[id] ?? -1) + 1;
    const wishIndex = (id + nextIndex) % WISHES.length;
    setClickedFaces((prev) => ({ ...prev, [id]: nextIndex }));
    setOpenWish(WISHES[wishIndex]);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "linear-gradient(135deg, #ffe4e8, #fff0b3, #b3f0ff, #ffb3f0, #ffe4e8)",
      backgroundSize: "400% 400%",
      animation: "bgShift 8s ease infinite",
      overflow: "hidden",
      fontFamily: "sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Nunito:wght@400;700;900&display=swap" rel="stylesheet" />

      <Confetti />
      <PulsingCake />

      {/* Header */}
      <div style={{
        position: "relative",
        zIndex: 20,
        textAlign: "center",
        paddingTop: "clamp(20px, 4vh, 48px)",
        pointerEvents: "none",
      }}>
        <HappyBirthdayText />
        <style>{`
          @keyframes shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
          @keyframes bgShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>

      {/* Hint */}
      <div style={{
        position: "absolute",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 20,
        background: "rgba(0,0,0,0.65)",
        color: "#fff",
        padding: "10px 24px",
        borderRadius: "50px",
        fontFamily: "'Nunito', sans-serif",
        fontSize: "15px",
        pointerEvents: "none",
        opacity: hint ? 1 : 0,
        transition: "opacity 1s ease",
        whiteSpace: "nowrap",
      }}>
        👆 Click on the faces to unlock birthday wishes!
      </div>

      {/* Floating faces */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        {FACES.map((emoji, i) => (
          <Face key={i} id={i} emoji={emoji} onClick={handleFaceClick} />
        ))}
      </div>

      {/* Modal */}
      {openWish && (
        <WishModal wish={openWish} onClose={() => setOpenWish(null)} />
      )}
    </div>
  );
}
