import { Box } from '@mui/material';
import UpperBar from '../components/UpperBar';
import './css/Home.css';
import BottomBar from '../components/BottomBar';
import Map from '../components/Map';


const HomePage = () => {
    return <Box>
        <UpperBar />
        <Map />
        <BottomBar />
    </Box>
}

export default HomePage;