class ResistorCalc extends HTMLElement {

  constructor() {
    super();
    this.band = 4;
    this.showDiagram = true;
    
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this._getInnerHTML();

    this.shadowRoot.querySelectorAll("input[name='band-radio']").forEach((input) => {
      input.addEventListener('click', this.updateBand.bind(this));
    });
  }

  // respond to attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);

    if (name === 'band') {
      if (this.hasAttribute('band')) {
        this.band = parseInt(this.getAttribute('band'));
      } else {
        this.band = 4;
      }
      this.shadowRoot.querySelectorAll("input[name='band-radio']").forEach((input) => {
        input.checked = input.id === `band-${this.band}`;
      });
      this.shadowRoot.innerHTML = this._getInnerHTML();
    }
  }

  // attributes to watch
  static get observedAttributes() {
    return ['band', 'diagram'];
  }

  // update band attribute
  updateBand(radio) {
    this.setAttribute('band', radio.originalTarget.value);
  }

  // construct component's styling
  _getStyles() {
    return `
      :host {
        box-sizing: border-box;
        font-family: sans-serif;
      }
      .calc-container {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        width: 275px;
        margin: 0.25rem;
        padding: 1.25rem;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
      }
      .calc-container header {
        font-size: 1.0rem;
        font-weight: bold;
        padding: 0.75rem;
      }
      .band-container, 
      .radio-container {
        margin: 0.50rem 0;
        padding: 0.75rem;
        width: 100%;
      }
      .band-container {
        border-bottom: 1px solid #ccc;
      }
      .radio-container {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        border-top: 1px solid #ccc;
      }
      .band-select {
        display: flex;
        margin-bottom: 0.50rem;
      }
      .band-select label {
        flex: 1;
      }
      .band-select select {
        margin-left: 0.50rem;
        width: 50%;
      }
      #resistor-calc {
        text-align: center;
        padding-top: 0.50rem;
      }
      #resistor-calc span {
        font-weight: bold;
        margin-left: 0.25rem;
      }
    `;
  }

  // construct band radio group HTML
  _getBandRadioGroup() {
    let radioHtml = '';
    for (let i = 4; i <= 6; i++) {
      radioHtml += `
        <input type="radio" id="band-${i}" name="band-radio" 
          ${i === 4 ? 'checked': ''} value="${i}">
        <label for="band-${i}">${i}</label>
      `;
    }
    return radioHtml;
  }

  // construct color band options HTML
  _getColorBandOptions() {
    return `
      <option value="0">Select a Color</option>
      <option value="1">Black - 0</option>
      <option value="2">Brown - 1</option>
      <option value="3">Red - 2</option>
      <option value="4">Orange - 3</option>
      <option value="5">Yellow - 4</option>
      <option value="6">Green - 5</option>
      <option value="7">Blue - 6</option>
      <option value="8">Violet - 7</option>
      <option value="9">Grey - 8</option>
      <option value="10">White - 9</option>
    `;
  }

  // construct resistor band select HTML
  _getBandSelects() {
    let html = '';

    for (let i = 1; i <= 3; i++) {
      html += `
        <div class="band-select">
          <label for="band-${i}-select">Band ${i}:</label>
          <select name="band-${i}-select" id="band-${i}-select">
            ${this._getColorBandOptions()}
          </select>
        </div>
      `;
    }
    html += `
      <div class="band-select">
        <label for="band-4-select">Multiplier:</label>
        <select name="band-4-select" id="band-4-select">
          <option value="0">Select a Color</option>
          <option value="1">Black - 1Ω</option>
          <option value="2">Brown - 10Ω</option>
          <option value="3">Red - 100Ω</option>
          <option value="4">Orange - 1kΩ</option>
          <option value="5">Yellow - 10kΩ</option>
          <option value="6">Green - 100kΩ</option>
          <option value="7">Blue - 1MΩ</option>
          <option value="8">Violet - 10MΩ</option>
          <option value="9">Grey - 100MΩ</option>
          <option value="10">White - 1GΩ</option>
          <option value="11">Gold - 0.1Ω</option>
          <option value="12">Silver - 0.01Ω</option>
        </select>
      </div>
      <div class="band-select">
        <label for="band-5-select">Tolerance:</label>
        <select name="band-5-select" id="band-5-select">
          <option value="0">Select a Color</option>
          <option value="1">Brown - 1%</option>
          <option value="2">Red - 2%</option>
          <option value="3">Green - 0.5%</option>
          <option value="4">Blue - 0.25%</option>
          <option value="5">Violet - 0.1%</option>
          <option value="6">Grey - 0.05%</option>
          <option value="7">Gold - 5%</option>
          <option value="8">Silver - 10%</option>
        </select>
      </div>
      <div class="band-select">
        <label for="band-6-select">PPM:</label>
        <select name="band-6-select" id="band-6-select">
          <option value="0">Select a Color</option>
          <option value="1">Brown - 100 ppm</option>
          <option value="2">Red - 50 ppm</option>
          <option value="3">Orange - 15 ppm</option>
          <option value="4">Yellow - 25 ppm</option>
          <option value="5">Blue - 10 ppm</option>
          <option value="6">Violet - 10 ppm</option>
        </select>
      </div>
    `;
    return html;
  }

  // construct component's HTML
  _getInnerHTML() {
    let html = `
      <style>${this._getStyles()}</style>
      <div class="calc-container">
        <header>Resistor Band Calculator</header>
        <div class="radio-container">
          <p>Resistor Band Count:</p>
          <div class="band-radio">
            ${this._getBandRadioGroup()}
          </div>
        </div>
        <div class="band-container">
          ${this._getBandSelects()}
        </div>
        <div id="resistor-calc">
          <img src="assets/resistor.svg" alt="resistor"/>
          <p>Resistor value: <span>10kΩ 2%</span></p>
        </div>
      </div>
    `;
    return html;
  }
}

customElements.define('wc-resistor-calc', ResistorCalc);
