# Selectise

Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)

## Installation

```
npm install selectise
```

## Usage

### JS
```js
import Selectise from 'selectise'

const nativeSelectElm = document.getElementById('your-native-select-element-id')
const selectise = new Selectise(nativeSelectElm)
```

### SCSS

Requires selectise-base.scss to work properly. You should also use _selectise-theme.scss if you're not setting your own styles.
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
  var nativeSelectElm = document.getElementById('your-native-select-element-id');
  var selectise = new Selectise.default(nativeSelectElm);
</script>
```


## Features

  - Ability to style the `select` element freely using CSS
  - CSS theme out of the box (using _selectise-theme.scss)
  - Keyboard shortcuts:
    - _Enter_ to open dropdown, when the trigger is focused
    - _Arrow up/down_ to navigate the dropdown's option list, when it is opened
    - _Esc_ to close the dropdown, when it is opened
  - Copies all attributes from native `select` and `option` elements to corresponding elements in the Selectise markup
    - `select` element:
      - Copies all attributes
      - If `tabindex` exists, it will also be copied to the trigger element and to each option element
    - `option` elements:
      - Copies all attributes
      - If `value` attribute exists, it will be copied as `data-value`
  - Supports screen readers thanks to two three factors:
    - Copying the tabindex from the `select` element
    - Supporting keyboard shortcuts
    - Focusing the current option when using the keyboard to navigate the options list
    - Focusing the trigger once a selection has been made (this both confirms the selection to the accessiblilty user, and allows for an easy re-opening of the options dropdown)

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
