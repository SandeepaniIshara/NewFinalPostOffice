import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  data: object;
}

const initialState: UserState = {
  data: {},
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin: (state: UserState, action: { payload: object }) => {
      state.data = action.payload;
    },
    signout: (state: UserState) => {
        state.data = {};
    }
  },
})

export const { signin, signout } = userSlice.actions
export default userSlice.reducer