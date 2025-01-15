/* eslint-disable react/prop-types */
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

/**
 * Button to return to the main list
 * @param {Function} [props.returnCallback=null] Optional. Callback to execute when the button is clicked
 */
export default function GoMainListButton({ text = null, returnCallback = null }) {
  const navigate = useNavigate()

  const handleReturn = () => {
    if (returnCallback) {
      returnCallback()
    } else {
      navigate('/')
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
