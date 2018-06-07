# Selectise

Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)

## Live example

http://www.liran.co.uk/selectise

## Features

  - **Ability to style the `select` element freely using CSS**
  - **CSS theme out of the box** (using _selectise-theme.scss)
  - **Keyboard shortcuts:**
    - _Enter_ to open dropdown, when the trigger is focused
    - _Arrow up/down_ to navigate the dropdown's option list, when it is opened
    - _Esc_ to close the dropdown, when it is opened
  - **Copies all attributes from native `select` and `option` elements** to corresponding elements in the Selectise markup
    - `select` element:
      - Copies all attributes
      - If `tabindex` exists, it will also be copied to the trigger element and to each option element
    - `option` elements:
      - Copies all attributes
      - If `value` attribute exists, it will be copied as `data-value`
      - If `selected` attribute exists, this option will be selected, and the attribute will be removed from the custom option element
  - **Supports screen readers** thanks to these factors:
    - Copying the tabindex from the `select` element
    - Supporting keyboard shortcuts
    - Focusing the current option when using the keyboard to navigate the options list
    - Focusing the trigger once a selection has been made (this both confirms the selection to the accessiblilty user, and allows for an easy re-opening of the options dropdown)

## Installation

```
npm install selectise
```

## Usage

### JS
```js
import Selectise from 'selectise'

const selectise = new Selectise(nativeSelect, options)
```

### SCSS

Requires selectise-base.scss to work properly. You should also use `_selectise-theme.scss` if you're not setting your own styles.
```scss
@import '~selectise/src/selectise-base';
@import '~selectise/src/selectise-theme';
```

## Usage - ES5 and CSS

```html
<link rel="stylesheet" href="selectise/_selectise-base.css">
<link rel="stylesheet" href="selectise/_selectise-theme.css">
<script src="selectise/index.js"></script>
<script>
  var selectise = new Selectise.default(nativeSelect, options);
</script>
```

## Parameters

Selectise takes two arguments:

### nativeSelect
This can be either:
- **A refrence to the native select element**
- **A string representing a selector for the native select element** (e.g. `'#main .my-select-element'`), in which case Selectise will select and use the first matching element

### Options
If you'd like to configure Selectise, you can pass an options object as the second parameter.
```js
const options = {
  onSelect, // [Callback function] Will be called when an option has been selected. When called, an Object with the following properties will be passed: `selectionContent`, `selectionValue`, `selectionIndex`.
  shouldCloseOnClickBody, // [Boolean, default: false] Whether or not to close the dropdown on click body.
  shouldSetOptionContentToTitle // [Boolean, default: false] Whether or not to set the content of each option to its title. This is useful when some of the options are expected to exceed the width of the select dropdown.
}
```

## Public methods

### `isOpen()`
Is dropdown menu open - returns `true`/`false`

### `close()`
Closes the dropdown menu

### `open()`
Opens the dropdown menu

### `toggle()`
Toggles the dropdown menu

### `getContent()`
Returns the content of the currently selected option

### `getValue()`
Returns the value of the currently selected option

### `getIndex()`
Returns the index of the currently selected option

### `setIndex(index)`
Selects an option based on its index

## Generated markup
For the following native select element
```html
<select id="example-select" tabindex="1">
  <option value="value1" data-some-attr="some-attr-value" class="some-class">Option 1</option>
  <option value="value2" title="Some title">Option 2</option>
  <option value="value3">Option 3</option>
</select>
```

The following markup will be generated:
```html
<div class="selectise" id="example-select" tabindex="1">
  <div class="selectise-trigger" tabindex="1">Option 1</div>
  <div class="selectise-options">
    <div data-value="value1" data-some-attr="some-attr-value" class="some-class selectise-option" tabindex="1">Option 1</div>
    <div data-value="value2" title="Some title" class="selectise-option" tabindex="1">Option 2</div>
    <div data-value="value3" class="selectise-option" tabindex="1">Option 3</div>
  </div>
</div>
```

## CSS classes used

### `selectise`
Added to the top level custom select element, which contains the trigger and options elements

### `selectise-trigger`
Added to the trigger element, which holds the selected value and toggles the dropdown

### `selectise-options`
Added to the element containing the options

### `selectise-option`
Added to each custom option element

### `selectise-open`
Will be added to the Selectise element when the dropdown is open (and removed when it is closed)


## Dependencies

None

## Contributing

Feel free to submit issues and pull requests

## Development

* Run the following, which will serve the Selctise example on localhost:8081 and watch for changes.
```
npm start
```

* Navigate to http://localhost:8081/example/ to view the output
* Test the library in `src/example`:
  * index.html
  * index.js
  * index.scss
* Edit the library itself in `src`:
  * index.js
  * _selectise_base.scss
  * _selectise_theme.scss

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
