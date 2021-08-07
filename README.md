# wc-resistor-calc

A resistor color code calculator as a vanilla JS web component.

This was just a trivial example to play around with web components before diving
into making web components with Stencil.js. I pretty much just cloned the resistor
color code calculator from 
[Digi-Key](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-resistor-color-code)

## Usage

TODO: link to deployed page

```html
<wc-resistor-calc default-band="4" hide-diagram></wc-resistor-calc>
```

### Attributes

- `default-band` - Default resistor type (`4`,`5`, or `6`); Defaults to `4` if not specified.
- `hide-diagram` - Control if resistor diagram should be shown; Defaults to shown if not specified.

## References

- [Digi-Key Resistor Color Code Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-resistor-color-code)
- [Inkscape - for SVG editing](https://inkscape.org/)
