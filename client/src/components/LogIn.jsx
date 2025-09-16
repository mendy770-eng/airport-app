import { useState, useContext } from 'react';
import { TextField, Box, Stack, Button, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';
import { login } from '../api/users';
import './css/Login.css';

export default function LogIn(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [Loading, setLoading] = useState(false);
    const {logUser} = useContext(UserContext);

    const handleLogin=()=>{
        if(Loading){
            return;
        }
        if(!email || !password){
            return setError('Please fill all the fields');
        };
        setError(null);
        setLoading(true);
        login(email, password)
            .then(({data, token})=>{
                logUser(data, token);
                props.closeLogin();
            }).catch(err=>setError(err.message))
            .finally(()=>setLoading(false));
    }

    return <Box sx={{ padding: '5px' }}>
        <Stack spacing={1}>
            {error && <Typography color='error' variant='h6' >{error}</Typography>}
            <h1 className='login-title'>Login</h1>
            <TextField
                variant="outlined"
                label="Email"
                size='small'
                value={email}
                onChange={ev => setEmail(ev.target.value)} 
                disabled={Loading}
                />
            <TextField
                variant="outlined"
                label="Password"
                type="password"
                size='small'
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                disabled={Loading} />
            <Button startIcon={<LoginIcon />} variant="contained" size="small" onClick={handleLogin} disabled={Loading}>
                Log In
            </Button>
            <Button startIcon={<PersonAddIcon />} variant="contained" size="small" onClick={props.openRegister} disabled={Loading}>
                Register
            </Button>
        </Stack>
    </Box>
};

LogIn.propTypes = {
    openRegister: PropTypes.func.isRequired
};