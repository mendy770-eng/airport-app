import { useState } from 'react';
import { Modal, Box, Typography, Stack, TextField, Button, MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { register } from '../api/users';
import { useContext } from 'react';
import { UserContext } from './UserContext';


const userKeys = ['firstName', 'lastName', 'email', 'birthday', 'password', 'permission'];
export default function RegisterModal(props) {
    const [userInfo, setUserInfo] = useState({});
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState();
    const [Loading, setLoading] = useState(false);
    const { logUser } = useContext(UserContext);
    const handleChange = event => {
        const key = event.target.name;
        const value = event.target.value;
        setUserInfo({ ...userInfo, [key]: value })
    };

    const checkErrors = () => {
        const errorsObject = {};
        let success = true;
        for (let key of userKeys) {
            if (!userInfo[key]) {
                errorsObject[key] = 'This field is required';
                success = false;
            }
        }
        if (!errorsObject.email && !userInfo.email.match(/^[\w-.]+@[\w-.]+\.[\w.]+$/)) {
            errorsObject.email = 'Invalid email';
            success = false;
        }
        if (!errorsObject.password && userInfo.password.length != userInfo.confirmPassword.length) {
            errorsObject.confirmPassword = 'Passwords do not match';
            success = false;
        }
        setErrors(errorsObject);
        return success;
    }

    const onRegisterClick = () => {
        if (Loading) {
            return;
        }
        setServerError();
        setLoading(true);
        const noErrors = checkErrors();
        if (!noErrors) {
            setLoading(false);
            return;
        }
        const user = {};
        for (let key of userKeys)
            user[key] = userInfo[key]
        register(user)
            .then(({ data, token }) => {
                logUser(data, token);
                props.onClose();
            })
            .catch(error => {
                setServerError(error.message);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return <Modal open={props.open} onClose={props.onClose}>
        <Box sx={{
            padding: '5px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        }} >
            <Stack spacing={1}>
                <h1>Register</h1>
                <TextField
                    required
                    name="firstName"
                    variant="outlined"
                    label="Name"
                    size='small'
                    value={userInfo.firstName || ''}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={Loading} />
                <TextField
                    required
                    name="lastName"
                    variant="outlined"
                    label="LastName"
                    size='small'
                    value={userInfo.lastName || ''}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={Loading} />
                <TextField
                    required
                    name="email"
                    variant="outlined"
                    label="Email"
                    size='small'
                    value={userInfo.email || ''}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={Loading} />
                <BirthdayPicker
                    value={userInfo.birthday || null}
                    onChange={handleChange}
                    error={errors.birthday}
                    disabled={Loading} />
                <TextField
                    required
                    name="password"
                    variant="outlined"
                    label="Password"
                    size='small'
                    value={userInfo.password || ''}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={Loading} />
                <TextField
                    required
                    name="confirmPassword"
                    variant="outlined"
                    label="Confirm Password"
                    size='small'
                    value={userInfo.confirmPassword || ''}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={Loading} />
                <TextField
                    select
                    required
                    name="permission"
                    variant="outlined"
                    label="Permission"
                    size='small'
                    value={userInfo.permission || ''}
                    onChange={handleChange}
                    error={!!errors.permission}
                    helperText={errors.permission}
                    disabled={Loading}
                >
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="airport_inspector">Airport Inspector</MenuItem>
                    <MenuItem value="technician">Technician</MenuItem>
                    <MenuItem value="ground_attendant">Ground Attendant</MenuItem>
                </TextField>
                <Button variant="contained" size='small' onClick={onRegisterClick} disabled={Loading}>Register</Button>
                {serverError && <Typography color='error' variant='h6' >{serverError}</Typography>}
            </Stack>
        </Box>
    </Modal>
};

function BirthdayPicker(props) {
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
            label="Birthday"
            value={props.value}
            onChange={value => props.onChange({ target: { name: 'birthday', value } })}
            error={!!props.error}
            helperText={props.error || null}
            disabled={props.disabled}
            size='small'
        />
    </LocalizationProvider>
}