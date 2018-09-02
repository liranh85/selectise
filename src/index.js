/**
 * Transforms a native `select` element to a markup structure that allows styling using CSS (as opposed to the native `select` and `option` elements)
 *
 * Usage:
 * const selectise = new Selectise(nativeSelectElm, {
    onSelect,
    shouldCloseOnClickBody,
    shouldSetOptionContentToTitle
  })
 *
 * Parameters:
 * @param {Element|String} nativeSelect The reference or selector for the `select` element to be transformed
 * @param {Object} opts (Optional):
 *  - @property {Function} onSelect (Callback function) Will be called when an option has been selected. When called, an Object with the following properties will be passed: `selectionContent`, `selectionValue`, `selectionIndex`.
 *  - @property {Boolean} shouldCloseOnClickBody (Default: false) Whether or not to close the dropdown on click body.
 *  - @property {Boolean} shouldSetOptionContentToTitle (Default: false) Whether or not to set the content of each option to its title. This is useful when some of the options are expected to exceed the width of the select dropdown.
 *  - @property {Boolean} shouldReplaceSelectBeAsync (Default: false) Whether or to use setTimeout for replacing the native select with the custom select (Selectise). This can help in fixing the issue of Selectise getting focused on insertion to the DOM, which happens when using tabindex.
 *
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

import './index.scss'

class Selectise {
  constructor (nativeSelect, opts = {}) {
    this.state = {
      hoverIndex: null,
      index: null,
      isOpen: false,
      value: null
    }

    this.opts = {
      onSelect: () => {},
      shouldCloseOnClickBody: false,
      shouldSetOptionContentToTitle: false,
      shouldReplaceSelectBeAsync: false,
      ...opts
    }

    this.elms = {
      nativeSelect: this._getNativeSelectElm(nativeSelect),
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

  _getNativeSelectElm (nativeSelect) {
    if (typeof nativeSelect === 'string') {
      const elm = document.querySelector(nativeSelect)
      if (!elm) {
        throw new Error('Invalid selector passed for nativeSelect')
      }
      return elm
    }
    return nativeSelect
  }

  _buildComponentMarkup () {
    const { css, elms, opts, state } = this
    const tabIndex = elms.nativeSelect.getAttribute('tabindex')
    elms.selectise = document.createElement('div')
    this._copyAttributes(elms.nativeSelect, elms.selectise)
    elms.selectise.classList.add(css.selectise)

    elms.trigger = document.createElement('div')
    elms.trigger.classList.add(css.trigger)
    elms.trigger.setAttribute('tabindex', tabIndex)
    elms.selectise.appendChild(elms.trigger)

    elms.options = document.createElement('div')
    elms.options.classList.add(css.options)
    elms.selectise.appendChild(elms.options)

    const nativeOptions = elms.nativeSelect.children
    Array.prototype.forEach.call(nativeOptions, (nativeOptionElm, index) => {
      const optionElm = document.createElement('div')
      optionElm.innerHTML = nativeOptionElm.innerHTML
      this._copyAttributes(nativeOptionElm, optionElm)
      optionElm.removeAttribute('selected')

      optionElm.classList.add(css.option)
      if (opts.shouldSetOptionContentToTitle) {
        optionElm.setAttribute('title', optionElm.innerHTML)
      }
      optionElm.setAttribute('tabindex', tabIndex)
      elms.options.appendChild(optionElm)
      if (nativeOptionElm.selected) {
        state.index = index
        state.hoverIndex = index
      }
    })

    elms.selectise.value = elms.options.children[0].dataset.value
    elms.trigger.innerHTML = elms.options.children[0].innerHTML

    if (this.opts.shouldReplaceSelectBeAsync) {
      setTimeout(() => {
        this._replaceNativeSelectWithCustomSelect(
          elms.nativeSelect,
          elms.selectise
        )
      }, 0)
    } else {
      this._replaceNativeSelectWithCustomSelect(
        elms.nativeSelect,
        elms.selectise
      )
    }

    if (state.index) {
      this.setIndex(state.index)
    }
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

  _initState () {
    this.state.index = 0
    this.state.isOpen = false
    this.state.value = this.elms.selectise.value
  }

  _setupEvents () {
    const { elms, opts, state } = this
    if (opts.shouldCloseOnClickBody) {
      document.body.addEventListener('click', this.close)
    }
    elms.trigger.addEventListener('click', this._handleClickTrigger)
    elms.selectise.addEventListener('keydown', this._handleKeyDownTrigger)
    elms.options.addEventListener('click', this._handleClickOption)
  }

  _handleSelectOption ({ target }) {
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
    if (opts.shouldSetOptionContentToTitle) {
      elms.trigger.setAttribute('title', selectionContent)
    }
    this.close()
    this.elms.trigger.focus()
    opts.onSelect({
      selectionContent,
      selectionValue,
      selectionIndex
    })
  }

  _handleClickTrigger = event => {
    if (!this.state.isOpen) {
      event.stopPropagation()
    }
    this.toggle()
  }

  _handleKeyDownTrigger = event => {
    const { isOpen } = this.state
    const ARROW_DOWN = 40
    const ARROW_UP = 38
    const ENTER = 13
    const ESC = 27
    const TAB = 9
    event = event || window.event
    const { keyCode } = event

    if (!isOpen) {
      if (keyCode === ENTER) {
        this.open()
        this._focusLastHoveredOption()
      }
      return
    }

    switch (keyCode) {
      case ARROW_DOWN:
        event.preventDefault()
        this._handleDropdownNext()
        break

      case ARROW_UP:
        event.preventDefault()
        this._handleDropdownPrev()
        break

      case ENTER:
        this._handleDropdownEnter()
        break

      case ESC:
        this._handleDropdownEsc()
        break

      case TAB:
        if (event.shiftKey) {
          this._handleDropdownPrev(false)
        } else {
          this._handleDropdownNext(false)
        }
    }
  }

  _handleClickOption = event => {
    event.stopPropagation()
    this._handleSelectOption(event)
  }

  _focusLastHoveredOption () {
    const optionElms = this.elms.options.childNodes
    const hoverIndex = this.state.hoverIndex
    if (hoverIndex !== null) {
      optionElms[hoverIndex].focus()
    }
  }

  _handleDropdownNext (focusLastHoveredOption = true) {
    const numOptions = this.elms.options.childNodes.length

    if (this.state.hoverIndex === null) {
      this.state.hoverIndex = 0
      this._scrollToTop()
    } else if (this.state.hoverIndex < numOptions - 1) {
      this.state.hoverIndex++
    }
    if (focusLastHoveredOption) {
      this._focusLastHoveredOption()
    }
  }

  _handleDropdownPrev (focusLastHoveredOption = true) {
    if (this.state.hoverIndex > 0) {
      this.state.hoverIndex--
    }
    if (focusLastHoveredOption) {
      this._focusLastHoveredOption()
    }
  }

  _handleDropdownEnter () {
    const chosenIndex = this.state.hoverIndex
    if (chosenIndex !== null) {
      this.setIndex(chosenIndex)
    } else {
      this.close()
      this.elms.trigger.focus()
    }
  }

  _handleDropdownEsc () {
    event.stopPropagation()
    this.close()
    this.elms.trigger.focus()
    this.state.hoverIndex = this.state.index
  }

  _scrollToTop () {
    // Fixes bug where the parent element would scroll too much when attempting to focus its child element, thus hiding most of it.
    window.setTimeout(() => {
      this.elms.options.scrollTop = 0
    }, 50)
  }

  isOpen () {
    return this.state.isOpen
  }

  close = () => {
    this.state.isOpen = false
    this.elms.selectise.classList.remove(this.css.open)
  }

  open () {
    this.state.isOpen = true
    this.elms.selectise.classList.add(this.css.open)
  }

  toggle () {
    this.state.isOpen = !this.state.isOpen
    this.elms.selectise.classList.toggle(this.css.open)
  }

  getContent () {
    return this.elms.options.children[this.state.index].innerText
  }

  getIndex () {
    return this.state.index
  }

  getValue () {
    return this.state.value
  }

  setIndex (index) {
    const { children: optionNodes } = this.elms.options
    if (index >= optionNodes.length) {
      return
    }
    this._handleSelectOption({ target: optionNodes[index] })
  }

  destroy () {
    const { elms, opts } = this
    if (opts.shouldCloseOnClickBody) {
      document.body.removeEventListener('click', this.close)
    }
    elms.trigger.removeEventListener('click', this._handleClickTrigger)
    elms.selectise.removeEventListener('keydown', this._handleKeyDownTrigger)
    elms.options.removeEventListener('click', this._handleClickOption)
  }
}

export default Selectise
