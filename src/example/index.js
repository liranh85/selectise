import Selectise from '../index'
import './index.scss'

const exampleSelectElm = document.getElementById('example-select')

window.selectise = new Selectise(exampleSelectElm, {
  onSelect: ({ selectionContent, selectionValue, selectionIndex }) => {
    console.log(
      `Selection made. Content: ${selectionContent}; Value: ${selectionValue}; Index: ${selectionIndex}`
    )
  }
})
