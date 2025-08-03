import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Grid,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import { loginUser } from '../../api/authService';
import { showErrorToast } from '../../utils/toastUtils';
import logo from "../../../public/img/logo.png"; // Adjust the path as necessary
import image from "../../../public/img/Vector.png"; // Adjust the path as necessary
import "./login.css"; // Adjust the path as necessary
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = ({ setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {
            email: !formData.email.includes('@') ? 'Please enter a valid email' : '',
            password: formData.password.length < 6 ? 'Password must be at least 6 characters' : ''
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await loginUser(formData);
            localStorage.setItem('authToken', response.token);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            showErrorToast(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (

        <div className='auth_Screen'>


            <div className='auth_Logo'>
                <div className='lg_icon'>
                    <img src={logo} alt="logo" />
                </div>
                <div className='lg_Ttl'>

                </div>
            </div>

            <div className='auth_inner'>
                <div className='auth_image'>
                    <img src={image} alt="image" />
                </div>
                <div className='auth_form'>
                    <div className='frm_inner'>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Welcome
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                            Enter your email and password to access your account
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                                margin="normal"
                                required
                            />

                            {/* <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={!!errors.password}
                                helperText={errors.password}
                                margin="normal"
                                required
                            /> */}

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={!!errors.password}
                                helperText={errors.password}
                                margin="normal"
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    backgroundColor: '#76030F',
                                    '&:hover': { backgroundColor: '#5a020c' },
                                    height: 48
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;