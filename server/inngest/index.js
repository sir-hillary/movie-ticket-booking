import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticketing-app" });

//Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    console.log("Incoming clerk Event:", event);

    try {
      const { id, first_name, last_name, email_addresses, image_url } =
        event.data;
      const userData = {
        _id: id,
        name: first_name + " " + last_name,
        email: email_addresses[0]?.email_address || "",
        image: image_url || "",
      };
      await User.create(userData);
      console.log("User created:", userData);
    } catch (error) {
      console.error("Error saving user:", err.message);
      throw err;
    }
  }
);

//Inngest function to handle user deletion
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
    console.log("User deleted:", id);
  }
);

//Inngest function to handle user updates
export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "clerk.user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      name: first_name + " " + last_name,
      email: email_addresses[0]?.email_address || "",
      image: image_url || "",
    };
    await User.findByIdAndUpdate(id, userData);
    console.log("User updated:", userData);
  }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  {id: 'release-seats-delete-booking'},
  {event: "app/checkpayment"},
  async ({event, step}) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 *1000)
    await step.sleepUntil('Wait-for-10-minutes', tenMinutesLater)

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId)

      //if payment is not made, release seats and delete the booking

      if(!booking.isPaid){
        const show = await Show.findById(booking.show)
        booking.bookedSeats.forEach((seat)=>{
          delete show.occupiedSeats[seat]
        })
        show.markModified('occupiedSeats')
        await show.save()
        await Booking.findByIdAndDelete(booking._id)
      }
    })
  }
)

//Inngest function to send email when user has booked a show

const sendBookingConfirmationEmail = inngest.createFunction(
  {id: "send-booking-confirmation-email"},
  {event: "app/show.booked"},
  async ({event, step}) => {
    const { bookingId } = event.data

    const booking = await Booking.findById(bookingId).populate
    ({
      path: 'show',
      populate: { path: 'movie', model: "Movie"}
    }).populate('user')
  }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate, releaseSeatsAndDeleteBooking];
