import { Box } from '@mui/material';
import UpperBar from '../components/UpperBar';
import './css/Home.css';
import Footer from '../components/Footer';
import Map from '../components/Map';


const HomePage = () => {
    return <Box>
        <header>
            <UpperBar />
        </header>
        <main>
            <Map />
        </main>
        <footer>
            <Footer />
        </footer>
    </Box>
}

export default HomePage;