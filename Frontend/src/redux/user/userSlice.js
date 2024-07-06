import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    isAdmin: false,
    userId: "",
    name: "",
    email: "",
    bookings: "",
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { userId, name, email, isAdmin } = action.payload;
            console.log(action.payload);
            state.userId = userId;
            state.name = name;
            state.email = email;
            state.isAdmin = isAdmin;
            state.isLoggedIn = true;
        },
        resetUser: (state) => {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.userId = "";
            state.name = "";
            state.email = "";
            state.bookings = "";
        },
    },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
