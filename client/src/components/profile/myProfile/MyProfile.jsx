import React, { useEffect, useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { UserContext } from '../../../App';
import PhoneInput from 'react-phone-input-2';
import { fetchUser, updateUser } from "../../../api";
import './MyProfile.css'; 

const MyProfile = () => {
    const [currentUser, setCurrentUser] = useContext(UserContext);
    const [user, setUser] = useState({});

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const getUser = async (id) => {
        try {
            const result = await fetchUser(id);
            setUser(result[0]);
            setValue('name', result[0].name);
            setValue('email', result[0].email);
            setValue('phone', result[0].phone);
        } catch (error) {
            if (error.message.includes('Refresh token failed')) {
                alert('Session expired. Please log in again.');
                navigate('auth/login'); 
            }
            else {
                alert("Oops, something went wrong... please try again!");
            }
        }
    }

    useEffect(() => {
        if (!currentUser) {
            getUser(JSON.parse(localStorage.getItem("currentUser")).id);
        }
        else {
            getUser(currentUser.id);
        }

    }, [])

    const updateDetails = async (updatedUser) => {
        try {
            await updateUser(currentUser.id, updatedUser);
            alert("User updated successfully!");
        } catch (error) {
            if (error.message.includes('Refresh token failed')) {
                alert('Session expired. Please log in again.');
                navigate('/login'); // Navigate to the login page
            }
            else {
                alert("Oops, something went wrong... please try again!");
            }
        }
    }

    const onSubmit = (data) => {
        let updatedUser = {};
        if (data.name !== user?.name) {
            updatedUser = { ...updatedUser, name: data.name }
        }
        if (data.email !== user?.email) {
            updatedUser = { ...updatedUser, email: data.email }
        }
        if (data.phone !== user?.phone) {
            updatedUser = { ...updatedUser, phone: data.phone }
        }
        updateDetails(updatedUser);
    };

    return (
        <div className='profile-container'>
            <h1>My Profile</h1>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    name="name"
                    {...register("name", {
                        required: "Name is required.",
                        pattern: {
                            value: /^[a-zA-Z. ]+$/,
                            message: "Name is not valid."
                        }
                    })}
                />
                {errors.name && <p>{errors.name.message}</p>}

                <input
                    type="email"
                    name="email"
                    {...register("email", {
                        required: "Email is required.",
                        pattern: {
                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                            message: "Email is not valid."
                        }
                    })}
                />
                {errors.email && <p>{errors.email.message}</p>}

                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <Controller
                        name="phone"
                        control={control}
                        rules={{
                            required: 'Phone number is required',
                            validate: (value) => {
                                const phoneNumber = value.replace(/\D/g, '');
                                return phoneNumber.length >= 10 && phoneNumber.length <= 14 || 'Invalid phone number format';
                            }
                        }}
                        render={({ field }) => (
                            <PhoneInput
                                country={'us'}
                                value={field.value}
                                onChange={field.onChange}
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: true
                                }}
                            />
                        )}
                    />
                    {errors.phone && <p>{errors.phone.message}</p>}
                </div>

                <input type="submit" value="Update Details" />
            </form>
        </div>
    );
}

export default MyProfile;
