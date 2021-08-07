class ResistorCalc extends HTMLElement {

  constructor() {
    super();
    this.band = 4;
    this.attachShadow({mode: 'open'});
  }

  // 4-6 band resistor color values
  static bandColorMap = {
    standard: {
      black: 0,
      brown: 1,
      red: 2,
      orange: 3,
      yellow: 4,
      green: 5,
      blue: 6,
      violet: 7,
      grey: 8,
      white: 9
    },
    multiplier: {
      black: 1,
      brown: 10,
      red: 100,
      orange: 1000,
      yellow: 10000,
      green: 100000,
      blue: 1000000,
      violet: 10000000,
      grey: 100000000,
      white: 1000000000,
      gold: 0.1,
      silver: 0.01
    },
    tolerance: {
      brown: 1,
      red: 2,
      green: 0.5,
      blue: 0.25,
      violet: 0.1,
      grey: 0.05,
      gold: 5,
      silver: 10
    },
    ppm: {
      brown: 100,
      red: 50,
      orange: 15,
      yellow: 25,
      blue: 10,
      violet: 5
    }
  }
  
  // attributes to watch
  static get observedAttributes() {
    return ['band'];
  }

  // lifecycle hook when component connects
  async connectedCallback() {
    this.shadowRoot.innerHTML = await this._buildInnerHTML();
    this._updateBand(); // init band radio

    this.shadowRoot.querySelectorAll("input[name='band-radio']").forEach((input) => {
      input.addEventListener('click', this._updateBand.bind(this));
    });
  }

  // lifecycle hook when a component's watched attribute changes
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);

    if (name === 'band') {
      if (this.hasAttribute('band')) {
        this.band = parseInt(this.getAttribute('band'));
      } else {
        this.band = 4;
      }
      this._updateBand();
    }
  }

  // fetch source from file
  async _fetchSrc(srcPath) {
    const src = await fetch(srcPath);
    return await src.text();
  }

  // update band attribute
  _updateBand(radio = null) {
    if (radio !== null) {
      this.setAttribute('band', radio.originalTarget.value);
    }
    this.shadowRoot.querySelectorAll("input[name='band-radio']").forEach((input) => {
      input.checked = input.id === `band-${this.band}`;
    });
  }

  // dynamically build band radio HTML
  _getBandRadioHTML() {
    let radioHtml = '<div class="band-radio">';
    for (let i = 4; i <= 6; i++) {
      radioHtml += `
        <input type="radio" id="band-${i}" name="band-radio" 
          ${i === 4 ? 'checked': ''} value="${i}">
        <label for="band-${i}">${i}</label>
      `;
    }
    return radioHtml + '</div>';
  }

  // construct color band options HTML  TODO: dynamically build from colorMap
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

  // construct resistor band container HTML
  _getBandContainerHTML() {
    let html = '<div class="band-container">';
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
    // TODO: dynamically build from colorMap
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
          <option value="6">Violet - 5 ppm</option>
        </select>
      </div>
    `;
    return html + '</div>';
  }

  // fetch resistor SVG
  async _fetchResistorSvg() {
    const src = await fetch('resistor.svg');
    return await src.text();
  }

  // construct component's HTML
  async _buildInnerHTML() {
    return `
      <style>${await this._fetchSrc('resistor-calc.css')}</style>
      <div class="calc-container">
        <header>Resistor Band Calculator</header>
        <div class="radio-container">
          <p>Resistor Band Count:</p>
          ${this._getBandRadioHTML()}
        </div>
        ${this._getBandContainerHTML()}
        <div id="resistor-calc">
          ${await this._fetchSrc('resistor.svg')}
          <p>Resistor value: <span>10kΩ 2%</span></p>
        </div>
      </div>
    `;
  }
}

customElements.define('wc-resistor-calc', ResistorCalc);
