class ResistorCalc extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this._getInnerHTML();
    this.reset();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`${name} changed from ${oldValue} to ${newValue}`);
    // TODO:
  }

  static get observedAttributes() {
    return ['bands', 'diagram'];
  }

  // reset component's properties
  reset() {
    this.band = 4;
    this.hideDiagram = true;
  }

  // construct WC's HTML
  _getInnerHTML() {
    return `
      <style>${this._getStyles()}</style>
      <p>resistor calculator ... </p>
    `;
  }

  // construct WC's styling
  _getStyles() {
    return ``;
  }
}

customElements.define('wc-resistor-calc', ResistorCalc);
