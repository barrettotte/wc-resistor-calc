# wc-resistor-calc

A resistor color code calculator as a vanilla JS web component.

This was just a trivial example to play around with web components before diving
into making web components with Stencil.js. I pretty much just cloned the resistor
color code calculator from [Digi-Key](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-resistor-color-code)

## Usage

```html
<wc-resistor-calc band="4"></wc-resistor-calc>
```

Also deployed to [https://barrettotte.github.io/wc-resistor-calc/](https://barrettotte.github.io/wc-resistor-calc/), [index.html](index.html)` instantiates this web component.

### Attributes

- `band` - Default resistor type (`4`,`5`, or `6`); Defaults to `4` if not specified.

### Screenshot

![docs/screenshot.PNG](docs/screenshot.PNG)

## References

- [Digi-Key Resistor Color Code Calculator](https://www.digikey.com/en/resources/conversion-calculators/conversion-calculator-resistor-color-code)
- [Inkscape - for SVG editing](https://inkscape.org/)
