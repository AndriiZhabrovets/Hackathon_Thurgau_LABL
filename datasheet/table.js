// import {Grid, html} from "https://unpkg.com/gridjs?module";


const api_url = 'https://mocki.io/v1/6a2770cd-d4a4-43ef-b5e4-45c50d29ca45';
async function getdata() {
    const response = await fetch(api_url);
    const data = await response.json();
    return data
}
const data = getdata();
const dataObject = {};

for (let i = 0; i < data.length; i++) {
    dataObject[data[i].municipality] = {
        "electric_car_share": data[i].electric_car_share,
        "electric_car_share_last_change": data[i].electric_car_share_last_change,
        "solar_potential_usage": data[i].solar_potential_usage,
        "solar_potential_usage_last_change": data[i].solar_potential_usage_last_change,
        "renewable_heating_share": data[i].renewable_heating_share,
        "renewable_heating_share_coverage": data[i].renewable_heating_share_coverage,
        "renewable_heating_share_last_change": data[i].renewable_heating_share_last_change,
    };
}

class dataGrid extends HTMLElement {
    connectedCallback() {
        this.municipalityName = this.attributes.municipalityName.value;
        this.innerHTML = `
            <div class="datasheet">
                <div class="dataHeader">
                    <h2>${this.municipalityName}</h2>
                </div>
                <div id="wrapper"></div>
            </div>
        `;
        this.render();
    }

    render() {
        const grid = new gridjs.Grid({
            columns: ["key", "value"],
            data: Object.entries(dataObject[this.municipalityName]),
        }).render(document.getElementById("wrapper"));
    }
}