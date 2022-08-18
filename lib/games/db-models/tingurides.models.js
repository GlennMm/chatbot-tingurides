const { model, Schema, Types } = require('mongoose')

const Vehicle = new Schema({
    name: String,
    model: String,
    reg_number: String,
    seats: Number,
    type: String
}, { timestamps: true })
const VehicleModel = model('vehicle', Vehicle)

const DriverSchema = new Schema({
    fullname: String,
    phone_number: String,
    id_no: String,
    vehicle: Types.ObjectId
}, { timestamps: true })
const DriverModel = model('driver', DriverSchema)

const ClientSchema = new Schema({
    fullname: String,
    phone_number: String,
}, { timestamps: true })
const ClientModel = model('client', ClientSchema)

const ClientResponse = new Schema({
    question: String,
    response: String
}, { timestamps: true })
const ClientResponseModel = model('client-response', ClientResponse)

const orderSchema = new Schema({
    client: ClientSchema,
    pickupLocation: String,
    assigned_to: Types.ObjectId,
    client_responses: [ClientResponse],
    confirmed: Boolean,
    assigned: Boolean,
    estimated_journey: Number,
    travelled: Number,
    status: String
}, { timestamps: true })
const ClientOrderModel = model('order', orderSchema)

module.exports = {
    VehicleModel,
    DriverModel,
    ClientModel,
    ClientResponseModel,
    ClientOrderModel
}