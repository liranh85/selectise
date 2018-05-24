/**
 * Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)
 *
 * Usage:
 * const selectise = new Selectise({
      nativeSelectElm,
      onSelect,
      setOptionContentToTitle
    })
 *
 * Parameters:
 * @param {Element} nativeSelect The `select` element to be transformed
 * @param {Function} onSelect (Optional) Callback function. Will be called when an option has been selected. When called, an Object with the following properties will be passed: `selectionContent`, `selectionValue`, `selectionIndex`.
 *
 * Public methods:
 * @method isOpen is dropdown menu open - returns true/false
 * @method closeDropdown closes the dropdown menu
 * @method closeDropdown opens the dropdown menu
 * @method toggleDropdown toggles the dropdown menu
 * @method getContent returns the content of the currently selected option
 * @method getValue returns the value of the currently selected option
 * @method getIndex returns the index of the currently selected option
 * @method setIndex selects an option based on its index
 *
 * Author: Liran Harary
 * Initial release: May 2018
 */

class Selectise {
  constructor (nativeSelectElm, { onSelect, setOptionContentToTitle = false } = {}) {
    this.state = {
      index: null,
      isOpen: false,
      value: null
    }
    this.data = {
      callbacks: {
        onSelect
      },
      settings: {
        setOptionContentToTitle
      },
      ui: {
        elements: {
          nativeSelect: nativeSelectElm,
          selectise: null,
          trigger: null,
          options: null
        },
        cssClasses: {
          selectise: 'selectise',
          trigger: 'selectise-trigger',
          options: 'selectise-options',
          option: 'selectise-option'
        }
      }
    }
    this._init()
  }

  _init () {
    this._buildComponentMarkup()
    this._initState()
    this._setupEvents()
  }

  _buildComponentMarkup = () => {
    const { cssClasses, elements } = this.data.ui
    const { setOptionContentToTitle } = this.data.settings
    const tabIndex = elements.nativeSelect.getAttribute('tabindex')
    elements.selectise = document.createElement('div')
    elements.selectise.classList.add(cssClasses.selectise)
    this._copyAttributes(elements.nativeSelect, elements.selectise)

    elements.trigger = document.createElement('div')
    elements.trigger.classList.add(cssClasses.trigger)
    elements.trigger.setAttribute('tabindex', tabIndex)
    elements.trigger.setAttribute('role', 'Selected value')
    elements.selectise.appendChild(elements.trigger)

    elements.options = document.createElement('div')
    elements.options.classList.add(cssClasses.options)
    elements.selectise.appendChild(elements.options)

    const nativeOptions = elements.nativeSelect.children
    Array.prototype.forEach.call(nativeOptions, nativeOptionElm => {
      const optionElm = document.createElement('div')
      optionElm.innerHTML = nativeOptionElm.innerHTML
      this._copyAttributes(nativeOptionElm, optionElm)
      optionElm.classList.add(cssClasses.option)
      if (setOptionContentToTitle) {
        optionElm.setAttribute('title', optionElm.innerHTML)
      }
      optionElm.setAttribute('tabindex', tabIndex)
      elements.options.appendChild(optionElm)
    })

    elements.trigger.innerHTML = elements.options.children[0].innerHTML

    this._replaceNativeSelectWithCustomSelect(
      elements.nativeSelect,
      elements.selectise
    )
  }

  _copyAttributes (src, dest) {
    Array.prototype.forEach.call(src.attributes, attr => {
      const name = attr.name === 'value' ? 'data-value' : attr.name
      const value = attr.value
      dest.setAttribute(name, value)
    })
  }

  _replaceNativeSelectWithCustomSelect (nativeSelect, selectise) {
    nativeSelect.parentNode.insertBefore(selectise, nativeSelect)
    nativeSelect.parentNode.removeChild(nativeSelect)
  }

  _initState = () => {
    const { elements } = this.data.ui
    this.state.index = 0
    this.state.value = elements.options.children[0].dataset.value
    elements.selectise.value = this.state.value
  }

  _setupEvents = () => {
    const { elements } = this.data.ui
    elements.trigger.addEventListener('click', this.toggleDropdown)
    elements.selectise.addEventListener('keydown', this._handleKeyDownTrigger)
    elements.options.addEventListener('click', this._handleSelectOption)
  }

  _handleSelectOption = event => {
    const { target } = event
    const { callbacks: { onSelect }, ui: { cssClasses, elements } } = this.data
    if (!target.classList.contains(cssClasses.option)) {
      return
    }
    const selectionContent = target.innerHTML
    const selectionValue = target.dataset.value
    const selectionIndex = Array.prototype.indexOf.call(
      target.parentNode.childNodes,
      target
    )
    elements.trigger.innerHTML = selectionContent
    this.state.value = selectionValue
    this.state.index = selectionIndex
    elements.selectise.value = this.state.value
    elements.trigger.setAttribute('title', selectionContent)
    this.closeDropdown()
    if (onSelect) {
      onSelect({
        selectionContent,
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
        if (this.state.index === null) {
          this.state.index = 0
        } else if (this.state.index < numOptions - 1) {
          this.state.index++
        }
      } else {
        if (this.state.index > 0) {
          this.state.index--
        }
      }

      this._setIndexHover(previousIndex)
    } else if (keyCode === ENTER) {
      const currentIndex = this.state.index
      if (currentIndex !== null) {
        this.setIndex(currentIndex)
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
    const currentIndex = this.state.index
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

  isOpen = () => {
    return this.state.isOpen
  }

  closeDropdown = () => {
    const { elements } = this.data.ui
    this.state.isOpen = false
    elements.selectise.classList.remove('open')
    elements.trigger.focus()
  }

  openDropdown = () => {
    const { elements } = this.data.ui
    this.state.isOpen = true
    elements.selectise.classList.add('open')
    elements.trigger.focus()
  }

  toggleDropdown = () => {
    const { elements } = this.data.ui
    this.state.isOpen = !this.state.isOpen
    elements.selectise.classList.toggle('open')
    elements.trigger.focus()
  }

  getContent = () => {
    return this.data.ui.elements.options.children[this.state.index].innerText
  }

  getIndex = () => {
    return this.state.index
  }

  getValue = () => {
    return this.state.value
  }

  setIndex = index => {
    const { children: optionNodes } = this.data.ui.elements.options
    if (index >= optionNodes.length) {
      return
    }
    this._handleSelectOption({ target: optionNodes[index] })
  }
}

export default Selectise
