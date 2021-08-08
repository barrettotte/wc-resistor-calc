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
    this.shadowRoot.innerHTML = await this._getInnerHTML();
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

  // get CSS for web component
  _getStyles() {
    return `
      :host {
        box-sizing: border-box;
        font-family: sans-serif;

        /* band values */
        --band-black: #000;
        --band-brown: #512627;
        --band-red: #CC0000;
        --band-orange: #D87347;
        --band-yellow: #E6C951;
        --band-green: #528F65;
        --band-blue: #0F5190;
        --band-violet: #6967CE;
        --band-grey: #7D7D7D;
        --band-white: #FFF;
        --band-gold: #C08327;
        --band-silver: #BFBEBF;
        --band-default: #CCC;
        --band-unassigned: #e7e2d6;
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
      .svg-band {
          display:inline;
          fill:#CCC;
      }
      #svg-band-1 {
          fill: var(--band-violet);
      }
    `;
  }

  // get resistor SVG source
  _getResistorSvg() {
    return `
      <svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg10" width="256" height="64" viewBox="0 0 200 64">
        <g id="layer4" style="display:inline" transform="translate(0,-12)">
          <g id="g162" transform="translate(-71.417784,5.8336309)">
            <rect id="svg-band-1" class="svg-band" y="14.702681" x="89.714172" height="46.757439" width="8.8388367"/>
            <rect id="svg-band-2" class="svg-band" y="21.46439" x="116.27487" height="34.029514" width="8.7062521"/>
            <rect id="svg-band-3" class="svg-band" y="21.552776" x="132.53831" height="34.117908" width="8.6620569"/>
            <rect id="svg-band-4" class="svg-band" y="21.508583" x="173.06438" height="34.073708" width="9.3691645"/>
            <rect id="svg-band-5" class="svg-band" y="21.46439" x="209.83394" height="34.029514" width="8.9272232"/>
            <rect id="svg-band-6" class="svg-band" y="15.188817" x="243.64249" height="46.492271" width="9.0156116"/>
            <path id="resistor-outline" d="m 78.702014,32.697427 h -6.703549 l -0.09408,14.418511 6.72707,-0.02352 m 0.117601,-20.204733 0.846764,-4.986499 0.940849,-3.669311 1.505359,-3.104801 H 106.5041 l 2.82255,6.397772 121.9891,0.12078 3.07004,-6.397772 h 26.60698 l 1.63736,3.104801 1.02334,3.669311 0.92101,4.986499 v 13.45414 l -9.3e-4,10.150326 -0.92078,4.710494 -1.02309,3.466214 -1.63695,2.932949 h -26.60039 l -3.06928,-6.043654 -122.00313,-0.120774 -2.82185,6.043655 H 82.042064 L 80.53708,58.668866 79.596462,55.202652 78.749908,50.492158 78.749482,39.062266 Z m 186.082544,5.835808 6.35343,0.0499 v 14.43659 l -6.41996,-0.01663" style="display:inline;fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"/>
            <rect id="wire-left" y="32.697426" x="71.998466" height="14.394991" width="6.6329899" style="display:inline;fill:#676767"/>
            <rect id="wire-right" y="32.723492" x="264.8316" height="14.48649" width="6.3534298" style="display:inline;fill:#676767"/>
            <path id="path251" d="m 233.79919,59.243744 c -0.53171,-0.996578 -1.22929,-2.34892 -1.55016,-3.005203 l -0.58342,-1.193243 h -6.41441 -6.41441 V 38.607243 22.169189 l 6.46437,-0.04637 6.46437,-0.04637 1.48355,-3.093592 1.48355,-3.093592 4.42645,-0.04723 4.42645,-0.04723 V 38.425257 61.05571 h -4.4098 -4.40979 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669" />
            <path id="path253" d="M 252.77792,38.428289 V 15.800872 l 3.93328,7.99e-4 3.93328,7.99e-4 0.73892,1.457608 c 0.88354,1.742878 1.49973,3.807237 2.09262,7.010654 l 0.43883,2.371065 v 12.132108 c 0,12.067698 -0.002,12.143811 -0.42338,14.336312 -0.57351,2.985801 -1.24342,5.129448 -2.08251,6.663858 l -0.70086,1.281631 h -3.96509 -3.96509 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
            <path id="path255" d="M 182.59757,38.605065 V 22.164833 h 13.61181 13.6118 v 16.440232 16.440233 h -13.6118 -13.61181 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
            <path id="path257" d="M 141.23182,38.605065 V 22.164833 h 15.90991 15.9099 v 16.440232 16.440233 h -15.9099 -15.90991 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
            <path id="path259" d="M 125.14514,38.605065 V 22.164833 h 3.62393 3.62392 v 16.440232 16.440233 h -3.62392 -3.62393 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
            <path id="path261" d="m 98.628641,38.336384 v -22.71932 l 3.747429,0.04771 3.74744,0.04771 1.41588,3.226175 1.41589,3.226175 h 3.58713 3.58712 V 38.60148 55.038125 l -3.62807,0.04778 -3.62808,0.04778 -1.36586,2.954996 -1.36587,2.954997 -3.7565,0.006 -3.756509,0.006 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
            <path id="path263" d="m 81.805184,59.86128 c -0.76201,-1.40095 -1.413735,-3.613989 -2.011176,-6.829274 -0.429254,-2.310143 -0.430671,-2.357061 -0.432346,-14.318914 -0.0016,-11.305829 0.01939,-12.125223 0.362037,-14.142135 0.552703,-3.253383 1.339777,-6.159472 2.065354,-7.625837 l 0.653661,-1.321025 h 3.585157 3.585158 V 38.3399 61.055706 l -3.579728,-0.0012 -3.579728,-0.0012 -0.648389,-1.19206 z" style="fill:#e7e2d6;fill-opacity:1;stroke-width:0.17677669"/>
          </g>
        </g>
      </svg>
    `;
  }

  // construct component's HTML
  _getInnerHTML() {
    return `
      <style>${this._getStyles()}</style>
      <div class="calc-container">
        <header>Resistor Band Calculator</header>
        <div class="radio-container">
          <p>Resistor Band Count:</p>
          ${this._getBandRadioHTML()}
        </div>
        ${this._getBandContainerHTML()}
        <div id="resistor-calc">
          ${this._getResistorSvg()}
          <p>Resistor value: <span>10kΩ 2% (TODO)</span></p>
        </div>
      </div>
    `;
  }
}

customElements.define('wc-resistor-calc', ResistorCalc);
