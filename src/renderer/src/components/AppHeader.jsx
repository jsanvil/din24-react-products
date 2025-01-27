import { Container, Navbar } from 'react-bootstrap'
import { useSelector } from 'react-redux'

export default function AppHeader() {
  const title = useSelector((state) => state.app.title)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>{title}</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
