import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	/**
			inject the endpoint into the original apiSlice
	 */
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: () => "/users",
			validateStatus: (response, result) => {
				return response.status === 200 && !result.isError;
			},
			// keepUnusedDataFor: 5, // default is 60s, after the second it back to loading screen
			transformResponse: (responseData) => {
				// transform the data from backend
				const loadedUsers = responseData.map((user) => {
					user.id = user._id;
					return user;
				});
				return usersAdapter.setAll(initialState, loadedUsers);
			},
			providesTags: (result, error, arg) => {
				// the Tag must be register the tagTypes in the store
				if (result?.ids) {
					return [
						{ type: "User", id: "LIST" },
						...result.ids.map((id) => ({ type: "User", id })),
					];
				} else return [{ type: "User", id: "LIST" }];
			},
		}),
		addNewUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "POST",
				body: {
					...initialUserData,
				},
			}),
			// Focus Cache to update the User's List
			invalidatesTags: [{ type: "User", id: "LIST" }],
		}),
		updateUser: builder.mutation({
			query: (initialUserData) => ({
				url: "/users",
				method: "PATCH",
				body: {
					...initialUserData,
				},
			}),
			/*
				Focus Cache to update the User's id ( only one )
				it works because we provided the id tag in getUsers's providesTags fn
			*/
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
		deleteUser: builder.mutation({
			query: ({ id }) => ({
				url: `/users`,
				method: "DELETE",
				body: { id },
			}),
			invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useAddNewUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
	(state) => selectUsersData(state) ?? initialState
);
