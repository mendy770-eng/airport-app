import UpperBar from '../components/UpperBar';
import './css/Home.css';
import Footer from '../components/Footer';
import Map from '../components/Map';

const Home = () => {
    return (
        <div className="home-container">
            <UpperBar />
            <main className="main-content">
                <Map />
            </main>
            <Footer />
        </div>
    );
}

export default Home;