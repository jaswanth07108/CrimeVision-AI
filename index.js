const BASE_URL = "http://127.0.0.1:5000/api";

// Load dashboard data when page opens
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardSummary();
    loadChartData();
    loadMapData();
    loadTableReports();
});


// 1. Dashboard Cards + Analytics
function loadDashboardSummary() {

    fetch(`${BASE_URL}/dashboard-summary`)
        .then(res => res.json())
        .then(data => {

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
        .catch(error => {
            console.error("Dashboard loading error:", error);
        });
}



// 2. Charts
function loadChartData() {

    fetch(`${BASE_URL}/chart-trends`)
        .then(res => res.json())
        .then(data => {


            new Chart(
                document.getElementById("crimeChart"),
                {
                    type: "line",

                    data: {

                        labels: data.trends.labels,

                        datasets: [{
                            label: "Number of Crimes",

                            data: data.trends.data,

                            borderWidth: 3,

                            tension: 0.4,

                            fill: true
                        }]
                    },

                    options: {
                        responsive: true,

                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            );



            new Chart(
                document.getElementById("crimeTypeChart"),
                {
                    type: "doughnut",

                    data: {

                        labels: data.categories.labels,

                        datasets: [{

                            data: data.categories.data,

                            borderWidth: 1
                        }]
                    },

                    options: {
                        responsive: true
                    }
                }
            );


        })
        .catch(error => {
            console.error("Chart loading error:", error);
        });

}




// 3. Crime Map

var map = L.map("map").setView(
    [17.3850, 78.4867],
    5
);


L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "OpenStreetMap"
    }
).addTo(map);



function loadMapData() {

    fetch(`${BASE_URL}/locations`)

        .then(res => res.json())

        .then(locations => {


            locations.forEach(crime => {


                L.marker(
                    [
                        crime.lat,
                        crime.lng
                    ]
                )

                .addTo(map)

                .bindPopup(
                    `
                    <b>Location:</b> ${crime.place}<br>
                    <b>Crime Type:</b> ${crime.crime}
                    `
                );


            });


        })

        .catch(error => {

            console.error("Map loading error:", error);

        });

}




// 4. Crime Reports Table

function loadTableReports() {


    fetch(`${BASE_URL}/reports`)

        .then(res => res.json())

        .then(reports => {


            const tbody =
            document.querySelector("#reportsTable tbody");


            tbody.innerHTML = "";


            reports.forEach(report => {


                const row =
                document.createElement("tr");


                const statusClass =
                report.status.toLowerCase() === "solved"
                ? "solved"
                : "pending";


                row.innerHTML = `

                <td>${report.id}</td>

                <td>${report.type}</td>

                <td>${report.location}</td>

                <td class="${statusClass}">
                ${report.status}
                </td>

                `;


                tbody.appendChild(row);


            });


        })


        .catch(error => {

            console.error("Reports loading error:", error);

        });


}




// 5. AI Crime Prediction

function predictCrime() {


    let location =
    document.getElementById("location").value.trim();


    let crime =
    document.getElementById("crimeType").value;


    let result =
    document.getElementById("result");



    if(location === "") {

        result.innerHTML =
        "Please enter location";

        return;

    }



    fetch(`${BASE_URL}/predict`,
    {

        method:"POST",

        headers:
        {
            "Content-Type":"application/json"
        },


        body: JSON.stringify({

            location: location,

            crimeType: crime

        })

    })


    .then(res => res.json())


    .then(data => {


        result.innerHTML = `

        <strong>
        AI Analysis Complete
        </strong>
        <br>

        Location:
        ${data.location}

        <br>

        Crime Type:
        ${data.crimeType}

        <br>

        Risk Level:
        ${data.riskLevel}

        `;


    })


    .catch(error => {


        console.error(error);


        result.innerHTML =
        "Prediction failed";


    });


}





// Sidebar Navigation

const menuItems =
document.querySelectorAll(".sidebar li");


menuItems.forEach(item => {


    item.addEventListener("click", function(){


        menuItems.forEach(menu =>

            menu.classList.remove("active")

        );


        this.classList.add("active");



        let page =
        this.innerText.trim();



        if(page === "Dashboard")

        {

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }


        else if(page === "Crime Map")

        {

            document
            .querySelector(".map-section")
            .scrollIntoView({

                behavior:"smooth"

            });

        }


        else if(page === "Analytics")

        {

            document
            .querySelector(".analytics")
            .scrollIntoView({

                behavior:"smooth"

            });

        }


        else if(page === "Prediction")

        {

            document
            .querySelector(".prediction")
            .scrollIntoView({

                behavior:"smooth"

            });

        }


        else if(page === "Reports")

        {

            document
            .querySelector(".reports")
            .scrollIntoView({

                behavior:"smooth"

            });

        }


    });


});