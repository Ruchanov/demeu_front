import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, registerRequest } from './authApi';

interface AuthState {
  user: any; 
  loading: boolean;
  error: string | null;
}

type RejectValue = string;

export const login = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: RejectValue }
>('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const response = await loginRequest(email, password);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка входа');
  }
});

export const register = createAsyncThunk<
  any,
  { email: string; password: string; phone: string },
  { rejectValue: RejectValue }
>('auth/register', async ({ email, password, phone }, thunkAPI) => {
  try {
    const response = await registerRequest(email, password, phone);
    return response;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Ошибка регистрации');
  }
});


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error occurred';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
