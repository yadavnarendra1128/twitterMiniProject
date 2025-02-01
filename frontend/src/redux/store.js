import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Home/userSlice";
import AccountsReducer from "./Home/accountSlice";
import PostsReducer from "./Home/postSlice";
import ProfileReducer from "./Home/profileSlice";

const store = configureStore({
  reducer: {
    user: UserReducer,
    accounts: AccountsReducer,
    posts: PostsReducer,
    profile:ProfileReducer
  },
});

export default store;
