import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiConfig } from "../../config/api.config";

export const postsApi = createApi({
  reducerPath: "postsApi",

  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,

    prepareHeaders: (headers) => {
      const token = apiConfig.getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["Posts"],

  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page = 1, limit = 6, params = {} }) => {
        const query = new URLSearchParams({
          page,
          limit,
          ...params,
        }).toString();

        return `/posts?${query}`;
      },

      providesTags: ["Posts"],
    }),

    runReddit: builder.mutation({
      query: () => ({
        url: "/reddit/run",
        method: "GET",
      }),

      invalidatesTags: ["Posts"],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useRunRedditMutation,
} = postsApi;

