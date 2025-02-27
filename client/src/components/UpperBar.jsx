import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import LogIn from './LogIn';
import RegisterModal from './RegisterModal';
import UserCard from './UserCard';
import airportLogo from '../assets/images/airportIconEdited.ico';
import weatherIcon from '../assets/images/weatherIcon.png';
import './css/upperBar.css';

function ResponsiveAppBar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showWeatherModal, setShowWeatherModal] = useState(false);
    const { user } = useContext(UserContext);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenRegisterModal = () => {
        handleCloseUserMenu();
        setShowRegisterModal(true);
    };

    const handleCloseRegisterModal = () => {
        setShowRegisterModal(false);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleWeatherClick = () => {
        setShowWeatherModal(true);
    };

    return (
        <AppBar position="static">
            <Toolbar className="app-bar-container">
                <div className="logo-section">
                    <Tooltip title="Airport System">
                        <img 
                            src={airportLogo} 
                            alt="Airport Logo" 
                            className="logo-image"
                        />
                    </Tooltip>
                    <div className="titles-container">
                        <Typography variant="h6" className="main-title">
                            AIRPORT SYSTEM
                        </Typography>
                        <Typography variant="subtitle2" className="sub-title">
                            fly beyond limits
                        </Typography>
                    </div>
                </div>

                <div className="weather-section">
                    <Tooltip title="Weather">
                        <img 
                            src={weatherIcon} 
                            alt="Weather"
                            className="weather-icon"
                            onClick={handleWeatherClick}
                        />
                    </Tooltip>
                </div>

                <div className="user-section">
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            {user ? <Avatar>{user.firstName[0]}{user.lastName[0]}</Avatar> : <Avatar />}
                        </IconButton>
                    </Tooltip>

                    <Popover
                        open={!!anchorElUser}
                        onClose={handleCloseUserMenu}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        {user ? 
                            <UserCard closeCard={handleCloseUserMenu} /> : 
                            <LogIn openRegister={handleOpenRegisterModal} closeLogin={handleCloseUserMenu} />
                        }
                    </Popover>
                </div>
            </Toolbar>
            <RegisterModal open={showRegisterModal} onClose={handleCloseRegisterModal} />
            
            {showWeatherModal && (
                <div className="weather-modal-overlay">
                    <div className="weather-modal">
                        <IconButton 
                            className="close-button"
                            onClick={() => setShowWeatherModal(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                        <h2>Weather Information</h2>
                        {/* כאן יהיה תוכן מזג האוויר */}
                    </div>
                </div>
            )}
        </AppBar>
    );
}

export default ResponsiveAppBar;