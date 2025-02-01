import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAccountSuggestions = createAsyncThunk(
  "accounts/fetchAccountSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance("/api/users/suggested");
      return response.data.suggestedUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProfileAccountSuggestions = createAsyncThunk(
  "accounts/fetchProfileAccountSuggestions",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/users/suggested/${username}`);
      return response.data.profileSuggestedUsers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const accountsSlice = createSlice({
  name: "accounts",
  initialState: {
    accounts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAccounts : (state,action)=>{
      state.accounts = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccountSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProfileAccountSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileAccountSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchProfileAccountSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setAccounts} = accountsSlice.actions;
export default accountsSlice.reducer;
