import Selectify from './selectify'
import './index.scss'

const exampleSelectElm = document.getElementById('example-select')

const selectify = new Selectify(exampleSelectElm, {
  onSelect: ({ selectionContent, selectionValue, selectionIndex }) => {
    console.log(
      `Selection made. Content: ${selectionContent}; Value: ${selectionValue}; Index: ${selectionIndex}`
    )
  }
})
