// // maybe some import thingy
// // import Grid from 'gridjs';

// const api_url = 'https://mocki.io/v1/6a2770cd-d4a4-43ef-b5e4-45c50d29ca45';

// async function getData() {
//     const response = await fetch(api_url);
//     const data = await response.json();
//     return data;
// }

// function getDataObject(data) {
//     let dataObject = {};
//     for (let i = 0; i < data.length; i++) {
//         dataObject[data[i].municipality] = data[i];
//     }
//     console.log(dataObject);
//     return dataObject;
// }

// const data = getData();
// const dataObject = getDataObject(data);

// function createGrid(municipalityName) {
//     const grid = new Grid({
//         columns: ["key", "value"],
//         data: Object.entries(dataObject[municipalityName]),
//     }).render(document.getElementById("wrapper"));
// }

// // Create a html table element
// function createTable(municipalityName) {
//     let table = document.createElement("table");
//     let tableBody = document.createElement("tbody");

//     let data = Object.entries(dataObject[municipalityName]);
//     for (let i = 0; i < data.length; i++) {
//         let row = document.createElement("tr");

//         for (let j = 0; j < 2; j++) {
//             let cell = document.createElement("td");
//             let cellText = document.createTextNode(data[i][j]);
//             cell.appendChild(cellText);
//             row.appendChild(cell);
//         }

//         tableBody.appendChild(row);
//     }

//     table.appendChild(tableBody);
//     document.body.appendChild(table);
//     table.setAttribute("border", "2");
// }


// class dataSheet extends HTMLElement {
//     connectedCallback() {
//         this.municipalityName = this.attributes.municipalityName.value;
//         this.innerHTML = `
//             <div class="datasheet">
//                 <div class="dataHeader">
//                     <h2>${this.municipalityName}</h2>
//                 </div>
//                 <div id="wrapper"></div>
//             </div>
//         `;
//         createGrid(this.municipalityName);
//     }
// }

// customElements.define('data-sheet', dataSheet);


// const ctx = document.getElementById('myChart');

// new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });

const ctx = document.getElementById('myChart');
      
// new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//     datasets: [{
//       label: '# of Votes',
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });


const api_url = 'https://mocki.io/v1/6a2770cd-d4a4-43ef-b5e4-45c50d29ca45';
async function getdata() {
    const response = await fetch(api_url);
    const data = await response.json();
    return data
}
const data = getdata();

var datas = {
    "electric_car_share": {},
    "electric_car_share_last_change": {},
    "solar_potential_usage": {},
    "solar_potential_usage_last_change": {},
    "renewable_heating_share": {},
    "renewable_heating_share_coverage": {},
    "renewable_heating_share_last_change": {},
};

for (let i = 0; i < data.length; i++) {
    datas.electric_car_share[data[i].municipality] = data[i].electric_car_share;
    datas.electric_car_share_last_change[data[i].municipality] = data[i].electric_car_share_last_change;
    datas.solar_potential_usage[data[i].municipality] = data[i].solar_potential_usage;
    datas.solar_potential_usage_last_change[data[i].municipality] = data[i].solar_potential_usage_last_change;
    datas.renewable_heating_share[data[i].municipality] = data[i].renewable_heating_share;
    datas.renewable_heating_share_coverage[data[i].municipality] = data[i].renewable_heating_share_coverage;
    datas.renewable_heating_share_last_change[data[i].municipality] = data[i].renewable_heating_share_last_change;
}
console.log(datas.electric_car_share)

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(datas.electric_car_share),
        datasets: [{
            label: 'Electric Car Share',
            data: Object.values(datas.electric_car_share),
            borderWidth: 1
        }]
    },
    options: {
        // IndexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
