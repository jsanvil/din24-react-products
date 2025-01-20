/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap'
import Navigation from '../helpers/Navigation'

/**
 * Button to return to the main list
 * @param {Function} [props.returnCallback=null] Optional. Callback to execute when the button is clicked, default is to return to the main list
 */
export default function GoMainListButton({ text = null, returnCallback = null }) {
  const nav = new Navigation()

  const handleReturn = () => {
    if (returnCallback) {
      returnCallback()
    } else {
      nav.mainList()
    }
  }

  return (
    <>
      <Button variant="primary" onClick={handleReturn}>
        {text || <i className="bi bi-arrow-left" />}
      </Button>
    </>
  )
}
