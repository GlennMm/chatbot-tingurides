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
    nat_id: String,
    dob: String,
    occupation: String,
    phone_number: String,
    confirmed: String,
    type: String,
    password: String
}, { timestamps: true })
const ClientModel = model('client', ClientSchema)


const taxiSchema = new Schema({
    client: {
        type: Types.ObjectId,
        ref: 'client'
    },
    destination: String,
    current_location: String,
    time: String,
    pple_count: Number,
    confirmation: Boolean,
    status: {
        type: String,
        enum: [ 'pending', 'taken', 'done'],
        default: 'pending'
    }
})
const TaxiModel = model('taxi', taxiSchema)

const deliverySchema = new Schema({
    client: {
        type: Types.ObjectId,
        ref: 'client'
    },
    destination: String,
    pickup_location: String,
    time: String,
    goods_type: String,
    confirmation: Boolean,
    status: {
        type: String,
        enum: [ 'pending', 'taken', 'done'],
        default: 'pending'
    }
})
const DeliveryModel = model('delivery', deliverySchema)

const bookingSchema = new Schema({
    client: {
        type: Types.ObjectId,
        ref: 'client'
    },
    destination: String,
    current_location: String,
    time: String,
    date: String,
    vehicleType: String,
    pple_count: String,
    luggage: String,
    confirmation: Boolean,
    status: {
        type: String,
        enum: ['pending', 'taken', 'done'],
        default: 'pending'
    },
    driver: Types.ObjectId,
    distance: Number,
    rate: Number
})
const BookingModel = model('booking', bookingSchema)

module.exports = {
    TaxiModel,
    BookingModel,
    DeliveryModel,
    VehicleModel,
    DriverModel,
    ClientModel
}