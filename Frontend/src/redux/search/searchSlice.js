import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hotelId:"",
    destination:"",
    checkIn:'',
    checkOut:'',
    adultCount:'',
    childCount:'',
    page:0,
    sortOption:"",
    stars:[],
    facilities:[],
    types:[],
    maxPrice:1000,
    minPrice:0,
};

export const searchSlice=createSlice({
    name:'searchOptions',
    initialState,
    reducers:{
        saveHotelId:(state,action)=>{
            state.hotelId=action.payload;
        },
        saveDestination:(state,action)=>{
            state.destination=action.payload;
        },
        saveCheckIn:(state,action)=>{
            state.checkIn=action.payload;
        },
        saveCheckOut:(state,action)=>{
            state.checkOut=action.payload;
        },
        saveAdultCount:(state,action)=>{
            state.adultCount=action.payload;
        },
        saveChildCount:(state,action)=>{
            state.childCount=action.payload;
        },
        savePage:(state,action)=>{
            state.page=action.payload;
        },
        saveSortOption:(state,action)=>{
            state.sortOption=action.payload;
        },
        addFacility:(state,action)=>{
            state.facilities=[action.payload,...(state.facilities)];
        },
        removeFacility:(state,action)=>{
            state.facilities=state.facilities.filter((facility)=>facility!==action.payload);
        },
        addStar:(state,action)=>{
            state.stars=[action.payload,...(state.stars)];
        },
        removeStar:(state,action)=>{
            state.stars=state.stars.filter((star)=>star!==action.payload);
        },
        addType:(state,action)=>{
            state.types=[action.payload,...state.types];
        },
        removeType:(state,action)=>{
            state.types=state.types.filter((type)=>type!==action.payload);
        },
        setMaxPrice:(state,action)=>{
            state.maxPrice=action.payload;
        },
        setMinPrice:(state,action)=>{
            
            state.minPrice=action.payload;
        },
        resetSearchOption:(state,action)=>{
            state.hotelId=""
            state.destination=""
            state.checkIn=new Date()
            state.checkOut=new Date()
            state.adultCount=0
            state.childCount=0
            state.page=0
        }
    }

});
export const {saveAdultCount,saveCheckIn,saveCheckOut,saveChildCount,saveDestination,saveHotelId
    ,savePage,saveSortOption,resetSearchOption,addFacility,addStar,addType,removeFacility,removeStar,removeType,setMaxPrice,setMinPrice}=searchSlice.actions;
export default searchSlice.reducer;