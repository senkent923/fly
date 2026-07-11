import Modal from './Modal'
import AuthForm from './AuthForm'
import { useApp } from '../store/AppContext'

export default function AuthModal() {
  const { modal, closeModal } = useApp()
  const open = modal === 'auth'

  return (
    <Modal open={open} onClose={closeModal} title="Личный кабинет">
      <AuthForm onSuccess={closeModal} />
    </Modal>
  )
}
