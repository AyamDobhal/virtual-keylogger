const backendUrl = "http://localhost:4000/keyEvents";

let virtualKeyboardState = false;
const keyMap = new Map();
keyMap.set("elemC2", "clear");
keyMap.set("elemC1", "backspace");
keyMap.set("elemSpace", " ");

let sessionTime = new Date();
let lastClearTime = new Date();

function toggleVirtualKeyboard() {
  if (virtualKeyboardState) {
    virtualKeyboardState = false;
    return;
  }
  virtualKeyboardState = true;
}

function updateKeyMap() {
  for (let i = 0; i < 26; i++) {
    keyMap.set(`elemA${i}`, document.getElementById(`elemA${i}`).innerHTML);
    keyMap.set(`elemS${i}`, document.getElementById(`elemS${i}`).innerHTML);
  }
  for (let i = 0; i < 10; i++) {
    keyMap.set(`elemN${i}`, document.getElementById(`elemN${i}`).innerHTML);
  }
}

document.addEventListener("load", () => {
  sessionTime = new Date();
  lastClearTime = sessionTime;
  virtualKeyboardState = false;
});

document.addEventListener("click", (e) => {
  if (e.target.id === "virtualKeyboard") {
    toggleVirtualKeyboard();
    updateKeyMap();
    return;
  }
  if (!virtualKeyboardState) {
    return;
  }
  if (keyMap.has(e.target.id)) {
    if (e.target.id === "elemC2") {
      lastClearTime = new Date();
      updateKeyMap();
      return;
    }

    const newKeyEvent = {
      key: keyMap.get(e.target.id),
      timestamp: new Date(),
      lastClear: lastClearTime,
      sessionStartTime: sessionTime,
    };
    fetch(`${backendUrl}/`, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newKeyEvent),
    });
    updateKeyMap();
  }
});
