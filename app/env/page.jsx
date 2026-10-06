export default function EnvPage() {
  const envVars = Object.entries(process.env).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div style={{ fontFamily: "monospace", padding: "2rem", background: "#0f0f0f", minHeight: "100vh", color: "#e2e2e2" }}>
      <h1 style={{ color: "#4ade80", marginBottom: "1.5rem", fontSize: "1.4rem" }}>
        🔐 Environment Variables ({envVars.length})
      </h1>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {envVars.map(([key, value]) => (
          <div
            key={key}
            style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              gap: "1rem",
              background: "#1a1a1a",
              borderRadius: "6px",
              padding: "0.6rem 1rem",
              borderLeft: "3px solid #4ade80",
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{key}</span>
            <span style={{ color: "#fbbf24" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
