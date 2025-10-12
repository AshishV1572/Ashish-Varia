const scriptURL = "https://script.google.com/macros/s/AKfycby9zKNBHcTODayOKPaa6apGYgvnuCH5IGNYALvk6b9xblenDQ-SQKJDDyOHEDRA_6KgoQ/exec";

// ---------- On Load ----------
window.onload = () => {
  Object.keys(data).forEach(c => document.getElementById("country").add(new Option(c, c)));
  createDropdowns("regularSeva", ["👍Done", "❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done", "❌Not Done"], 3);
  updateDateTime();
  setInterval(updateDateTime, 1000);
};

// ---------- Date & Time ----------
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent =
    now.toLocaleDateString("en-GB") + " | " + now.toLocaleTimeString();
}

// ---------- Dropdown Data ----------
const data = {
  India: {
    Gujarat: {
      PanchMahals: {
        Kalol: {
          Bhavanadasi: ["Kamaladasi", "Kailashdasi", "Kishnadasi"],
          Krishnadasi: ["Jyotidasi", "Rajnidasi", "Kasidasi"]
        },
        Godhra: { Babudas: ["Jitendra Das", "Ashok Das"] }
      },
      Ahmedabad: {}
    },
    Maharashtra: {}
  }
};

// ---------- Helper Functions ----------
function createDropdowns(containerId, options, count) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    const select = document.createElement("select");
    select.innerHTML = "<option value=''>-- Select --</option>";
    options.forEach(opt => select.add(new Option(opt, opt)));
    div.appendChild(select);
    container.appendChild(div);
  }
}

function resetSelects(ids) {
  ids.forEach(id => (document.getElementById(id).innerHTML = `<option value="">-- Select ${id} --</option>`));
}

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

// ---------- Submit + Preview ----------
function submitData() {
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
    alert("⚠️ Please fill all dropdowns before submitting!");
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

  // ✅ Preview Table Update
  const row = document.getElementById("reportTable").querySelector("tbody").insertRow();
  [datetime, c, s, d, th, team, m, remark, regular, social].forEach(val => row.insertCell().textContent = val);

  // ✅ Direct Save to Google Sheet
  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({
      datetime, country: c, state: s, district: d,
      tahesil: th, team, teammember: m,
      remark, regular, social
    })
  })
  .then(res => res.text())
  .then(msg => {
    console.log("✅ Saved:", msg);
    alert("✅ Data Submitted Successfully!");
  })
  .catch(err => console.error("❌ Error:", err));

  // Reset form
  document.getElementById("reportForm").reset();
  createDropdowns("regularSeva", ["👍Done", "❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done", "❌Not Done"], 3);
}
