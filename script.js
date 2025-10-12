// ---------- Google Apps Script URL ----------
const scriptURL = "https://script.google.com/macros/s/AKfycby9zKNBHcTODayOKPaa6apGYgvnuCH5IGNYALvk6b9xblenDQ-SQKJDDyOHEDRA_6KgoQ/exec";

// ---------- Dropdown Data Structure ----------
const data = {
  India: {
    Gujarat: {
      PanchMahals: {
        Kalol: {
          Bhavanadasi: ["Kamaladasi", "Kailashdasi", "Kishnadasi"],
          Krishnadasi: ["Jyotidasi", "Rajnidasi", "Kasidasi"]
        },
        Godhra: {
          Babudas: ["Jitendra Das", "Ashok Das"]
        }
      },
      Ahmedabad: {}
    },
    Maharashtra: {}
  }
};

// ---------- On Page Load ----------
window.onload = () => {
  // Load Countries
  Object.keys(data).forEach(c =>
    document.getElementById("country").add(new Option(c, c))
  );

  // Create seva dropdowns
  createDropdowns("regularSeva", ["👍Done", "❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done", "❌Not Done"], 3);

  // Start date-time updater
  updateDateTime();
  setInterval(updateDateTime, 1000);
};

// ---------- Date & Time Updater ----------
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent =
    now.toLocaleDateString("en-GB") + " | " + now.toLocaleTimeString();
}

// ---------- Create Dropdown Groups ----------
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

// ---------- Reset Dropdowns ----------
function resetSelects(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    el.innerHTML = `<option value="">-- Select ${id} --</option>`;
  });
}

// ---------- Hierarchy Dropdowns ----------
function populateStates() {
  const c = document.getElementById("country").value;
  resetSelects(["state", "district", "tahesil", "team", "teammember"]);
  if (!c) return;
  Object.keys(data[c]).forEach(s =>
    document.getElementById("state").add(new Option(s, s))
  );
}

function populateDistricts() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  resetSelects(["district", "tahesil", "team", "teammember"]);
  if (!s) return;
  Object.keys(data[c][s]).forEach(d =>
    document.getElementById("district").add(new Option(d, d))
  );
}

function populateTahesils() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  resetSelects(["tahesil", "team", "teammember"]);
  if (!d) return;
  Object.keys(data[c][s][d]).forEach(th =>
    document.getElementById("tahesil").add(new Option(th, th))
  );
}

function populateTeams() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  resetSelects(["team", "teammember"]);
  if (!th) return;
  Object.keys(data[c][s][d][th]).forEach(team =>
    document.getElementById("team").add(new Option(team, team))
  );
}

function populateMembers() {
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  const team = document.getElementById("team").value;
  resetSelects(["teammember"]);
  if (!team) return;
  data[c][s][d][th][team].forEach(m =>
    document.getElementById("teammember").add(new Option(m, m))
  );
}

// ---------- Submit Form ----------
function submitDirect(event) {
  event.preventDefault();

  // Collect form values
  const c = document.getElementById("country").value;
  const s = document.getElementById("state").value;
  const d = document.getElementById("district").value;
  const th = document.getElementById("tahesil").value;
  const team = document.getElementById("team").value;
  const m = document.getElementById("teammember").value;
  const remark = document.getElementById("remark").value;
  const date = document.getElementById("reportDate").value;
  const now = new Date();
  const datetime = date ? `${date} ${now.toLocaleTimeString()}` : now.toLocaleString("en-GB");

  if (!c || !s || !d || !th || !team || !m) {
    alert("⚠️ Please fill all dropdowns before submitting!");
    return;
  }

  // Collect seva data
  const regular = [...document.querySelectorAll("#regularSeva select")]
    .map(sel => sel.value)
    .filter(v => v)
    .join(" | ");
  const social = [...document.querySelectorAll("#socialSeva select")]
    .map(sel => sel.value)
    .filter(v => v)
    .join(" | ");

  // Add to Preview Table
  const tbody = document.getElementById("reportTable").querySelector("tbody");
  const row = tbody.insertRow();
  [datetime, c, s, d, th, team, m, remark, regular, social].forEach(val => {
    row.insertCell().textContent = val;
  });

  // Send to Google Sheet
  fetch(scriptURL, {
    method: "POST",
    body: JSON.stringify({
      datetime, country: c, state: s, district: d,
      tahesil: th, team, teammember: m, remark, regular, social
    })
  })
    .then(res => res.text())
    .then(msg => {
      console.log("✅ Saved:", msg);
      alert("✅ Report Submitted Successfully!");
    })
    .catch(err => {
      console.error("❌ Error:", err);
      alert("❌ Error saving data. Please try again.");
    });

  // Reset Form after submit
  document.getElementById("reportForm").reset();
  createDropdowns("regularSeva", ["👍Done", "❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done", "❌Not Done"], 3);
}
