import './App.css'
import { UserContextProvider } from './components/UserContext'
import Home from './pages/Home'

function App() {
  return <UserContextProvider>
    <Home />
  </UserContextProvider>
}



export default App