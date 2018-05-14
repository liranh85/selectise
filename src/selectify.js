/**
 * Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)
 *
 * Usage:
 * const selectify = new Selectify({
      nativeSelectElm,
      onSelect
    })
 *
 * Parameters:
 * @param {Element} nativeSelect The `select` element to be transformed
 * @param {Function} onSelect (Optional) Callback function. Will be called when an option has been selected. When called, an Object with the following properties will be passed: `selectionName`, `selectionValue`, `selectionIndex`.
 *
 * Public methods:
 * @method toggleDropdown
 * @method closeDropdown
 * @method getSelectionValue
 * @method setSelectedIndex
 *
 * Requires the selectify-base.scss to work properly. You should use the supplied _selectify-theme.scss if you're not setting your own styles.
 *
 * Features:
 *  - Ability to style the `select` element freely using CSS
 *  - CSS theme (using _selectify-theme.scss)
 *  - Keyboard shortcuts:
 *    - `Enter` to open dropdown, when the trigger is focused
 *    - Arrow up/down to navigate the dropdown's option list
 *    - `Esc` to close the dropdown, when it is open.
 *  - Copies all attributes from native `select` and `option` elements to corresponding elements in the Selectify markup
 *    - `select` element:
 *      - Copies all attributes
 *      - If `tabindex` exists, it will also be copied to the trigger element and to each option element
 *    - `option` elements:
 *      - Copies all attributes.
 *      - If `value` attribute exists, it will be copied as `data-value`.
 *  - Supports screen readers thanks to two three factors:
 *    - Copying the tabindex from the `select` element
 *    - Supporting keyboard shortcuts
 *    - Focusing the current option when using the keyboard to navigate the options list
 *    - Focusing the trigger once a selection has been made (this both confirms the selection to the accessiblilty user, and allows for an easy re-opening of the options dropdown)
 *
 * Author: Liran Harary
 * Date completed: April 2018
 */

class Selectify {
  constructor ({ nativeSelectElm, onSelect }) {
    this.state = {
      currentIndex: null,
      isOpen: false,
      selectionValue: null
    }
    this.data = {
      callbacks: {
        onSelect
      },
      ui: {
        elements: {
          nativeSelect: nativeSelectElm,
          selectify: null,
          trigger: null,
          options: null
        },
        cssClasses: {
          selectify: 'selectify',
          trigger: 'selectify-trigger',
          options: 'selectify-options',
          option: 'selectify-option'
        }
      }
    }
    this._init()
  }

  _init () {
    this._buildComponentMarkup()
    this._setupEvents()
  }

  _buildComponentMarkup = () => {
    let { cssClasses, elements } = this.data.ui
    const tabIndex = elements.nativeSelect.getAttribute('tabindex')
    elements.selectify = document.createElement('div')
    elements.selectify.classList.add(cssClasses.selectify)
    this._copyAttributes(elements.nativeSelect, elements.selectify)

    elements.trigger = document.createElement('div')
    elements.trigger.classList.add(cssClasses.trigger)
    elements.trigger.setAttribute('tabindex', tabIndex)
    elements.trigger.setAttribute('role', 'Selected value')
    elements.selectify.appendChild(elements.trigger)

    elements.options = document.createElement('div')
    elements.options.classList.add(cssClasses.options)
    elements.selectify.appendChild(elements.options)

    const nativeOptions = elements.nativeSelect.children
    Array.prototype.forEach.call(nativeOptions, nativeOptionElm => {
      const optionElm = document.createElement('div')
      optionElm.innerHTML = nativeOptionElm.innerHTML
      this._copyAttributes(nativeOptionElm, optionElm)
      optionElm.classList.add(cssClasses.option)
      optionElm.setAttribute('title', optionElm.innerHTML)
      optionElm.setAttribute('tabindex', tabIndex)
      elements.options.appendChild(optionElm)
    })

    elements.trigger.innerHTML = elements.options.children[0].innerHTML

    this._replaceNativeSelectWithCustomSelect(
      elements.nativeSelect,
      elements.selectify
    )
  }

  _copyAttributes (src, dest) {
    Array.prototype.forEach.call(src.attributes, attr => {
      const name = attr.name === 'value' ? 'data-value' : attr.name
      const value = attr.value
      dest.setAttribute(name, value)
    })
  }

  _replaceNativeSelectWithCustomSelect (nativeSelect, selectify) {
    nativeSelect.parentNode.insertBefore(selectify, nativeSelect)
    nativeSelect.parentNode.removeChild(nativeSelect)
  }

  _setupEvents = () => {
    const { elements } = this.data.ui
    elements.trigger.addEventListener('click', this.toggleDropdown)
    elements.selectify.addEventListener('keydown', this._handleKeyDownTrigger)
    elements.options.addEventListener('click', this._handleSelectOption)
  }

  _handleSelectOption = event => {
    const { target } = event
    const { callbacks: { onSelect }, ui: { cssClasses, elements } } = this.data
    if (!target.classList.contains(cssClasses.option)) {
      return
    }
    const selectionName = target.innerHTML
    const selectionValue = target.dataset.value
    const selectionIndex = Array.prototype.indexOf.call(
      target.parentNode.childNodes,
      target
    )
    elements.trigger.innerHTML = selectionName
    this.state.selectionValue = selectionValue
    this.state.currentIndex = selectionIndex
    elements.trigger.setAttribute('title', selectionName)
    this.closeDropdown()
    if (onSelect) {
      onSelect({
        selectionName,
        selectionValue,
        selectionIndex
      })
    }
  }

  _handleKeyDownTrigger = event => {
    const numOptions = this.data.ui.elements.options.childNodes.length
    const { isOpen, currentIndex: previousIndex } = this.state
    const ARROW_DOWN = 40
    const ARROW_UP = 38
    const ENTER = 13
    const ESC = 27
    event = event || window.event
    const { keyCode } = event

    if (!isOpen) {
      if (keyCode === ENTER) {
        this.toggleDropdown()
        this._setIndexHover()
      }
      return
    }

    if (keyCode === ARROW_DOWN || keyCode === ARROW_UP) {
      if (keyCode === ARROW_DOWN) {
        if (this.state.currentIndex === null) {
          this.state.currentIndex = 0
        } else if (this.state.currentIndex < numOptions - 1) {
          this.state.currentIndex++
        }
      } else {
        if (this.state.currentIndex > 0) {
          this.state.currentIndex--
        }
      }

      this._setIndexHover(previousIndex)
    } else if (keyCode === ENTER) {
      const currentIndex = this.state.currentIndex
      if (currentIndex !== null) {
        this.setSelectedIndex(currentIndex)
      } else {
        this.closeDropdown()
      }
    } else if (keyCode === ESC) {
      this.closeDropdown()
      event.stopPropagation()
    }
  }

  _setIndexHover = previousIndex => {
    const optionsElm = this.data.ui.elements.options
    const optionElms = optionsElm.childNodes
    const numOptions = optionElms.length

    if (isIndexValid(previousIndex)) {
      optionElms[previousIndex].classList.remove('hover')
    }
    const currentIndex = this.state.currentIndex
    if (isIndexValid(currentIndex)) {
      optionElms[currentIndex].focus()
      if (previousIndex === null) {
        // Fixes bug where the parent element would scroll too much when attempting to focus its child element, thus hiding most of it.
        window.setTimeout(() => {
          optionsElm.scrollTop = 0
        }, 50)
      }
    }

    function isIndexValid (index) {
      return index !== null && index >= 0 && index < numOptions
    }
  }

  toggleDropdown = () => {
    const { elements } = this.data.ui
    this.state.isOpen = !this.state.isOpen
    elements.selectify.classList.toggle('open')
  }

  closeDropdown = () => {
    const { elements } = this.data.ui
    this.state.isOpen = false
    elements.selectify.classList.remove('open')
    elements.trigger.focus()
  }

  getSelectionValue = () => {
    return this.state.selectionValue
  }

  setSelectedIndex = index => {
    const { elements } = this.data.ui
    this._handleSelectOption({ target: elements.options.children[index] })
  }
}

export default Selectify
