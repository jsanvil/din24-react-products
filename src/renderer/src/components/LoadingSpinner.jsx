import { Container, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default function LoadingSpinner() {
  const loading = useSelector((state) => state.app.loading)

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center gap-2">
      <Spinner animation="border" role="status"></Spinner>
      <span className="sr-only">{loading.text}</span>
    </Container>
  )
}
