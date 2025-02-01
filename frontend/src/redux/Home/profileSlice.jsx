import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchProfile = createAsyncThunk(
  "accounts/fetchProfile",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/users/profile/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTweets = createAsyncThunk(
  "accounts/fetchTweets",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/posts/user/${username}`);
      return response.data?.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLikedPosts = createAsyncThunk(
  "accounts/fetchLikedPosts",
  async (username, { rejectWithValue }) => {
    try {
      const response = await axiosInstance(`/api/posts/liked/${username}`);
      return response.data?.likedPosts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    isUser: false,
    fetchNeeded: false,
    tweets: [],
    likedPosts: [],
    loading: false,
    tweetsLoading: false,
    likedPostsLoading: false,
    error: null,
  },
  reducers: {
    setIsUser: (state, action) => {
      state.isUser = action.payload;
    },

    handleProfileFollowingStatus: (state, action) => {
      state.loading = true;
      const profileId = action.payload;
      state.profile.following.includes(profileId)
        ? (state.profile.following = state.profile.following.filter(
            (followerId) => followerId !== profileId
          ))
        : (state.profile.following = [...state.profile.following, profileId]);
      state.loading = false;
    },

    handleProfileFollowersStatus: (state, action) => {
      const userId = action.payload;
      state.profile.followers.includes(userId)
        ? (state.profile.followers = state.profile.followers.filter(
            (followerId) => followerId !== userId
          ))
        : (state.profile.followers = [...state.profile.followers, userId]);
    },

    deletePostFromTweets: (state, action) => {
      state.tweetsLoading = true;
      state.tweets = state.tweets.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
      state.tweetsLoading = false;
    },

    deletePostFromLikedPosts: (state, action) => {
      state.likedPostsLoading = true;
      state.likedPosts = state.likedPosts.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
      state.likedPostsLoading = false;
    },

    updateProfileLike: (state, action) => {
      const { postId, userId } = action.payload;
      state.tweets = state.tweets.map((p) => {
        if (p._id === postId) {
          const updatedLikes = p.likes.includes(userId)
            ? p.likes.filter((id) => id !== userId) // Unlike
            : [...p.likes, userId]; // Like
          return { ...p, likes: updatedLikes };
        }
        return p;
      });

      state.likedPosts = state.likedPosts.map((p) => {
        if (p._id === postId) {
          const updatedLikes = p.likes.includes(userId)
            ? p.likes.filter((id) => id !== userId) // Unlike
            : [...p.likes, userId]; // Like
          return { ...p, likes: updatedLikes };
        }
        return p;
      });
    },

    updateUserProfileLike: (state, action) => {
      const { postId, userId } = action.payload;
      state.tweets = state.tweets.map((p) => {
        if (p._id === postId) {
          const updatedLikes = p.likes.includes(userId)
            ? p.likes.filter((id) => id !== userId) // Unlike
            : [...p.likes, userId]; // Like
          return { ...p, likes: updatedLikes };
        }
        return p;
      });

      state.fetchNeeded = true;
    },

    updateFetchNeeded: (state, action) => {
      state.fetchNeeded = false;
    },

    commentOnPostBoth: (state, action) => {
      const { postId, userId, comment } = action.payload;
      state.tweetsLoading = true;
      state.likedPostsLoading = true;
      state.tweets = state.tweets.map((post, index) => {
        if (post._id == postId) {
          return {
            ...post,
            comments: [...post.comments, { text: comment, user: userId }],
          };
        }
        return post;
      });
      state.likedPosts = state.likedPosts.map((post, index) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, { text: comment, user: userId }],
          };
        }
        return post;
      });
      state.tweetsLoading = false;
      state.likedPostsLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTweets.pending, (state) => {
        state.tweetsLoading = true;
        state.error = null;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.tweetsLoading = false;
        state.tweets = action.payload;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.tweetsLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchLikedPosts.pending, (state) => {
        state.likedPostsLoading = true;
        state.error = null;
      })
      .addCase(fetchLikedPosts.fulfilled, (state, action) => {
        state.likedPostsLoading = false;
        state.likedPosts = action.payload;
      })
      .addCase(fetchLikedPosts.rejected, (state, action) => {
        state.likedPostsLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setIsUser,
  handleProfileFollowingStatus,
  handleProfileFollowersStatus,
  deletePostFromLikedPosts,
  deletePostFromTweets,
  updateProfileLike,
  commentOnPostBoth,
  updateUserProfileLike,
  updateFetchNeeded,
} = profileSlice.actions;
export default profileSlice.reducer;
