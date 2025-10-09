// 🌸 TEAM SEVA REPORT SYSTEM SCRIPT 🌸

// Date-Time auto update
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").innerText =
    now.toLocaleString("en-IN", { hour12: true });
}
setInterval(updateDateTime, 1000);
updateDateTime();

// 🔹 Dummy data for dropdowns (aap chahe to real data se replace kar sakte ho)
const data = {
  India: {
    Haryana: {
      Hisar: { Barwala: ["Team A", "Team B"] },
      Rohtak: { Kalanaur: ["Team X", "Team Y"] },
    },
    Delhi: {
      North: { ModelTown: ["Team 1", "Team 2"] },
    },
  },
};

// 🔹 Populate dropdowns
function populateCountries() {
  const countrySelect = document.getElementById("country");
  for (let country in data) {
    countrySelect.innerHTML += `<option value="${country}">${country}</option>`;
  }
}
populateCountries();

function populateStates() {
  const country = document.getElementById("country").value;
  const stateSelect = document.getElementById("state");
  stateSelect.innerHTML = "<option value=''>-- Select State --</option>";
  if (country && data[country]) {
    for (let state in data[country]) {
      stateSelect.innerHTML += `<option value="${state}">${state}</option>`;
    }
  }
}

function populateDistricts() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = "<option value=''>-- Select District --</option>";
  if (country && state && data[country][state]) {
    for (let dist in data[country][state]) {
      districtSelect.innerHTML += `<option value="${dist}">${dist}</option>`;
    }
  }
}

function populateTahesils() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const tahesilSelect = document.getElementById("tahesil");
  tahesilSelect.innerHTML = "<option value=''>-- Select Tahesil --</option>";
  if (country && state && district && data[country][state][district]) {
    for (let tahesil in data[country][state][district]) {
      tahesilSelect.innerHTML += `<option value="${tahesil}">${tahesil}</option>`;
    }
  }
}

function populateTeams() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const tahesil = document.getElementById("tahesil").value;
  const teamSelect = document.getElementById("team");
  teamSelect.innerHTML = "<option value=''>-- Select Team --</option>";
  if (country && state && district && tahesil) {
    const teams = data[country][state][district][tahesil];
    teams.forEach((team) => {
      teamSelect.innerHTML += `<option value="${team}">${team}</option>`;
    });
  }
}

function populateMembers() {
  const team = document.getElementById("team").value;
  const memberSelect = document.getElementById("teammember");
  memberSelect.innerHTML =
    "<option value=''>-- Select Team Member --</option>";
  if (team) {
    // Aap yahan real data add kar sakte ho
    const members = ["Member 1", "Member 2", "Member 3"];
    members.forEach((m) => {
      memberSelect.innerHTML += `<option value="${m}">${m}</option>`;
    });
  }
}

// 🔹 Add to Table
function addToTable() {
  const table = document.getElementById("reportTable").querySelector("tbody");
  const datetime = new Date().toLocaleString("en-IN", { hour12: true });
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;
  const tahesil = document.getElementById("tahesil").value;
  const team = document.getElementById("team").value;
  const teammember = document.getElementById("teammember").value;
  const remark = document.getElementById("remark").value;

  const regularSeva = "Yes"; // Aap checkbox add kar sakte ho
  const socialSeva = "Yes";

  if (!country || !state || !district || !tahesil || !team) {
    alert("⚠️ Please fill all fields before adding!");
    return;
  }

  const newRow = `
    <tr>
      <td>${datetime}</td>
      <td>${country}</td>
      <td>${state}</td>
      <td>${district}</td>
      <td>${tahesil}</td>
      <td>${team}</td>
      <td>${teammember}</td>
      <td>${remark}</td>
      <td>${regularSeva}</td>
      <td>${socialSeva}</td>
    </tr>
  `;
  table.innerHTML += newRow;
  alert("✅ Added to table!");
}

// 🔹 Export CSV
function exportCSV() {
  const rows = document.querySelectorAll("#reportTable tr");
  let csv = [];
  rows.forEach((row) => {
    const cols = row.querySelectorAll("th, td");
    let rowData = [];
    cols.forEach((col) => rowData.push(col.innerText));
    csv.push(rowData.join(","));
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Team_Seva_Report.csv";
  link.click();
}

// 🔹 Save to Google Sheet
async function saveTableToSheet() {
  const table = document.getElementById("reportTable").querySelector("tbody");
  const rows = table.querySelectorAll("tr");

  if (rows.length === 0) {
    alert("❌ No data to save!");
    return;
  }

  let data = [];
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    data.push({
      datetime: cells[0].innerText,
      country: cells[1].innerText,
      state: cells[2].innerText,
      district: cells[3].innerText,
      tahesil: cells[4].innerText,
      team: cells[5].innerText,
      teammember: cells[6].innerText,
      remark: cells[7].innerText,
      regularSeva: cells[8].innerText,
      socialSeva: cells[9].innerText,
    });
  });

  // ⚠️ Apna Google Apps Script URL yahan daalein 👇
  const scriptURL = "https://script.google.com/macros/s/AKfycbx123abcXYZ/exec";

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("✅ Data saved to Google Sheet successfully!");
      table.innerHTML = ""; // clear table
    } else {
      alert("⚠️ Failed to save data. Check your script URL or permissions.");
    }
  } catch (err) {
    alert("🚫 Error: " + err.message);
  }
}
