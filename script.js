const scriptURL = "https://script.google.com/macros/s/AKfycbx-HNN8OewvFipp-MLlHgVpfU05F8JUnBqlD4Lv_oMuY4EMeiJmzYUM7juqTPNbnZrxdg/exec"; // <-- Google Apps Script Web App URL
// ---------- Dropdown Data ----------
const data = {
  India: {
    Gujarat: {
          PanchMahals: {
            Kalol: {
              Bhavanadasi: [
                "Kamaladasi", "Kailashdasi", "Kishnadasi", "Payaldasi", "Tanvidas",
                "Savitadasi(Kalol)", "Sushiladasi(Kalol)", "Jinaldaasi(Kalol)",
                "Pujadasi", "Pinnacle Dasi Halol", "Sheetaldasi Ghoghamba",
                "Sudhadasi Kalol", "Varshadasi Halol"
              ],
              Krishnadasi: [
                "Jyotidasi(Ghoghamba)", "Rajnidasi(Halol)", "Kasidasi",
                "Bhavanadasi(Kalol)", "Gitadasi", "Jinaldasi(Halol)",
                "Minadasi(Kalyana)", "Minadasi(Godhra)", "Urmiladasi",
                "Aashadasi", "Kailashdasi Godhra", "Sadhanadasi Halol",
                "Mayadasi Kalol", "Kishanadasi Godhra"
               ],
               Nayandas: [
                "Shantilaldas", "MahipalDas", "DharmeshDas", "Jhondas"
               ],
               Dharmeshdas: [
                "Ashishdas", "ManojDas", "NayanDas", "Arvind Das"
              ]
            },
            Godhra: {
              Babudas: [
                "Jitendra Das", "Ashok Das", "Janadas", "Manoj Das", "Mukeshdas",
                "Mukundandas", "Doltadas", "Tejasdas", "Narendradas", "Babudas",
                "Bharatdas", "Jagadishdas", "Prakashdas", "Shankardas",
                "Satishdas", "Rakeshdas"
              ]
            },    
             Halol: {
               Deepakdas: [
                "Kanudas", "Bhagwandas", "Arjundas", "Jaydas", "Rajudas"
               ],
               Jaydas: [
                "Maheshdas", "Sahdevdas", "Jagadishdas", "Deepak Das", 
               ]
            },    
             MorvaHadaf: {
               Nileshdas: [
                "Balwantdas", "Chandudas", "fatehsinghdas", "Sahdevdas", "Dharmeshdas", "Rameshdas"
                ],
             Balvantdas: [
                "Nileshdas", "Kanudas", "Vinudas", "Babudas", "Kadudas", "Purushottamdas"
                ]
             }, 
              Ghoghamba: {
                Bharatdas: [
                "Ishwardas", "AshokDas", "Arvinddas", "Girishdas", "Sanjaydas", "Bharatdas"
              ]
            },  
              Shahera: {
               Nileshdas: [
              "Hasmukhdas", "Pruthvidas", "BhalasihDas", "RameshDas", "ShankarDas", "Natudas", "Mithadas", "MangaDas",
              "Rajesh Das", "Pankajdas", "Nileshdas", "Laldas"
              ],
               Hsamukhdas : [
              "chandudas", "AlpeshDas", "MotiDas", "Rajudas", "Artadas", "Arvatadas", "Arvind Das", "Kirandas",
              "Tinadas", "Bhalladas", "Fuladas"
               ]
             }, 
          Jambughoda: {},
          },
          Ahmedabad: {}, Amreli: {}, Anand: {}, Aravalli: {}, Banaskantha: {}, Bharuch: {},
          Bhavnagar: {}, Botad: {}, Chhotaudepur: {}, Dahod: {}, Dangs: {}, Devbhumi_Dwarka: {},
          Gandhinagar: {}, Gir_Somnath: {}, Jamnagar: {}, Junagadh: {}, Kachchh: {}, Kheda: {},
          Mahesana: {}, Mahisagar: {}, Morbi: {}, Narmada: {}, Navsari: {}, Patan: {},
          Porbandar: {}, Rajkot: {}, Sabarkantha: {}, Surat: {}, Surendranagar: {},
          Tapi: {}, Vadodara: {}, Valsad: {}
        },
        Maharashtra: {}
      }
    };
// ---------- On load ----------
window.onload = () => {
  Object.keys(data).forEach(c => document.getElementById("country").add(new Option(c,c)));
  createDropdowns("regularSeva", ["👍Done","❌Not Done"], 3);
  createDropdowns("socialSeva", ["✅Done","❌Not Done"], 3);
  updateDateTime();
  setInterval(updateDateTime, 1000);
};

// ---------- Update Clock ----------
function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleDateString("en-GB") + " | " + now.toLocaleTimeString();
}

// ---------- Dropdown Helpers ----------
function createDropdowns(containerId, options, count){
  const container = document.getElementById(containerId);
  container.innerHTML="";
  for(let i=0;i<count;i++){
    const select = document.createElement("select");
    select.innerHTML="<option value=''>-- Select --</option>";
    options.forEach(opt=>select.add(new Option(opt,opt)));
    container.appendChild(select);
  }
}

function resetSelect(id, placeholder){ document.getElementById(id).innerHTML=`<option value="">-- Select ${placeholder} --</option>`; }

function populateStates(){ resetSelect("state","State"); Object.keys(data[country.value]||{}).forEach(s=>state.add(new Option(s,s))); }
function populateDistricts(){ resetSelect("district","District"); Object.keys(data[country.value][state.value]||{}).forEach(d=>district.add(new Option(d,d))); }
function populateTahesils(){ resetSelect("tahesil","Tahesil"); Object.keys(data[country.value][state.value][district.value]||{}).forEach(t=>tahesil.add(new Option(t,t))); }
function populateTeams(){ resetSelect("team","Team"); Object.keys(data[country.value][state.value][district.value][tahesil.value]||{}).forEach(t=>team.add(new Option(t,t))); }
function populateMembers(){ resetSelect("teammember","Team Member"); (data[country.value][state.value][district.value][tahesil.value][team.value]||[]).forEach(m=>teammember.add(new Option(m,m))); }

// ---------- Submit & Save ----------
function submitReport(){
  const selectedDate = document.getElementById("date").value;
  const timestamp = new Date().toLocaleTimeString();
  
  const payload = {
    date: selectedDate,
    timestamp: timestamp,
    country: country.value,
    state: state.value,
    district: district.value,
    tahesil: tahesil.value,
    team: team.value,
    teammember: teammember.value,
    remark: remark.value,
    regular: [...document.querySelectorAll("#regularSeva select")].map(s=>s.value).join(" | "),
    social: [...document.querySelectorAll("#socialSeva select")].map(s=>s.value).join(" | ")
  };

  if(Object.values(payload).some(v=>"".includes(v))){
    alert("⚠️ Please fill all fields!");
    return;
  }

  // Add to Preview Table
  const row=document.querySelector("#reportTable tbody").insertRow();
  Object.values(payload).forEach(v=>row.insertCell().textContent=v);

  // Save to Google Sheet
  fetch(scriptURL,{
    method:"POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  }).then(res=>res.text()).then(msg=>{
    console.log("✅ Saved:", msg);
    reportForm.reset();
    createDropdowns("regularSeva", ["👍Done","❌Not Done"], 3);
    createDropdowns("socialSeva", ["✅Done","❌Not Done"], 3);
  }).catch(err=>console.error("❌ Error:",err));
}

// ---------- Export CSV ----------
function exportCSV(){
  const rows=[...document.querySelectorAll("#reportTable tr")].map(r=>[...r.cells].map(c=>c.textContent));
  const csv=rows.map(r=>r.join(",")).join("\n");
  const blob=new Blob([csv],{type:"text/csv"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="TeamSevaReport.csv";
  a.click();
}








