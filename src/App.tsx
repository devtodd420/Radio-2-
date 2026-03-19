import { useState, useRef, useEffect } from “react”;

const PRESETS = [
// BBC Stations
{ id: “bbc1”, name: “BBC Radio 1”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_radio_one”, hdUrl: “”, genre: “Pop”, hd: false, verified: true },
{ id: “bbc2”, name: “BBC Radio 2”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_radio_two”, hdUrl: “”, genre: “Pop”, hd: false, verified: true },
{ id: “bbc3”, name: “BBC Radio 3”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_radio_three”, hdUrl: “”, genre: “Classical”, hd: false, verified: true },
{ id: “bbc4”, name: “BBC Radio 4”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm”, hdUrl: “”, genre: “News”, hd: false, verified: true },
{ id: “bbc5”, name: “BBC Radio 5 Live”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_radio_five_live”, hdUrl: “”, genre: “News”, hd: false, verified: true },
{ id: “bbc6”, name: “BBC Radio 6 Music”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_6music”, hdUrl: “”, genre: “Eclectic”, hd: false, verified: true },
{ id: “bbcws”, name: “BBC World Service”, url: “http://stream.live.vc.bbcmedia.co.uk/bbc_world_service”, hdUrl: “”, genre: “News”, hd: false, verified: true },
// CNN
{ id: “cnn”, name: “CNN Radio”, url: “https://tunein-tts.streamguys1.com/cnn”, hdUrl: “”, genre: “News”, hd: false, verified: true },
// Ghana Stations
{ id: “joy”, name: “Joy FM”, url: “https://s1.radio.co/s053d37282/listen”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “peace”, name: “Peace FM”, url: “https://peacefmonline.com/stream”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “citi”, name: “Citi FM”, url: “https://s5.radio.co/s81b853cf4/listen”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “adom”, name: “Adom FM”, url: “https://s1.radio.co/s97e84ccb4/listen”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “obonu”, name: “Obonu FM”, url: “https://stream.zeno.fm/yn65dp955r0uv”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “kapital”, name: “Kapital Radio”, url: “https://stream.zeno.fm/0r0xa792kwzuv”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “angel”, name: “Angel FM Ghana”, url: “https://stream.zeno.fm/q6ug4e79twzuv”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
{ id: “hot935”, name: “Hot 93.5 FM”, url: “https://stream.zeno.fm/2pms3e79twzuv”, hdUrl: “”, genre: “Ghana”, hd: false, verified: true },
];

const GENRES = [“All”, “Ghana”, “News”, “Pop”, “Rock”, “Jazz”, “Classical”, “Eclectic”, “Electronic”, “World”];

function genreColor(genre = “”) {
const map = {
Ghana: [”#006B3F”, “#FCD116”],
Pop: [”#FF6B9D”, “#FF8E53”],
Rock: [”#FF4444”, “#FF8800”],
Jazz: [”#7C3AED”, “#C084FC”],
News: [”#0EA5E9”, “#38BDF8”],
Eclectic: [”#10B981”, “#34D399”],
Classical: [”#6366F1”, “#A5B4FC”],
Electronic: [”#06B6D4”, “#67E8F9”],
World: [”#EC4899”, “#F9A8D4”],
default: [”#8B5CF6”, “#C084FC”],
};
return map[genre] || map.default;
}

function Avatar({ name, genre, size = 48 }) {
const [c1, c2] = genreColor(genre);
const letters = name?.split(” “).slice(0, 2).map(w => w[0]).join(””).toUpperCase() || “FM”;
return (
<div style={{
width: size, height: size, borderRadius: size * 0.28,
background: `linear-gradient(135deg, ${c1}, ${c2})`,
display: “flex”, alignItems: “center”, justifyContent: “center”,
flexShrink: 0, boxShadow: `0 4px 12px ${c1}55`,
}}>
<span style={{ color: “#fff”, fontSize: size * 0.32, fontWeight: 700, letterSpacing: “-0.02em” }}>{letters}</span>
</div>
);
}

function Waveform({ active }) {
return (
<div style={{ display: “flex”, alignItems: “center”, gap: 2, height: 18 }}>
{[0.6, 1, 0.75, 1, 0.5].map((h, i) => (
<div key={i} style={{
width: 3, borderRadius: 2,
background: active ? “linear-gradient(180deg, #FF6B35, #FF9A56)” : “#48484A”,
height: active ? `${h * 18}px` : “4px”,
transition: “height 0.3s ease”,
animation: active ? `wave${i} ${0.6 + i * 0.1}s ease-in-out infinite alternate` : “none”,
}} />
))}
<style>{`@keyframes wave0{from{height:4px}to{height:11px}} @keyframes wave1{from{height:6px}to{height:18px}} @keyframes wave2{from{height:5px}to{height:13px}} @keyframes wave3{from{height:4px}to{height:16px}} @keyframes wave4{from{height:3px}to{height:9px}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}} @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}} @keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
</div>
);
}

function HDToggle({ enabled, hasHd, onToggle }) {
if (!hasHd) return null;
return (
<button onClick={e => { e.stopPropagation(); onToggle(); }} style={{
background: enabled ? “linear-gradient(135deg, #00C6FF, #0072FF)” : “rgba(118,118,128,0.18)”,
border: “none”, borderRadius: 6, padding: “3px 7px”,
display: “flex”, alignItems: “center”, gap: 3,
cursor: “pointer”, flexShrink: 0, transition: “all 0.2s”,
}}>
<span style={{ fontSize: 10, fontWeight: 800, color: enabled ? “#fff” : “#636366”, letterSpacing: 0.5 }}>HD</span>
</button>
);
}

// ─── Stations Screen ───────────────────────────────────────

function StationsScreen({ stations, playingId, onPlay, onDelete, onToggleHD }) {
const [search, setSearch] = useState(””);
const [genre, setGenre] = useState(“All”);

const filtered = stations.filter(s => {
const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
const matchGenre = genre === “All” || s.genre === genre;
return matchSearch && matchGenre;
});

return (
<div style={{ flex: 1, overflowY: “auto”, paddingBottom: 90 }}>
<div style={{ padding: “12px 16px 0” }}>
<div style={{
background: “rgba(118,118,128,0.18)”, borderRadius: 12,
display: “flex”, alignItems: “center”, gap: 8, padding: “10px 14px”,
}}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round">
<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
<input value={search} onChange={e => setSearch(e.target.value)} placeholder=“Search your stations…”
style={{ background: “none”, border: “none”, outline: “none”, color: “#fff”, fontSize: 17, flex: 1, fontFamily: “inherit” }} />
{search && <button onClick={() => setSearch(””)} style={{ background: “none”, border: “none”, color: “#8E8E93”, cursor: “pointer”, padding: 0 }}>✕</button>}
</div>
</div>

```
  <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px", scrollbarWidth: "none" }}>
    {GENRES.map(g => (
      <button key={g} onClick={() => setGenre(g)} style={{
        background: genre === g ? "#FF6B35" : "rgba(118,118,128,0.18)",
        color: genre === g ? "#fff" : "#AEAEB2",
        border: "none", borderRadius: 20, padding: "6px 14px",
        fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      }}>{g}</button>
    ))}
  </div>

  {filtered.length === 0 ? (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "#48484A" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📻</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#636366", marginBottom: 6 }}>No Stations Found</div>
      <div style={{ fontSize: 14 }}>Try the Search tab to discover stations</div>
    </div>
  ) : (
    <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 2 }}>
      {filtered.map((s, i) => (
        <StationRow key={s.id} station={s} isPlaying={playingId === s.id}
          onPlay={onPlay} onDelete={onDelete} onToggleHD={onToggleHD} delay={i * 20} />
      ))}
    </div>
  )}
</div>
```

);
}

function StationRow({ station, isPlaying, onPlay, onDelete, onToggleHD, delay }) {
const [pressed, setPressed] = useState(false);
const hasHd = !!station.hdUrl;

return (
<div
onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)}
style={{
display: “flex”, alignItems: “center”, gap: 12, padding: “12px 14px”, borderRadius: 16,
background: isPlaying ? “rgba(255,107,53,0.12)” : pressed ? “rgba(255,255,255,0.06)” : “transparent”,
transition: “all 0.15s”, transform: pressed ? “scale(0.985)” : “scale(1)”,
cursor: “pointer”, animation: `slideUp 0.35s ${delay}ms both ease-out`,
}}
>
<Avatar name={station.name} genre={station.genre} />
<div style={{ flex: 1, minWidth: 0 }} onClick={() => onPlay(station)}>
<div style={{ display: “flex”, alignItems: “center”, gap: 6, marginBottom: 2 }}>
<div style={{ fontSize: 16, fontWeight: 600, color: isPlaying ? “#FF6B35” : “#fff”, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>
{station.name}
</div>
{station.verified && (
<svg width=“13” height=“13” viewBox=“0 0 24 24” fill=”#0EA5E9” style={{ flexShrink: 0 }}>
<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>
)}
{station.hd && hasHd && (
<div style={{ background: “linear-gradient(135deg,#00C6FF,#0072FF)”, borderRadius: 5, padding: “1px 5px”, flexShrink: 0 }}>
<span style={{ fontSize: 9, fontWeight: 800, color: “#fff” }}>HD</span>
</div>
)}
</div>
<div style={{ fontSize: 12, color: “#8E8E93”, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>
<span style={{ color: “#636366”, marginRight: 6 }}>{station.genre} ·</span>
{station.hd && hasHd ? “Lossless stream” : “Standard stream”}
</div>
</div>

```
  <HDToggle enabled={station.hd} hasHd={hasHd} onToggle={() => onToggleHD(station.id)} />

  {isPlaying ? <Waveform active={true} /> : (
    <button onClick={() => onPlay(station)} style={{
      width: 34, height: 34, borderRadius: "50%",
      background: "rgba(255,107,53,0.15)", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", flexShrink: 0,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B35"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    </button>
  )}

  <button onClick={() => onDelete(station.id)} style={{
    width: 28, height: 28, borderRadius: "50%", background: "rgba(255,69,58,0.12)", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
  }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF453A" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </button>
</div>
```

);
}

// ─── Search / Discover Screen ──────────────────────────────

function SearchScreen({ onAdd, existingIds }) {
const [query, setQuery] = useState(””);
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(””);
const [added, setAdded] = useState({});
const [activeTab, setActiveTab] = useState(“featured”);

const FEATURED = [
{ label: “🇬🇭 Ghana”, query: “ghana” },
{ label: “📰 BBC”, query: “bbc” },
{ label: “📺 CNN”, query: “cnn” },
{ label: “🎵 Jazz”, query: “jazz” },
{ label: “🎸 Rock”, query: “rock” },
{ label: “🌍 Africa”, query: “africa” },
{ label: “🎶 Classical”, query: “classical” },
{ label: “💃 Afrobeats”, query: “afrobeats” },
];

async function searchStations(q) {
if (!q.trim()) return;
setLoading(true); setError(””); setResults([]);
try {
const res = await fetch(
`https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(q)}&limit=30&order=votes&reverse=true&hidebroken=true`
);
const data = await res.json();
// Filter out stations with no stream URL
const clean = data.filter(s => s.url_resolved || s.url);
setResults(clean);
if (clean.length === 0) setError(“No stations found. Try a different search.”);
} catch {
setError(“Could not connect to station directory. Check your internet.”);
}
setLoading(false);
}

function handleAdd(s) {
const station = {
name: s.name?.trim() || “Unknown Station”,
url: s.url_resolved || s.url,
hdUrl: “”,
genre: s.tags?.split(”,”)[0] || s.country || “World”,
hd: false,
verified: s.votes > 50,
};
onAdd([station]);
setAdded(prev => ({ …prev, [s.stationuuid]: true }));
}

return (
<div style={{ flex: 1, overflowY: “auto”, paddingBottom: 90 }}>
<div style={{ padding: “0 16px” }}>
{/* Search bar */}
<div style={{
background: “rgba(118,118,128,0.18)”, borderRadius: 12,
display: “flex”, alignItems: “center”, gap: 8, padding: “10px 14px”, marginBottom: 16,
}}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round">
<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
<input
value={query} onChange={e => setQuery(e.target.value)}
onKeyDown={e => e.key === “Enter” && searchStations(query)}
placeholder=“Search 30,000+ stations worldwide…”
style={{ background: “none”, border: “none”, outline: “none”, color: “#fff”, fontSize: 16, flex: 1, fontFamily: “inherit” }}
/>
{query ? (
<button onClick={() => { setQuery(””); setResults([]); }} style={{ background: “none”, border: “none”, color: “#8E8E93”, cursor: “pointer”, padding: 0 }}>✕</button>
) : null}
</div>

```
    <button onClick={() => searchStations(query)} style={{
      width: "100%", background: query.trim() ? "linear-gradient(135deg,#FF6B35,#FF9A56)" : "rgba(118,118,128,0.18)",
      color: query.trim() ? "#fff" : "#48484A",
      border: "none", borderRadius: 12, padding: "13px",
      fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      marginBottom: 20, transition: "all 0.2s",
    }}>
      {loading ? "Searching…" : "Search Stations"}
    </button>

    {/* Quick search chips */}
    {results.length === 0 && !loading && (
      <>
        <div style={{ fontSize: 13, color: "#636366", fontWeight: 600, letterSpacing: 0.3, marginBottom: 12 }}>QUICK SEARCH</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {FEATURED.map(f => (
            <button key={f.query} onClick={() => { setQuery(f.query); searchStations(f.query); }} style={{
              background: "rgba(118,118,128,0.18)", border: "none", borderRadius: 20,
              padding: "8px 16px", color: "#fff", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Info card */}
        <div style={{
          background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: 14, padding: "16px",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9", marginBottom: 6 }}>📡 Powered by Radio Browser</div>
          <div style={{ fontSize: 12, color: "#636366", lineHeight: 1.6 }}>
            Search over 30,000 verified radio stations worldwide. Stream URLs are automatically detected — no manual entry needed.
          </div>
        </div>
      </>
    )}

    {/* Loading */}
    {loading && (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,107,53,0.2)", borderTop: "3px solid #FF6B35", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <div style={{ color: "#636366", fontSize: 14 }}>Searching stations…</div>
      </div>
    )}

    {/* Error */}
    {error && (
      <div style={{ background: "rgba(255,69,58,0.1)", borderRadius: 12, padding: "14px", color: "#FF453A", fontSize: 14, textAlign: "center" }}>
        {error}
      </div>
    )}

    {/* Results */}
    {results.length > 0 && (
      <>
        <div style={{ fontSize: 13, color: "#636366", fontWeight: 600, letterSpacing: 0.3, marginBottom: 12 }}>
          {results.length} STATIONS FOUND
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {results.map((s, i) => {
            const isAdded = added[s.stationuuid];
            const alreadyIn = existingIds.includes(s.url_resolved || s.url);
            return (
              <div key={s.stationuuid} style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 14,
                padding: "14px", display: "flex", alignItems: "center", gap: 12,
                animation: `fadeIn 0.3s ${i * 20}ms both`,
                border: isAdded ? "1px solid rgba(48,209,88,0.3)" : "1px solid transparent",
              }}>
                <Avatar name={s.name} genre={s.tags?.split(",")[0] || "World"} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#636366", display: "flex", gap: 8 }}>
                    {s.country && <span>🌍 {s.country}</span>}
                    {s.codec && <span>· {s.codec}</span>}
                    {s.bitrate > 0 && <span>· {s.bitrate}kbps</span>}
                    {s.votes > 50 && (
                      <span style={{ color: "#0EA5E9" }}>· ✓ Verified</span>
                    )}
                  </div>
                </div>
                <button onClick={() => !alreadyIn && !isAdded && handleAdd(s)} style={{
                  width: 34, height: 34, borderRadius: "50%", border: "none",
                  background: isAdded || alreadyIn ? "rgba(48,209,88,0.15)" : "rgba(255,107,53,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: isAdded || alreadyIn ? "default" : "pointer", flexShrink: 0,
                  transition: "all 0.2s",
                }}>
                  {isAdded || alreadyIn ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#30D158"><path d="M20 6L9 17l-5-5"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </>
    )}
  </div>
</div>
```

);
}

// ─── Import Screen ─────────────────────────────────────────

function ImportScreen({ onAdd }) {
const [name, setName] = useState(””);
const [url, setUrl] = useState(””);
const [hdUrl, setHdUrl] = useState(””);
const [genre, setGenre] = useState(“Pop”);
const [added, setAdded] = useState(false);

function handleAdd() {
if (!url.trim()) return;
let finalUrl = url.trim();
if (!/^https?:///i.test(finalUrl)) finalUrl = “http://” + finalUrl;
let finalHdUrl = hdUrl.trim();
if (finalHdUrl && !/^https?:///i.test(finalHdUrl)) finalHdUrl = “http://” + finalHdUrl;
onAdd([{ name: name.trim() || urlToName(finalUrl), url: finalUrl, hdUrl: finalHdUrl, genre, hd: false }]);
setName(””); setUrl(””); setHdUrl(””); setGenre(“Pop”);
setAdded(true); setTimeout(() => setAdded(false), 1800);
}

function urlToName(u) {
try { return new URL(u).hostname.replace(/^www./, “”).split(”.”)[0]; } catch { return “Station”; }
}

return (
<div style={{ flex: 1, overflowY: “auto”, paddingBottom: 90 }}>
<div style={{ padding: “0 16px”, display: “flex”, flexDirection: “column”, gap: 14 }}>
<InputField label="Stream URL" value={url} onChange={setUrl} placeholder="https://stream.example.com/live.mp3" type="url" />

```
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#8E8E93", fontWeight: 600, letterSpacing: 0.3 }}>HD / LOSSLESS URL</div>
        <div style={{ background: "linear-gradient(135deg,#00C6FF,#0072FF)", borderRadius: 5, padding: "2px 6px" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: "#fff" }}>HD</span>
        </div>
        <div style={{ fontSize: 11, color: "#48484A" }}>optional</div>
      </div>
      <input type="url" value={hdUrl} onChange={e => setHdUrl(e.target.value)}
        placeholder="https://stream.example.com/flac"
        style={{ width: "100%", background: "rgba(0,198,255,0.06)", border: "1px solid rgba(0,198,255,0.2)", borderRadius: 12, padding: "14px", color: "#fff", fontFamily: "inherit", fontSize: 16, outline: "none", boxSizing: "border-box" }} />
      <div style={{ fontSize: 11, color: "#48484A", marginTop: 6 }}>Add a FLAC or AAC-320 URL for lossless quality.</div>
    </div>

    <InputField label="Station Name" value={name} onChange={setName} placeholder="My Station (optional)" />

    <div>
      <div style={{ fontSize: 13, color: "#8E8E93", marginBottom: 8, fontWeight: 600, letterSpacing: 0.3 }}>GENRE</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {GENRES.filter(g => g !== "All").map(g => (
          <button key={g} onClick={() => setGenre(g)} style={{
            padding: "7px 14px", borderRadius: 20,
            background: genre === g ? "#FF6B35" : "rgba(118,118,128,0.18)",
            color: genre === g ? "#fff" : "#AEAEB2",
            border: "none", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
          }}>{g}</button>
        ))}
      </div>
    </div>

    <button onClick={handleAdd} style={{
      background: url.trim() ? "linear-gradient(135deg,#FF6B35,#FF9A56)" : "rgba(118,118,128,0.18)",
      color: url.trim() ? "#fff" : "#48484A",
      border: "none", borderRadius: 14, padding: "16px",
      fontSize: 17, fontWeight: 700, cursor: url.trim() ? "pointer" : "default",
      fontFamily: "inherit", marginTop: 8, transition: "all 0.2s",
    }}>
      {added ? "✓ Added!" : "Add Station"}
    </button>
  </div>
</div>
```

);
}

function InputField({ label, value, onChange, placeholder, type = “text” }) {
return (
<div>
{label && <div style={{ fontSize: 13, color: “#8E8E93”, marginBottom: 8, fontWeight: 600, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>}
<input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
style={{ width: “100%”, background: “rgba(118,118,128,0.12)”, border: “1px solid rgba(255,255,255,0.08)”, borderRadius: 12, padding: “14px”, color: “#fff”, fontFamily: “inherit”, fontSize: 16, outline: “none”, boxSizing: “border-box” }} />
</div>
);
}

// ─── Now Playing Screen ────────────────────────────────────

function NowPlayingScreen({ station, isPlaying, volume, onVolumeChange, onStop, onToggleHD }) {
if (!station) return (
<div style={{ flex: 1, display: “flex”, flexDirection: “column”, alignItems: “center”, justifyContent: “center”, color: “#48484A”, gap: 12, paddingBottom: 90 }}>
<div style={{ fontSize: 72, opacity: 0.3 }}>📻</div>
<div style={{ fontSize: 17, fontWeight: 600, color: “#636366” }}>Nothing Playing</div>
<div style={{ fontSize: 14 }}>Select a station to begin</div>
</div>
);

const [c1, c2] = genreColor(station.genre);
const hasHd = !!station.hdUrl;

return (
<div style={{ flex: 1, display: “flex”, flexDirection: “column”, alignItems: “center”, padding: “24px 32px 100px”, gap: 24, overflowY: “auto” }}>
<div style={{
width: 200, height: 200, borderRadius: 200 * 0.28,
background: `linear-gradient(135deg, ${c1}, ${c2})`,
display: “flex”, alignItems: “center”, justifyContent: “center”,
boxShadow: `0 24px 64px ${c1}66`,
animation: isPlaying ? “float 4s ease-in-out infinite” : “none”,
position: “relative”, flexShrink: 0,
}}>
<span style={{ color: “#fff”, fontSize: 64, fontWeight: 800 }}>
{station.name.split(” “).slice(0, 2).map(w => w[0]).join(””).toUpperCase()}
</span>
{station.hd && hasHd && (
<div style={{ position: “absolute”, top: 10, right: 10, background: “linear-gradient(135deg,#00C6FF,#0072FF)”, borderRadius: 8, padding: “4px 8px”, boxShadow: “0 2px 8px rgba(0,114,255,0.5)” }}>
<span style={{ fontSize: 11, fontWeight: 800, color: “#fff” }}>HD</span>
</div>
)}
</div>

```
  <div style={{ textAlign: "center", width: "100%" }}>
    <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{station.name}</div>
    <div style={{ fontSize: 14, color: "#8E8E93" }}>{station.genre}</div>
    <div style={{ fontSize: 12, color: "#48484A", marginTop: 4 }}>
      {station.hd && hasHd ? "🎵 Lossless / HD Stream" : "Standard Stream"}
    </div>
  </div>

  {hasHd && (
    <button onClick={() => onToggleHD(station.id)} style={{
      background: station.hd ? "linear-gradient(135deg,#00C6FF,#0072FF)" : "rgba(118,118,128,0.18)",
      border: "none", borderRadius: 20, padding: "10px 24px",
      cursor: "pointer", transition: "all 0.2s",
      boxShadow: station.hd ? "0 4px 16px rgba(0,114,255,0.35)" : "none",
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: station.hd ? "#fff" : "#636366" }}>
        {station.hd ? "✓ HD Lossless ON" : "Enable HD Lossless"}
      </span>
    </button>
  )}

  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 8, height: 8, borderRadius: "50%", background: isPlaying ? "#30D158" : "#48484A", animation: isPlaying ? "pulseDot 1.5s infinite" : "none" }} />
    <span style={{ fontSize: 14, color: isPlaying ? "#30D158" : "#48484A", fontWeight: 600 }}>{isPlaying ? "LIVE" : "PAUSED"}</span>
    <Waveform active={isPlaying} />
  </div>

  <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 12 }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>
    <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => onVolumeChange(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#FF6B35" }} />
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
  </div>

  <button onClick={onStop} style={{
    width: 72, height: 72, borderRadius: "50%",
    background: "rgba(255,69,58,0.14)", border: "2px solid rgba(255,69,58,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF453A"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
  </button>
</div>
```

);
}

// ─── Main App ───────────────────────────────────────────────

export default function App() {
const [stations, setStations] = useState(() => {
try { return JSON.parse(localStorage.getItem(“fm_stations_v2”) || “null”) || PRESETS; } catch { return PRESETS; }
});
const [playingId, setPlayingId] = useState(null);
const [tab, setTab] = useState(“stations”);
const [volume, setVolume] = useState(0.8);
const audioRef = useRef(null);

const playingStation = stations.find(s => s.id === playingId) || null;
const existingUrls = stations.map(s => s.url);

useEffect(() => {
try { localStorage.setItem(“fm_stations_v2”, JSON.stringify(stations)); } catch {}
}, [stations]);

useEffect(() => {
if (audioRef.current) audioRef.current.volume = volume;
}, [volume]);

function getStreamUrl(station) {
return station.hd && station.hdUrl ? station.hdUrl : station.url;
}

function play(station) {
if (!audioRef.current) return;
if (playingId === station.id) { stop(); return; }
audioRef.current.src = getStreamUrl(station);
audioRef.current.play().catch(() => {});
setPlayingId(station.id);
setTab(“now”);
}

function stop() {
if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = “”; }
setPlayingId(null);
}

function toggleHD(id) {
setStations(prev => prev.map(s => {
if (s.id !== id) return s;
const next = { …s, hd: !s.hd };
if (playingId === id && audioRef.current) {
audioRef.current.src = next.hd && next.hdUrl ? next.hdUrl : next.url;
audioRef.current.play().catch(() => {});
}
return next;
}));
}

function addStations(newOnes) {
setStations(prev => […newOnes.map(s => ({ …s, id: Date.now() + Math.random() })), …prev]);
}

function deleteStation(id) {
if (playingId === id) stop();
setStations(prev => prev.filter(s => s.id !== id));
}

const tabs = [
{
id: “stations”, label: “Stations”,
icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
},
{
id: “search”, label: “Discover”,
icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
},
{
id: “import”, label: “Manual”,
icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
},
{
id: “now”, label: “Now Playing”,
icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
},
];

const pageTitles = { stations: “My Stations”, search: “Discover”, import: “Manual Import”, now: “Now Playing” };

return (
<div style={{
width: 390, height: 844, maxHeight: “100vh”,
background: “#000”, borderRadius: 48,
display: “flex”, flexDirection: “column”,
fontFamily: “-apple-system, ‘SF Pro Display’, ‘SF Pro Text’, sans-serif”,
overflow: “hidden”, position: “relative”,
boxShadow: “0 40px 120px rgba(0,0,0,0.8)”, margin: “auto”,
}}>
{/* Status bar */}
<div style={{ height: 50, display: “flex”, alignItems: “center”, justifyContent: “space-between”, padding: “0 24px 0 28px”, flexShrink: 0 }}>
<span style={{ color: “#fff”, fontSize: 15, fontWeight: 700 }}>9:41</span>
<div style={{ display: “flex”, gap: 6, alignItems: “center” }}>
<svg width="16" height="12" viewBox="0 0 16 12" fill="#fff"><rect x="0" y="3" width="3" height="9" rx="0.5"/><rect x="4.5" y="2" width="3" height="10" rx="0.5"/><rect x="9" y="0" width="3" height="12" rx="0.5"/></svg>
<svg width="16" height="12" viewBox="0 0 24 16" fill="#fff"><path d="M12 3.5C7.5 3.5 3.7 5.4 1 8.4l2.1 2.1C5.3 8 8.5 6.5 12 6.5s6.7 1.5 8.9 4l2.1-2.1C20.3 5.4 16.5 3.5 12 3.5zm0 5c-2.8 0-5.3 1.1-7.2 2.9L7 13.5c1.3-1.3 3.1-2 5-2s3.7.7 5 2l2.2-2.1C17.3 9.6 14.8 8.5 12 8.5zm0 5c-1.1 0-2.1.4-2.8 1.1L12 17l2.8-2.4c-.7-.7-1.7-1.1-2.8-1.1z"/></svg>
<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#fff" strokeOpacity="0.35"/><rect x="1.5" y="1.5" width="19" height="9" rx="2.5" fill="#fff"/><path d="M23 4.5v3a1.5 1.5 0 0 0 0-3z" fill="#fff" fillOpacity="0.4"/></svg>
</div>
</div>

```
  {/* Nav title */}
  <div style={{ padding: "0 22px 12px", flexShrink: 0 }}>
    <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>{pageTitles[tab]}</div>
    {tab === "stations" && <div style={{ fontSize: 13, color: "#636366", marginTop: 2 }}>{stations.length} station{stations.length !== 1 ? "s" : ""}</div>}
  </div>

  {/* Screen */}
  <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
    {tab === "stations" && <StationsScreen stations={stations} playingId={playingId} onPlay={play} onDelete={deleteStation} onToggleHD={toggleHD} />}
    {tab === "search" && <SearchScreen onAdd={addStations} existingIds={existingUrls} />}
    {tab === "import" && <ImportScreen onAdd={addStations} />}
    {tab === "now" && <NowPlayingScreen station={playingStation} isPlaying={!!playingId} volume={volume} onVolumeChange={setVolume} onStop={stop} onToggleHD={toggleHD} />}
  </div>

  {/* Tab bar */}
  <div style={{
    height: 82, background: "rgba(22,22,23,0.94)",
    backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex", alignItems: "flex-start", paddingTop: 10, flexShrink: 0,
  }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => setTab(t.id)} style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer",
        color: tab === t.id ? "#FF6B35" : "#636366", transition: "color 0.2s",
      }}>
        <div style={{ position: "relative" }}>
          {t.icon}
          {t.id === "now" && playingId && (
            <div style={{ position: "absolute", top: -2, right: -4, width: 8, height: 8, borderRadius: "50%", background: "#FF6B35", border: "2px solid #161617" }} />
          )}
        </div>
        <span style={{ fontSize: 10, fontWeight: tab === t.id ? 600 : 400 }}>{t.label}</span>
      </button>
    ))}
  </div>

  <audio ref={audioRef} />
</div>
```

);
}
