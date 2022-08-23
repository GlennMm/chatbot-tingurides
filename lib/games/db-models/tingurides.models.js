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


const jobSchema = new Schema({
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
        enum: ['pending', 'inprogress', 'done'],
        default: 'pending'
    },
    driver: Types.ObjectId,
    distance: Number,
    rate: Number,
    pickup_location: String,
    goods_type: String,
    date: String,
    vehicleType: String,
    pple_count: String,
    luggage: String,
    service: String,
    type: {
        type: String,
        enum: ['taxi', 'delivery', 'booking'],
        default: 'pending'
    }
    


})
const JobModel = model('job', jobSchema)


module.exports = {
    JobModel,
    VehicleModel,
    DriverModel,
    ClientModel
}