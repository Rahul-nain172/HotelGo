import { createSlice } from "@reduxjs/toolkit";

const initialState={
    hotels:[],
    count:0,
    pageNumber:1,
}
const searchResultSlice=createSlice({
    name:'searchResults',
    initialState,
    reducers:{
        setSearchResults:(state,action)=>{
            const {hotels,pagination}=action.payload;
            state.hotels=hotels;
            state.count=pagination.total;
            state.pageNumber=pagination.page;

        },
        setCount:(state,action)=>{
            state.count=parseInt(action.payload);
        },
        setPageNumber:(state,action)=>{
            state.count=parseInt(action.payload);
        }
    }
})
export const {setSearchResults,setCount,setPageNumber}=searchResultSlice.actions;
export default searchResultSlice.reducer;