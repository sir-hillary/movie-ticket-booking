import  User  from "../models/User.js";
import { Inngest } from "inngest";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticketing-app" });


//Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url} = event.data;
        const userData = {
            _id: id,
            name: first_name + " " + last_name,
            email: email_addresses[0]?.email_address || "",
            imageUrl: image_url || ""
        };
        await User.create(userData);
        console.log("User created:", userData);
    }
)

//Inngest function to handle user deletion
export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-deletion" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const {id} = event.data;
        await User.findByIdAndDelete(id);
        console.log("User deleted:", id);
    }
);

//Inngest function to handle user updates
export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            _id: id,
            name: first_name + " " + last_name,
            email: email_addresses[0]?.email_address || "",
            imageUrl: image_url || ""
        };
        await User.findByIdAndUpdate(id, userData);
        console.log("User updated:", userData);
    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate
];