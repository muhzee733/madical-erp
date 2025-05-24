import { combineReducers } from "redux";

// Front
import LayoutReducer from "./layouts/reducer";

// Authentication
import LoginReducer from "./auth/login/reducer";
import AccountReducer from "./auth/register/reducer";
import ForgetPasswordReducer from "./auth/forgetpwd/reducer";
import ProfileReducer from "./auth/profile/reducer";

//Chat
import chatReducer from "./chat/reducer";

//Invoice
import InvoiceReducer from "./invoice/reducer";

//Mailbox
import MailboxReducer from "./mailbox/reducer";

// API Key
import APIKeyReducer from "./apiKey/reducer";
import scheduleReducer from './appointmentSchedule/scheduleSlice';
import appointmentReducer from './appointments/reducer';
import bookingCartSlice from './cart/reducer';
import orderSlice from './OrderAppointment/reducer';
import prescriptionReducer from './prescriptions/slice';

const rootReducer = combineReducers({
    Layout: LayoutReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Chat: chatReducer,
    Invoice: InvoiceReducer,
    Mailbox: MailboxReducer,
    APIKey: APIKeyReducer,
    schedule: scheduleReducer,
    Appointment: appointmentReducer,
    Cart: bookingCartSlice,
    OrderAppointment: orderSlice,
    prescriptions: prescriptionReducer,
});

export default rootReducer;