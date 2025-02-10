import { Container, Navbar } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export default function AppHeader() {
  const { t } = useTranslation()
  const title = useSelector((state) => state.app.title)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>{t(title)}</Navbar.Brand>
      </Container>
    </Navbar>
  )
}
