import { useContext } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { UserContext } from './UserContext';
import LogoutIcon from '@mui/icons-material/Logout';

export default function UserCard(props) {
    const { user, unlogUser } = useContext(UserContext);
    if (!user) {
        return null;
    }
    const handleLogout = () => {
        unlogUser();
        props.closeCard();
    };

    return <Box sx={{ padding: '5px' }}>
        <Stack spacing={1}>
            <Typography variant='h3' align='center'>Hello {user.firstName} </Typography>
            <Typography align='center'>The {user.permission}</Typography>
            <Typography variant='subtitle2' align='center'>{user.email}</Typography>
            <Button variant='contained' onClick={handleLogout}>
                <LogoutIcon />
                Logout
            </Button>
        </Stack>
    </Box>
}
