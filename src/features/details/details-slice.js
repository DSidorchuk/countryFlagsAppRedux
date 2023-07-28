import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
   currentCountry: null,
   status: 'idle',
   error: null,
   neighbors: [],
}

export const loadCountryByName = createAsyncThunk(
   '@@details/load-country-by-name',
   (name, {
      extra: {api, client}
   }) => {
      return client.get(api.searchByCountry(name))
   }
)

export const loadNeighborsByBorder = createAsyncThunk(
   '@@details/load-neighbors',
   async (borders, {
      extra: {api, client}
   }) => {
      return client.get(api.filterByCode(borders))
   }
)

const detailsSlice = createSlice({
   name: '@@details',
   initialState,
   reducers: {
      clearDetails: () => initialState,
   },
   extraReducers: (builder) => {
      builder
         .addCase(loadCountryByName.fulfilled, (state, action) => {
            state.currentCountry = action.payload.data[0]
         })
         .addCase(loadNeighborsByBorder.fulfilled, (state, action) => {
            state.neighbors = action.payload.data.map(country => country.name)
         })
         .addMatcher((action) => action.type.endsWith('/pending'), (state) => {
            state.status = 'loading';
            state.error = null;
         })
         .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            state.status = 'rejected';
            state.error = action.payload || action.meta.error;
         })
         .addMatcher((action) => action.type.endsWith('/fulfilled'), (state) => {
            state.status = 'received';
         })
   }
})

export const {clearDetails} = detailsSlice.actions;
export const detailsReducer = detailsSlice.reducer;


// selectors
export const selectCurrentCountry = (state) => state.details.currentCountry;
export const selectDetails = (state) => state.details;
export const selectNeighbors = (state) => state.details.neighbors;