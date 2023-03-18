// maybe some import thingy

class dataSheet extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="datasheet">
                <div class="dataHeader">
                    <h2>${this.municipalityName}</h2>
                    <img src=${this.coatOfArms} alt="Coat of Arms">
                </div>
                <canvas id=${this.chartId}></canvas>
            </div>
        `;
    }
}

customElements.define('data-sheet', dataSheet);
