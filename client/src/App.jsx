import './App.css'
import { UserContextProvider } from './components/UserContext'
import Home from './pages/Home'
import { EmergencyProvider } from './utils/EmergencySituation'

function App() {
  return (
    <EmergencyProvider>
      <UserContextProvider>
        <Home />
      </UserContextProvider>
    </EmergencyProvider>
  )
}

export default App