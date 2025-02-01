import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchPostSuggestions = createAsyncThunk(
  "posts/fetchPostSuggestions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance("/api/posts/following");
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAllPosts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance("/api/posts/all");
      return response.data.posts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    allPosts: [],

    loading: false,
    error: null,
    allPostsError: null,
    allPostsLoading: false,
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setAllPosts: (state, action) => {
      state.allPosts = action.payload;
    },

    // handle posts based on following status
    addFollowedPosts: (state, action) => {
      state.posts = [...state.posts,...action.payload];
    },
    deleteUnfollowedPosts:(state, action) => {
      state.posts = state.posts.filter((post) => {
        if (post.postBy!== action.payload) {
          return post;
        }
      });
    },

    // post addition
    addPostToPosts: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    addPostToAllPosts: (state, action) => {
      state.allPosts = [action.payload,...state.allPosts];
    },

    // post deletion
    deletePostFromPosts: (state, action) => {
      state.posts = state.posts.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
    },

    deletePostFromAllPosts: (state, action) => {
      state.allPosts = state.allPosts.filter((post, index) => {
        if (post._id !== action.payload) {
          return post;
        }
      });
    },

    // handle like action
    updateLikePosts: (state, action) => {
      const { postId, userId } = action.payload;
      state.posts = state.posts.map((p) => {
          if (p._id === postId) {
            const updatedLikes = p.likes.includes(userId)
              ? p.likes.filter((id) => id !== userId) // Unlike
              : [...p.likes, userId]; // Like
            return { ...p, likes: updatedLikes };
          }
          return p;
        })
    },

    updateLikeAllPosts: (state, action) => {
      const { postId, userId } = action.payload;
      state.allPosts = state.allPosts.map((p) => {
          if (p._id === postId) {
            const updatedLikes = p.likes.includes(userId)
              ? p.likes.filter((id) => id !== userId) // Unlike
              : [...p.likes, userId]; // Like
            return { ...p, likes: updatedLikes };
          }
          return p;
        })},

    commentOnPosts : (state, action) => {
      const { postId, userId, comment } = action.payload;
      state.posts = state.posts.map((p) => {
        if (p._id === postId) {
          return {...p, comments: [...p.comments, {user:userId, text:comment }] };
        }
        return p;
      });
      state.allPosts = state.allPosts.map((p) => {
        if (p._id === postId) {
          return {
            ...p,
            comments: [...p.comments, { user: userId, text: comment }],
          };
        }
        return p;
      });
    },
    commentOnAllPosts : (state, action) => {},
      
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllPosts.pending, (state) => {
        state.allPostsLoading = true;
        state.allPostsError = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.allPostsLoading = false;
        state.allPosts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.allPostsLoading = false;
        state.allPostsError = action.payload;
      });
  },
});

export const {
  setPosts,
  setAllPosts,addFollowedPosts,deleteUnfollowedPosts,
  addPostToAllPosts,
  addPostToPosts,
  deletePostFromAllPosts,
  deletePostFromPosts,
  updateLikePosts,updateLikeAllPosts,commentOnPosts
} = postsSlice.actions;
export default postsSlice.reducer;
