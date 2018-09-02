import Selectise from '../index'
import '../scss/_selectise-custom.scss'

const selectise = new Selectise('#example-select', {
  onSelect: ({ selectionContent, selectionValue, selectionIndex }) => {
    console.log(
      `Selection made. Content: ${selectionContent}; Value: ${selectionValue}; Index: ${selectionIndex}`
    )
  },
  shouldCloseOnClickBody: true
})
