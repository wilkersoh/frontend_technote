import { apiSlice } from "../../app/api/apiSlice";
import { logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			/**
        @params {credentials} username and password
       */
			query: (credentials) => ({
				url: "/auth",
				method: "POST",
				body: { ...credentials },
			}),
		}),
		sendLogout: builder.mutation({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			/**
        RTK provide onQueryStarted
        can call inside our endpoint
       */
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log("sendLogout: ", data);

					dispatch(logOut());
					dispatch(apiSlice.util.resetApiState()); // clear the cache
				} catch (err) {
					console.log(err);
				}
			},
		}),
		refresh: builder.mutation({
			// use mutation even it is GET
			query: () => ({
				url: "/auth/refresh",
				method: "GET", // use GET, to get the access toke
			}),
		}),
	}),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
	authApiSlice;
