import React, { useReducer } from "react";
import createDataContext from "./createDataContext";
import jsonServer from "../api/jsonServer";

const blogReducer = (state, action) => {
  switch (action.type) {
    case "get_blogPosts":
      return action.payload;
    case "edit_blogPost":
      return state.map((blogPost) => {
        if (blogPost.id === action.payload.id) {
          return action.payload;
        } else {
          return blogPost;
        }
      });
    case "delete_blogPost":
      return state.filter((blogPost) => blogPost.id !== action.payload);
    default:
      return state;
  }
};

/*
const addBlogPost = () => {
      setBlogPost([...blogPost, {title: `Blog ${blogPost.length + 1} `}]);
  };

*/

const getBlogPost = (dispatch)=>{
  return async () => {
    try {
      const response = await jsonServer.get('/blogPosts');
      dispatch({type: "get_blogPosts", payload: response.data})
    }catch (e) {
      console.log("Error" + e);
    }
  }
};

const addBlogPost = (dispatch) => {
  return  async (title, content, callback) => {
    await jsonServer.post('/blogPosts', { title: title, content: content });

      if (callback)
      {
          callback();
      }
  };


};

const deleteBlogPost = (dispatch) => {
  return async (id) => {
    await jsonServer.delete(`/blogPosts/${id}`);

    dispatch({ type: "delete_blogPost", payload: id });
  };
};

const editBlogPost = (dispatch) => {
  return async (id, title, content, callback) => {
    await jsonServer.put(`/blogPosts/${id}`, {title, content});

    dispatch({
      type: "edit_blogPost",
      payload: { id: id, title: title, content: content },
    });
    if (callback)
    {
        callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  blogReducer,
  { addBlogPost, deleteBlogPost, editBlogPost, getBlogPost},[]
);
