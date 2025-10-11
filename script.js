// 👇👇 Replace this with your actual Google Apps Script Web App URL
const scriptURL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

window.onload = () => {
  Object.keys(data).forEach(c => document.getElementById("country").add(new Option(c, c)));
  createDropdowns("regularSeva", ["👍Done", "❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done", "❌Not Done"], 3);
  updateDateTime();
  setInterval(updateDateTime, 1000);
};

// Live Date & Time
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent =
    now.toLocaleDateString("en-GB") + " | " + now.toLocaleTimeString();
}

// Create seva dropdowns
function createDropdowns(containerId, options, count) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "seva-group";
    const select = document.createElement("select");
    select.innerHTML = "<option value=''>-- Select --</option>";
    options.forEach(opt => select.add(new Option(opt, opt)));
    div.appendChild(select);
    container.appendChild(div);
  }
}

// 🗺️ Sample Data
const data = {
  India: {
    Gujarat: {
      PanchMahals: {
        Kalol: { Bhavanadasi: ["Kamaladasi", "Kailashdasi"], Krishnadasi: ["Jyotidasi", "Rajnidasi"] },
        Godhra: { Babudas: ["Jitendra Das", "Ashok Das"] },
        Halol: { Deepakdas: ["Kanudas", "Bhagwandas"] },
      },
    },
    Maharashtra: {},
  },
};

// Dropdown population functions
function populateStates() {
  const c = document.getElementById("country").value;
  resetSelects(["state", "district", "tahesil", "team", "teammember"]);
  if (!c) return;
  Object.keys(data[c]).forEach(s => document.getElementById("state").add(new Option(s, s)));
}
function populateDistricts() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  resetSelects(["district", "tahesil", "team", "teammember"]);
  if (!s) return;
  Object.keys(data[c][s]).forEach(d => document.getElementById("district").add(new Option(d, d)));
}
function populateTahesils() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  resetSelects(["tahesil", "team", "teammember"]);
  if (!d) return;
  Object.keys(data[c][s][d]).forEach(th => document.getElementById("tahesil").add(new Option(th, th)));
}
function populateTeams() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  resetSelects(["team", "teammember"]);
  if (!th) return;
  Object.keys(data[c][s][d][th]).forEach(team => document.getElementById("team").add(new Option(team, team)));
}
function populateMembers() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  const team = document.getElementById("team").value;
  resetSelects(["teammember"]);
  if (!team) return;
  data[c][s][d][th][team].forEach(m => document.getElementById("teammember").add(new Option(m, m)));
}
function resetSelects(ids) {
  ids.forEach(id => document.getElementById(id).innerHTML = `<option value="">-- Select ${id} --</option>`);
}

// 🧾 Add Row
function addToTable() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  const team = document.getElementById("team").value;
  const m = document.getElementById("teammember").value;
  const remark = document.getElementById("remark").value;
  const now = new Date();
  const datetime = now.toLocaleDateString("en-GB") + " " + now.toLocaleTimeString();

  if (!c || !s || !d || !th || !team || !m) {
    alert("Please fill all dropdowns!");
    return;
  }

  const regular = [...document.querySelectorAll("#regularSeva select")]
    .map(sel => sel.value)
    .filter(v => v)
    .join(" | ");
  const social = [...document.querySelectorAll("#socialSeva select")]
    .map(sel => sel.value)
    .filter(v => v)
    .join(" | ");

  const row = document.getElementById("reportTable").querySelector("tbody").insertRow();
  [datetime, c, s, d, th, team, m, remark, regular, social].forEach(val => row.insertCell().textContent = val);

  saveToGoogleSheet(datetime, c, s, d, th, team, m, remark, regular, social);
  document.getElementById("reportForm").reset();
  createDropdowns("regularSeva", ["👍", "❌"], 3);
  createDropdowns("socialSeva", ["✅", "❌"], 3);
}

// ☁️ Save data to Google Sheet
function saveToGoogleSheet(datetime, c, s, d, th, team, m, remark, regular, social) {
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      datetime,
      country: c,
      state: s,
      district: d,
      tahesil: th,
      team,
      teammember: m,
      remark,
      regular,
      social,
    }),
  })
    .then(res => res.text())
    .then(msg => console.log("Saved:", msg))
    .catch(err => console.error("Error:", err));
}

// 📤 Export Table as CSV
function exportCSV() {
  let table = document.getElementById("reportTable");
  let rows = [...table.rows].map(r => [...r.cells].map(c => c.textContent));
  let csv = rows.map(r => r.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "TeamSevaReport.csv";
  a.click();
}

// 💾 Save Whole Table to Google Sheet
function saveTableToSheet() {
  let rows = [...document.querySelectorAll("#reportTable tbody tr")];
  rows.forEach(r => {
    let vals = [...r.cells].map(c => c.textContent);
    saveToGoogleSheet(...vals);
  });
  alert("🌸 Table data sent to Google Sheet!");
}
