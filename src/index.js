/**
 * Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)
 *
 * Usage:
 * const selectise = new Selectise({
      nativeSelectElm,
      onSelect,
      shouldSetOptionContentToTitle,
      selectiseClassName,
      triggerClassName,
      optionsClassName,
      optionClassName
    })
 *
 * Parameters:
 * @param {Element} nativeSelect The `select` element to be transformed
 * @param {Function} onSelect (Optional) Callback function. Will be called when an option has been selected. When called, an Object with the following properties will be passed: `selectionContent`, `selectionValue`, `selectionIndex`.
 *
 * Public methods:
 * @method isOpen is dropdown menu open - returns true/false
 * @method close closes the dropdown menu
 * @method open opens the dropdown menu
 * @method toggle toggles the dropdown menu
 * @method getContent returns the content of the currently selected option
 * @method getValue returns the value of the currently selected option
 * @method getIndex returns the index of the currently selected option
 * @method setIndex selects an option based on its index
 *
 * Author: Liran Harary
 * Initial release: May 2018
 */

class Selectise {
  constructor (nativeSelectElm, opts = {}) {
    this.state = {
      hoverIndex: null,
      index: null,
      isOpen: false,
      value: null
    }

    this.opts = {
      onSelect: () => {},
      shouldSetOptionContentToTitle: false,
      ...opts
    }

    this.elms = {
      nativeSelect: nativeSelectElm,
      selectise: null,
      trigger: null,
      options: null
    }

    this.css = {
      selectise: 'selectise',
      trigger: 'selectise-trigger',
      options: 'selectise-options',
      option: 'selectise-option',
      open: 'selectise-open'
    }

    this._buildComponentMarkup()
    this._initState()
    this._setupEvents()
  }

  _buildComponentMarkup = () => {
    const { css, elms, opts } = this
    const tabIndex = elms.nativeSelect.getAttribute('tabindex')
    elms.selectise = document.createElement('div')
    elms.selectise.classList.add(css.selectise)
    this._copyAttributes(elms.nativeSelect, elms.selectise)

    elms.trigger = document.createElement('div')
    elms.trigger.classList.add(css.trigger)
    elms.trigger.setAttribute('tabindex', tabIndex)
    elms.trigger.setAttribute('role', 'Selected value')
    elms.selectise.appendChild(elms.trigger)

    elms.options = document.createElement('div')
    elms.options.classList.add(css.options)
    elms.selectise.appendChild(elms.options)

    const nativeOptions = elms.nativeSelect.children
    Array.prototype.forEach.call(nativeOptions, nativeOptionElm => {
      const optionElm = document.createElement('div')
      optionElm.innerHTML = nativeOptionElm.innerHTML
      this._copyAttributes(nativeOptionElm, optionElm)
      optionElm.classList.add(css.option)
      if (opts.shouldSetOptionContentToTitle) {
        optionElm.setAttribute('title', optionElm.innerHTML)
      }
      optionElm.setAttribute('tabindex', tabIndex)
      elms.options.appendChild(optionElm)
    })

    elms.selectise.value = elms.options.children[0].dataset.value
    elms.trigger.innerHTML = elms.options.children[0].innerHTML

    this._replaceNativeSelectWithCustomSelect(elms.nativeSelect, elms.selectise)
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
    this.state.index = 0
    this.state.isOpen = false
    this.state.value = this.elms.selectise.value
  }

  _setupEvents = () => {
    const { elms } = this
    elms.trigger.addEventListener('click', this.toggle)
    elms.selectise.addEventListener('keydown', this._handleKeyDownTrigger)
    elms.options.addEventListener('click', this._handleSelectOption)
  }

  _handleSelectOption = event => {
    const { target } = event
    const { css, elms, opts } = this
    if (!target.classList.contains(css.option)) {
      return
    }
    const selectionContent = target.innerHTML
    const selectionValue = target.dataset.value
    const selectionIndex = Array.prototype.indexOf.call(
      target.parentNode.childNodes,
      target
    )
    elms.trigger.innerHTML = selectionContent
    this.state.value = selectionValue
    this.state.index = selectionIndex
    elms.selectise.value = this.state.value
    elms.trigger.setAttribute('title', selectionContent)
    this.close()
    opts.onSelect({
      selectionContent,
      selectionValue,
      selectionIndex
    })
  }

  _handleKeyDownTrigger = event => {
    const numOptions = this.elms.options.childNodes.length
    const { isOpen, hoverIndex } = this.state
    const ARROW_DOWN = 40
    const ARROW_UP = 38
    const ENTER = 13
    const ESC = 27
    event = event || window.event
    const { keyCode } = event

    if (!isOpen) {
      if (keyCode === ENTER) {
        this.toggle()
        this._focusLastHoveredOption()
      }
      return
    }

    switch (keyCode) {
      case ARROW_DOWN:
        if (this.state.hoverIndex === null) {
          this.state.hoverIndex = 0
        } else if (this.state.hoverIndex < numOptions - 1) {
          this.state.hoverIndex++
        }
        this._focusLastHoveredOption()
        break
      case ARROW_UP:
        if (this.state.hoverIndex > 0) {
          this.state.hoverIndex--
        }
        this._focusLastHoveredOption()
        break
      case ENTER: {
        const currentIndex = this.state.hoverIndex
        if (currentIndex !== null) {
          this.setIndex(currentIndex)
        } else {
          this.close()
        }
        break
      }
      default:
        this.close()
        event.stopPropagation()
    }
  }

  _focusLastHoveredOption = () => {
    const optionElms = this.elms.options.childNodes
    const hoverIndex = this.state.hoverIndex
    if (hoverIndex !== null) {
      optionElms[hoverIndex].focus()
    }
  }

  isOpen = () => {
    return this.state.isOpen
  }

  close = () => {
    this.state.isOpen = false
    this.elms.selectise.classList.remove(this.css.open)
    this.elms.trigger.focus()
  }

  open = () => {
    this.state.isOpen = true
    this.elms.selectise.classList.add(this.css.open)
    this.elms.trigger.focus()
  }

  toggle = () => {
    this.state.isOpen = !this.state.isOpen
    this.elms.selectise.classList.toggle(this.css.open)
    this.elms.trigger.focus()
  }

  getContent = () => {
    return this.elms.options.children[this.state.index].innerText
  }

  getIndex = () => {
    return this.state.index
  }

  getValue = () => {
    return this.state.value
  }

  setIndex = index => {
    const { children: optionNodes } = this.elms.options
    if (index >= optionNodes.length) {
      return
    }
    this._handleSelectOption({ target: optionNodes[index] })
  }
}

export default Selectise
