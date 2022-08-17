import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
	tagTypes: ["Note", "User"], // use for cache data
	endpoints: (builder) => ({}),
});
