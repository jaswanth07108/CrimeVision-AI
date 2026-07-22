const BASE_URL = "http://127.0.0.1:5000/api";
let editingId = null;


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboardSummary();

    loadChartData();

    loadMapData();

    loadDatabaseReports();

    setupNavigation();

});




// ===============================
// DASHBOARD DATA
// ===============================

function loadDashboardSummary(){

fetch(`${BASE_URL}/dashboard-summary`)

.then(res=>res.json())

.then(data=>{


document.getElementById("totalCrime").innerText =
data.metrics.totalCrimes;


document.getElementById("activeCases").innerText =
data.metrics.activeCases;


document.getElementById("solvedCases").innerText =
data.metrics.solvedCases;


document.getElementById("crimeRate").innerText =
data.metrics.crimeRate;



document.getElementById("mostCommonCrime").innerText =
data.analytics.mostCommonCrime;



document.getElementById("highestRiskArea").innerText =
data.analytics.highestRiskArea;



document.getElementById("crimeGrowth").innerText =
data.analytics.crimeGrowth;



})

.catch(err=>{

console.log("Dashboard Error:",err);

});


}







// ===============================
// CHARTS
// ===============================

function loadChartData(){


fetch(`${BASE_URL}/chart-trends`)


.then(res=>res.json())


.then(data=>{


new Chart(

document.getElementById("crimeChart"),

{

type:"line",


data:{


labels:data.trends.labels,


datasets:[{


label:"Crime Cases",


data:data.trends.data,


borderWidth:3,


tension:0.4,


fill:true



}]


},



options:{


responsive:true


}


}

);







new Chart(

document.getElementById("crimeTypeChart"),

{


type:"doughnut",



data:{


labels:data.categories.labels,


datasets:[{


data:data.categories.data,


borderWidth:2


}]


},



options:{


responsive:true


}


}


);



})


.catch(err=>{


console.log("Chart Error:",err);


});


}








// ===============================
// MAP
// ===============================


let map;



function loadMapData(){


map = L.map("map").setView(

[17.3850,78.4867],

5

);



L.tileLayer(

"https://tile.openstreetmap.org/{z}/{x}/{y}.png",

{

attribution:"OpenStreetMap"

}

).addTo(map);





fetch(`${BASE_URL}/locations`)



.then(res=>res.json())



.then(locations=>{


locations.forEach(crime=>{


L.marker([

crime.lat,

crime.lng

])


.addTo(map)


.bindPopup(`

<b>Location:</b> ${crime.place}<br>

<b>Crime:</b> ${crime.crime}

`);


});


})


.catch(err=>{


console.log("Map Error:",err);


});


}









// ===============================
// REPORTS TABLE
// ===============================



// ===============================
// AI PREDICTION
// ===============================


function predictCrime(){


let location =
document.getElementById("location").value.trim();



let crimeType =
document.getElementById("crimeType").value;



let result =
document.getElementById("result");





if(location===""){


result.innerHTML=
"⚠ Please enter location";


return;


}





fetch(`${BASE_URL}/predict`,{


method:"POST",


headers:{


"Content-Type":"application/json"


},



body:JSON.stringify({


location:location,


crimeType:crimeType


})


})



.then(res=>res.json())



.then(data=>{



result.innerHTML=`

<h3>
AI Analysis Complete
</h3>

<p>
📍 Location:
${data.location}
</p>


<p>
🚨 Crime:
${data.crimeType}
</p>


<p>
⚠ Risk Level:
<b>${data.riskLevel}</b>
</p>


`;



})


.catch(err=>{


console.log(err);


result.innerHTML=
"Prediction Failed";


});



}









// ===============================
// SIDEBAR NAVIGATION
// ===============================


function setupNavigation(){


const menuItems =
document.querySelectorAll(".sidebar li");



menuItems.forEach(item=>{


item.addEventListener("click",()=>{



menuItems.forEach(i=>{

i.classList.remove("active");

});



item.classList.add("active");



let page =
item.innerText.trim();





if(page==="Dashboard"){


window.scrollTo({

top:0,

behavior:"smooth"

});


}





else if(page==="Crime Heatmap"){


document
.querySelector(".map-section")
.scrollIntoView({

behavior:"smooth"

});


}





else if(page==="AI Prediction"){


document
.querySelector(".prediction")
.scrollIntoView({

behavior:"smooth"

});


}





else if(page==="Analytics"){


document
.querySelector(".analytics")
.scrollIntoView({

behavior:"smooth"

});


}





else if(page==="Reports") {


    document
        .querySelector(".reports")
        .scrollIntoView({

            behavior: "smooth"

        });
}
else if(page==="Settings"){

document.querySelector(".settings")
.scrollIntoView({
behavior:"smooth"
});

}










});


});


}

function addCrime(){

let crimeType=document.getElementById("newCrimeType").value;

let location=document.getElementById("newCrimeLocation").value;

let status=document.getElementById("newCrimeStatus").value;

if(crimeType==="" || location===""){

alert("Please fill all fields");

return;

}

let url = editingId
? `${BASE_URL}/update-crime/${editingId}`
: `${BASE_URL}/add-crime`;

let method = editingId ? "PUT" : "POST";

fetch(url,{

method:method,

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

crime_type:crimeType,

location:location,

status:status

})

})

.then(res=>res.json())

.then(data=>{

alert(data.message);

document.getElementById("newCrimeType").value="";

document.getElementById("newCrimeLocation").value="";

document.getElementById("newCrimeStatus").value="Solved";

editingId = null;

document.querySelector(".prediction button").innerHTML="Add Crime";

loadDatabaseReports();

})

.catch(err=>{

console.log(err);

alert("Operation Failed");

});

}
function editCrime(id,type,location,status){

editingId=id;

document.getElementById("newCrimeType").value=type;

document.getElementById("newCrimeLocation").value=location;

document.getElementById("newCrimeStatus").value=status;

document.querySelector(".prediction button").innerHTML="Update Crime";

}
function loadDatabaseReports(){

fetch(`${BASE_URL}/all-crimes`)

.then(res=>res.json())

.then(data=>{

const tbody=document.querySelector("#reportsTable tbody");

tbody.innerHTML="";

data.forEach(crime=>{

let statusClass =
crime.status.toLowerCase()=="solved"
?
"solved"
:
"pending";

tbody.innerHTML += `

<tr>

<td>${crime.id}</td>

<td>${crime.crime_type}</td>

<td>${crime.location}</td>

<td class="${statusClass}">
${crime.status}
</td>

<td>

<button onclick="editCrime(${crime.id},'${crime.crime_type}','${crime.location}','${crime.status}')">

Edit

</button>

<button onclick="deleteCrime(${crime.id})">

Delete

</button>

</td>

</tr>

`;

});

})

.catch(err=>{

console.log(err);

});

}
function deleteCrime(id){

if(confirm("Are you sure you want to delete this crime record?")){

fetch(`${BASE_URL}/delete-crime/${id}`,{

method:"DELETE"

})

.then(res=>res.json())

.then(data=>{

alert(data.message);

loadDatabaseReports();

})

.catch(err=>{

console.log(err);

});

}

}
function logout(){

window.location.href="login.html";

}

// =========================
// SETTINGS
// =========================

const theme = document.getElementById("themeSelect");
const language = document.getElementById("languageSelect");
const notification = document.getElementById("notificationToggle");

// Load saved settings
window.addEventListener("load", () => {

    // Theme
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "light"){
        document.body.classList.add("light-mode");
        theme.value = "light";
    }else{
        document.body.classList.remove("light-mode");
        theme.value = "dark";
    }

    // Language
    const savedLanguage = localStorage.getItem("language");

    if(savedLanguage){
        language.value = savedLanguage;
        changeLanguage(savedLanguage);
    }

    // Notification
    notification.checked =
        localStorage.getItem("notification") !== "false";

});



// Theme Change
theme.addEventListener("change",function(){

    if(this.value==="light"){
        document.body.classList.add("light-mode");
    }else{
        document.body.classList.remove("light-mode");
    }

});




// Language Change

language.addEventListener("change",function(){

    changeLanguage(this.value);

});



function changeLanguage(lang){

if(lang=="Telugu"){

document.querySelector(".settings h2").innerHTML='<i class="fa-solid fa-gear"></i> సెట్టింగ్స్';

document.querySelector(".settings-card h3").innerHTML="అప్లికేషన్ సెట్టింగ్స్";

document.getElementById("notificationLabel").innerHTML =
'<input type="checkbox" id="notificationToggle" checked> నోటిఫికేషన్లు ప్రారంభించండి';

document.querySelector(".save-btn, button").innerHTML='<i class="fa-solid fa-floppy-disk"></i> సేవ్ చేయండి';

}

else if(lang=="Hindi"){

document.querySelector(".settings h2").innerHTML='<i class="fa-solid fa-gear"></i> सेटिंग्स';

document.querySelector(".settings-card h3").innerHTML="एप्लिकेशन सेटिंग्स";

document.getElementById("notificationLabel").innerHTML =
'<input type="checkbox" id="notificationToggle" checked> सूचनाएँ सक्षम करें';
document.querySelector(".save-btn, button").innerHTML='<i class="fa-solid fa-floppy-disk"></i> सेव करें';

}

else{

document.querySelector(".settings h2").innerHTML='<i class="fa-solid fa-gear"></i> Settings';

document.querySelector(".settings-card h3").innerHTML="Application Settings";

document.getElementById("notificationLabel").innerHTML =
'<input type="checkbox" id="notificationToggle" checked> Enable Notifications';

document.querySelector(".save-btn, button").innerHTML='<i class="fa-solid fa-floppy-disk"></i> Save Settings';

}

}


// Save Settings

function saveSettings(){

    localStorage.setItem("theme",theme.value);

    localStorage.setItem("language",language.value);

    localStorage.setItem("notification",notification.checked);

    alert("Settings Saved Successfully");

}
function toggleProfileMenu(){

    const menu = document.getElementById("profileMenu");

    if(menu.style.display==="block"){
        menu.style.display="none";
    }else{
        menu.style.display="block";
    }

}

window.addEventListener("click",function(e){

    if(!e.target.closest(".user-box") &&
       !e.target.closest(".profile-menu")){

        document.getElementById("profileMenu").style.display="none";

    }

});
function searchCrime() {

    const input = document.getElementById("searchInput").value.toLowerCase();

    const rows = document.querySelectorAll("#reportsTable tbody tr");

    rows.forEach(row => {

        const crime = row.cells[1].textContent.toLowerCase();
        const location = row.cells[2].textContent.toLowerCase();

        if (crime.includes(input) || location.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });

}