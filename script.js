const scriptURL = "https://script.google.com/macros/s/AKfycbwDw5gZ6yUcxiLB1hvTlUQZNK2pjX2G7vLUz6aPoaEsd1toV34urCJMJbbX7wvqKuaHgg/exec";
// ---------- On Load ----------
const data = {
  India: {
    Gujarat: {
      PanchMahals: {
        Kalol: {
          Bhavanadasi:["Kamaladasi","Kailashdasi","Kishnadasi","Payaldasi"],
          Krishnadasi:["Jyotidasi","Rajnidasi"],
          Nayandas:["Shantilaldas","MahipalDas"],
          Dharmeshdas:["Ashishdas","ManojDas"]
        }
      }
    }
  }
};

window.onload = () => {
  Object.keys(data).forEach(c => document.getElementById("country").add(new Option(c, c)));
  createDropdowns("regularSeva", ["👍 Done","❌ Not Done"], 3);
  createDropdowns("socialSeva", ["✅ Done","❌ Not Done"], 3);
  updateDateTime();
  setInterval(updateDateTime,1000);
};

function updateDateTime(){
  const now=new Date();
  document.getElementById("datetime").textContent = now.toLocaleDateString("en-GB")+" | "+now.toLocaleTimeString();
}

function createDropdowns(containerId, options, count){
  const container = document.getElementById(containerId);
  container.innerHTML="";
  for(let i=0;i<count;i++){
    const div=document.createElement("div"); div.className="seva-group";
    const select=document.createElement("select"); select.innerHTML="<option value=''>-- Select --</option>";
    options.forEach(opt=>select.add(new Option(opt,opt)));
    div.appendChild(select); container.appendChild(div);
  }
}

function populateStates(){
  const c=document.getElementById("country").value;
  resetSelects(["state","district","tahesil","team","teammember"]);
  if(!c)return;
  Object.keys(data[c]).forEach(s=>document.getElementById("state").add(new Option(s,s)));
}
function populateDistricts(){
  const c=document.getElementById("country").value;
  const s=document.getElementById("state").value;
  resetSelects(["district","tahesil","team","teammember"]);
  if(!s)return;
  Object.keys(data[c][s]).forEach(d=>document.getElementById("district").add(new Option(d,d)));
}
function populateTahesils(){
  const c=document.getElementById("country").value;
  const s=document.getElementById("state").value;
  const d=document.getElementById("district").value;
  resetSelects(["tahesil","team","teammember"]);
  if(!d)return;
  Object.keys(data[c][s][d]).forEach(th=>document.getElementById("tahesil").add(new Option(th,th)));
}
function populateTeams(){
  const c=document.getElementById("country").value;
  const s=document.getElementById("state").value;
  const d=document.getElementById("district").value;
  const th=document.getElementById("tahesil").value;
  resetSelects(["team","teammember"]);
  if(!th)return;
  Object.keys(data[c][s][d][th]).forEach(team=>document.getElementById("team").add(new Option(team,team)));
}
function populateMembers(){
  const c=document.getElementById("country").value;
  const s=document.getElementById("state").value;
  const d=document.getElementById("district").value;
  const th=document.getElementById("tahesil").value;
  const team=document.getElementById("team").value;
  resetSelects(["teammember"]);
  if(!team)return;
  data[c][s][d][th][team].forEach(m=>document.getElementById("teammember").add(new Option(m,m)));
}
function resetSelects(ids){ ids.forEach(id=>document.getElementById(id).innerHTML=`<option value="">-- Select ${id} --</option>`); }

document.getElementById("reportForm").addEventListener("submit", submitReport);

function submitReport(e){
  e.preventDefault();
  let dateInput=document.getElementById("reportDate").value;
  const dateObj=dateInput ? new Date(dateInput) : new Date();
  const date=("0"+dateObj.getDate()).slice(-2)+"/"+("0"+(dateObj.getMonth()+1)).slice(-2)+"/"+dateObj.getFullYear();
  const time=new Date().toLocaleTimeString();

  const c=document.getElementById("country").value;
  const s=document.getElementById("state").value;
  const d=document.getElementById("district").value;
  const th=document.getElementById("tahesil").value;
  const team=document.getElementById("team").value;
  const m=document.getElementById("teammember").value;
  const remark=document.getElementById("remark").value;

  if(!c||!s||!d||!th||!team||!m){ alert("Please fill all fields!"); return; }

  const regular=[...document.querySelectorAll("#regularSeva select")].map(sel=>sel.value).filter(v=>v).join(" | ");
  const social=[...document.querySelectorAll("#socialSeva select")].map(sel=>sel.value).filter(v=>v).join(" | ");

  fetch(scriptURL, {
    method: "POST",
    mode: "no-cors",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({date,time,country:c,state:s,district:d,tahesil:th,team,teammember:m,remark,regular,social})
  });

  showReview(date,time,c,s,d,th,team,m,remark,regular,social);
  document.getElementById("message").innerHTML = `<div class="success">✅ Report successfully submitted!</div>`;
  document.getElementById("reportForm").reset();
  createDropdowns("regularSeva", ["👍 Done","❌ Not Done"],3);
  createDropdowns("socialSeva", ["✅ Done","❌ Not Done"],3);
}

function showReview(date,time,c,s,d,th,team,m,remark,regular,social){
  const tbody=document.querySelector("#reviewTable tbody");
  tbody.innerHTML="";
  const row=tbody.insertRow();
  [date,time,c,s,d,th,team,m,remark,regular,social].forEach(v=>row.insertCell().textContent=v);
}

