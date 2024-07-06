import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import searchReducer from './search/searchSlice'
import searchResultsReducer from './searchResult/searchResultsSlice'
export const store= configureStore({
  reducer: {
    user:userReducer,
    searchOptions:searchReducer,
    searchResults:searchResultsReducer
  },
})