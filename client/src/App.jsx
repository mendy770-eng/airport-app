import UpperBar from './components/UpperBar';
import './App.css';
import Footer from './components/Footer.jsx';
import Map from './components/Map.jsx'
import { UserContextProvider } from './components/UserContext'
const App = () => {
  const user = {
    name: 'John',
    email: 'john@example.com',
    role: 'admin',
    isLoggedIn: true,
  };

    return (
      <UserContextProvider value={{ user}}>
        <div className="home-container">
            <UpperBar />
            <main className="main-content">
                <Map />
            </main>
            <Footer />
        </div>
      </UserContextProvider>
    );
}

export default App;