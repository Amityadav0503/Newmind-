import React, { useState, useEffect } from "react";

// BrightMind - Single-file React prototype (Tailwind CSS required in host project)
// How to use:
// 1. Create a React app (Vite / Create React App / Next.js).
// 2. Install TailwindCSS and add its directives to your CSS.
// 3. Copy this file into your src/ as BrightMind-Frontend-Prototype.jsx and import it in App.jsx.
// 4. Run the app. This prototype is UI-only and uses mock data. Hook up real APIs (AI, Spotify, backend) where noted.

export default function BrightMindFrontendPrototype() {
  const [mood, setMood] = useState(null);
  const [journal, setJournal] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);  // toggle dashboard modal

  const [entries, setEntries] = useState(() => {
    try {
      const raw = localStorage.getItem("brightmind_journal");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [chatHistory, setChatHistory] = useState([
    { from: "bot", text: "Hey — I\'m Bright, your friendly AI companion. How are you feeling today?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    localStorage.setItem("brightmind_journal", JSON.stringify(entries));
  }, [entries]);

  // Mocked rules: choose a game/audio/movie suggestion by mood
  const moodMap = {
    happy: {
      title: "Energy Builder",
      desc: "A fun rhythm tap game to celebrate your good mood!",
      music: "https://open.spotify.com/embed/track/1?si=mock",
      movie: "The Grand Budapest Hotel (Uplifting)",
    },
    sad: {
      title: "Comfort Color",
      desc: "A calming coloring activity and soothing music.",
      music: "https://open.spotify.com/embed/track/2?si=mock",
      movie: "The Pursuit of Happyness (Inspiring)",
    },
    anxious: {
      title: "Breathe Maze",
      desc: "Guided breathing with a simple gentle puzzle to ground you.",
      music: "https://open.spotify.com/embed/track/3?si=mock",
      movie: "Inside Out (Light & comforting)",
    },
    angry: {
      title: "Smash Bubbles",
      desc: "Safe, cathartic popping game to release tension.",
      music: "https://open.spotify.com/embed/track/4?si=mock",
      movie: "Mad Max: Fury Road (High-energy catharsis)",
    },
    lonely: {
      title: "Kindness Quest",
      desc: "Small anonymous tasks to connect with community and share kindness.",
      music: "https://open.spotify.com/embed/track/5?si=mock",
      movie: "Stand By Me (Friendship)",
    },
  };

  function handleSetMood(selected) {
    setMood(selected);
    // Append bot message acknowledging mood
    setChatHistory((h) => [
      ...h,
      { from: "bot", text: `Thanks for sharing — I hear you feel ${selected}. I\'ve picked an activity that might help.` },
    ]);
  }

  function saveJournal() {
    if (!journal.trim()) return;
    const entry = { id: Date.now(), text: journal.trim(), mood: mood || "unspecified", date: new Date().toISOString() };
    setEntries((e) => [entry, ...e]);
    setJournal("");
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    const userMsg = { from: "user", text: chatInput.trim() };
    setChatHistory((h) => [...h, userMsg]);
    setChatInput("");

    // Mocked AI response (replace this with real AI call)
    setTimeout(() => {
      const reply = { from: "bot", text: `I hear you. You said: \"${userMsg.text}\" — thank you for sharing. Would you like a breathing exercise or a short game?` };
      setChatHistory((h) => [...h, reply]);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: App header + Mood */}
        <div className="md:col-span-1 bg-white shadow-lg rounded-2xl p-6">
          <header className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">BM</div>
            <div>
              <h1 className="text-xl font-semibold">BrightMind</h1>
              <p className="text-sm text-gray-500">Your AI friend for calm, growth & connection</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShowDashboard(true)} className="px-3 py-2 rounded-lg bg-green-500 text-white text-sm">Open Dashboard</button>
              <button className="px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm">Profile</button>
            </div>
          </header>

          <section className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">How are you feeling?</h2>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(moodMap).map((m) => (
                <button
                  key={m}
                  onClick={() => handleSetMood(m)}
                  className={`px-3 py-2 rounded-lg shadow-sm text-sm font-medium ${mood === m ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700"}`}>
                  {m}
                </button>
              ))}
            </div>
          </section>

          <section className="mb-4">
            <h3 className="text-sm text-gray-600 mb-2">Quick Tools</h3>
            <div className="flex flex-col gap-2">
              <button className="text-left p-3 rounded-lg border hover:bg-indigo-50">5-min breathing</button>
              <button className="text-left p-3 rounded-lg border hover:bg-indigo-50">Coloring page</button>
              <button className="text-left p-3 rounded-lg border hover:bg-indigo-50">Short journaling prompt</button>
            </div>
          </section>

          <section>
            <h3 className="text-sm text-gray-600 mb-2">Journal (private)</h3>
            <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="Write a few lines..." className="w-full p-3 rounded-lg border resize-none h-24 text-sm" />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-500">Entries: {entries.length}</div>
              <div className="flex gap-2">
                <button onClick={saveJournal} className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">Save</button>
                <button onClick={() => { setJournal(""); }} className="px-3 py-1 rounded-lg border text-sm">Clear</button>
              </div>
            </div>
          </section>
        </div>

        {/* Center column: Chat + Activities */}
        <div className="md:col-span-1 bg-white shadow-lg rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Chat with Bright</h2>

          <div className="flex-1 overflow-auto mb-4 p-3 bg-indigo-50 rounded-lg" style={{ minHeight: 300 }}>
            {chatHistory.map((m, idx) => (
              <div key={idx} className={`mb-3 max-w-full ${m.from === "bot" ? "text-left" : "text-right"}`}>
                <div className={`inline-block p-3 rounded-xl ${m.from === "bot" ? "bg-white" : "bg-indigo-600 text-white"}`}>{m.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Say something..." className="flex-1 p-3 rounded-lg border" />
              <button onClick={sendChat} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Send</button>
            </div>
            <div className="text-xs text-gray-400 mt-2">Tip: Ask Bright for a quick grounding exercise.</div>
          </div>
        </div>

        {/* Right column: Suggestions (games, music, movies) */}
        <div className="md:col-span-1 bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-3">Personalized Suggestions</h2>

          {!mood && (
            <div className="text-sm text-gray-500">Pick a mood to get personalized games, music & movie picks.</div>
          )}

          {mood && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Recommended Game</h3>
                <p className="text-sm text-gray-600">{moodMap[mood].title}</p>
                <p className="text-xs text-gray-400">{moodMap[mood].desc}</p>
                <div className="mt-2">
                  {/* Simple in-place mock game: click to play */}
                  <PlayMockGame mood={mood} />
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Music to Try</h3>
                <p className="text-sm text-gray-600">Curated playlist based on your mood</p>
                <div className="mt-2">
                  <iframe title="music" src={moodMap[mood].music} width="100%" height="80" frameBorder="0" allow="autoplay; encrypted-media" />
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Movie Suggestion</h3>
                <p className="text-sm text-gray-600">{moodMap[mood].movie}</p>
                <div className="mt-2 text-xs text-gray-500">Short synopsis and why it helps: helps process emotions and feel connected.</div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="font-medium">Recent Journal Entries</h3>
            <div className="mt-2 space-y-2 max-h-48 overflow-auto">
              {entries.length === 0 && <div className="text-xs text-gray-400">No entries yet — try writing one!</div>}
              {entries.map((e) => (
                <div key={e.id} className="p-2 rounded-lg bg-indigo-50 text-sm">
                  <div className="text-xs text-gray-500">{new Date(e.date).toLocaleString()}</div>
                  <div className="mt-1">{e.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard component (modal-style)
function Dashboard({ entries, chatHistory, moodMap, onClose }) {
  const moodCounts = Object.keys(moodMap).reduce((acc, k) => { acc[k] = 0; return acc; }, {});
  entries.forEach(e => { if (moodCounts[e.mood] !== undefined) moodCounts[e.mood]++; });
  return (
    <div className=\"fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50\">
      <div className=\"w-11/12 md:w-3/4 lg:w-2/3 bg-white rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-auto\">
        <div className=\"flex items-center justify-between mb-4\">
          <h2 className=\"text-xl font-semibold\">Your Wellness Dashboard</h2>
          <div className=\"flex items-center gap-2\">
            <div className=\"text-sm text-gray-500\">Insights</div>
            <button onClick={onClose} className=\"px-3 py-1 rounded-lg border\">Close</button>
          </div>
        </div>

        <section className=\"grid grid-cols-1 md:grid-cols-3 gap-4 mb-4\">
          <div className=\"p-4 border rounded-lg\">
            <h3 className=\"font-medium\">Mood Breakdown</h3>
            <ul className=\"mt-2 text-sm text-gray-700\">
              {Object.keys(moodCounts).map(k => (
                <li key={k} className=\"flex justify-between py-1\">
                  <span className=\"capitalize\">{k}</span>
                  <span className=\"font-medium\">{moodCounts[k]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className=\"p-4 border rounded-lg\">
            <h3 className=\"font-medium\">Recent Activity</h3>
            <div className=\"mt-2 text-sm text-gray-600 max-h-40 overflow-auto\">
              <div><strong>Chats:</strong> {chatHistory.slice(-3).map((c,i)=> (<div key={i} className=\"py-1\">{c.from}: {c.text}</div>))}</div>
              <div className=\"mt-2\"><strong>Journals:</strong> {entries.slice(0,3).map(e=> (<div key={e.id} className=\"py-1\">{new Date(e.date).toLocaleDateString()}: {e.text.slice(0,60)}...</div>))}</div>
            </div>
          </div>

          <div className=\"p-4 border rounded-lg\">
            <h3 className=\"font-medium\">Streaks & Progress</h3>
            <div className=\"mt-2 text-sm text-gray-600\">
              <p>Journal streak: <strong>{calculateStreak(entries)}</strong> days</p>
              <p>Check-ins: <strong>{entries.length}</strong></p>
              <p>Completed games: <strong>--</strong> (connect game engine to track)</p>
            </div>
          </div>
        </section>

        <section className=\"mb-4\">
          <h3 className=\"font-medium mb-2\">Mood Timeline (recent)</h3>
          <div className=\"text-xs text-gray-600\">A simple timeline of your recent moods</div>
          <div className=\"mt-2 space-y-2 max-h-48 overflow-auto\">
            {entries.slice(0,10).map(e => (
              <div key={e.id} className=\"p-2 rounded-lg bg-indigo-50 text-sm\">
                <div className=\"text-xs text-gray-500\">{new Date(e.date).toLocaleString()}</div>
                <div className=\"mt-1\">{e.mood} — {e.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className=\"font-medium mb-2\">Recommendations</h3>
          <ul className=\"text-sm text-gray-700\">
            <li>Keep your journal streak going — consistency helps mood tracking.</li>
            <li>Try a grounding exercise when anxiety increases.</li>
            <li>Share an anonymous supportive message in the community once a week.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

function calculateStreak(entries){
  if(!entries || entries.length===0) return 0;
  // simple calculation: consecutive days with at least one entry (based on dates)
  const days = entries.map(e => new Date(e.date).toDateString());
  const unique = [...new Set(days)];
  // count consecutive days from today backwards
  let streak = 0;
  const today = new Date();
  for(let i=0;;i++){
    const day = new Date(today); day.setDate(today.getDate()-i);
    if(unique.includes(day.toDateString())) streak++; else break;
  }
  return streak;
}

function PlayMockGame({ mood }) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(0);
    setPlaying(false);
  }, [mood]);

  function start() {
    setPlaying(true);
    setScore(0);
    // mock score growth
    let s = 0;
    const id = setInterval(() => {
      s += Math.ceil(Math.random() * 5);
      setScore(s);
    }, 400);
    // stop after 6 seconds
    setTimeout(() => {
      clearInterval(id);
      setPlaying(false);
    }, 6000);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm">{playing ? "Playing..." : "Not playing"}</div>
        <div className="text-sm font-medium">Score: {score}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={start} className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">Play</button>
        <button onClick={() => { setScore(0); }} className="px-3 py-1 rounded-lg border text-sm">Reset</button>
      </div>
      <div className="text-xs text-gray-400 mt-2">This is a mock game. Replace with your game engine (Phaser, Unity WebGL) for production.</div>
    </div>
  );
}
