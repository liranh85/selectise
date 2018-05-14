import Selectify from './selectify'
import './index.scss'

const selectify = new Selectify({
  nativeSelectElm: document.getElementById('example-select'),
  onSelect: ({
    selectionName,
    selectionValue,
    selectionIndex
  }) => {
    console.log(`Selection made. name: ${selectionName}; value: ${selectionValue}; index: ${selectionIndex}`)
  }
})