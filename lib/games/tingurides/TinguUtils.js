const { isNumeric } = require('validator').default
const { JobModel } = require('../db-models/tingurides.models')

class Client {
    constructor({ details, loggedIn }) {
        this.details = details
        this.loggedIn = loggedIn
        this.state = '' 
        this.commands = [
            { text: 'Hire a taxi', action: 'taxi' },
            { text: 'Hire delivery service', action: 'delivery' },
            { text: 'Book a service', action: 'booking' },
            { text: 'Help', action: 'help' },
            // { text: 'Suggestion', action: 'suggestion' }
        ]
        this.questions = [
            { 
                key: 'taxi', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Please enter your destination and your phone number.' },
                    { key: 'current_location', text: 'Please enter your current location and/or address.' },
                    { key: 'date', text: 'Please enter pickup date' },
                    { key: 'time', text: 'Please enter pickup time' },
                    { key: 'pple_count', text: 'Please enter the number of passangers?' },
                    { key: 'confirmation', text: 'Confirm that the above information you have entered. Yes or No' },
                ],
                responses: []
            },
            { 
                key: 'delivery', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Please enter your destination and your phone number.' },
                    { key: 'pickup_location', text: 'Please enter your current location and/or address.' },
                    { key: 'date', text: 'Please enter pickup date for the delivery' },
                    { key: 'time', text: 'Please enter pickup time for the delivery' },
                    { key: 'goods_type', text: 'Please specify and describe the goods to be transported.' },
                    { key: 'confirmation', text: 'Confirm that the above information you have entered. Yes or No' },
                ],
                responses: [] 
            },
            { 
                key: 'booking', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Please enter your destination and your phone number.' },
                    { key: 'current_location', text: 'Please enter the pickup location.' },
                    { key: 'date', text: 'Please enter the pickup date.' },
                    { key: 'time', text: 'Please enter the pickup time.' },
                    // { key: 'vehicleType', text: 'Please choose the type of vehicle you want to book \n1. 4 seater \n2. 7 seater' },
                    { key: 'pple_count', text: 'Please enter the number of passangers?' },
                    // { key: 'luggage', text: 'Will you having any lugguage? *Yes* or *No*, if Yes, special the additional goods. ' },
                    { key: 'confirmation', text: 'Confirm that the above information you have entered. Yes or No' },
                ],
                responses: [] 
            },
            { 
                key: 'suggestion', 
                index: 0, 
                list: [
                    { key: 'suggestion', text: 'Give use your suggestion' },
                    { key: 'confirmation', text: 'Confirm that the above information is correct. Yes or No' },
                ],
                responses: [] 
            },
        ]
    }

    get getHelpMessage() {
        return `
            Main Menu \n
            ${ this.commands.map((cmd, ind) => `${ind+1}. ${cmd.text}\n`) }\n\n
            The choice is yours
        `
    }

    saveUserResponse(answer) { 
        this.questions.forEach(qnSet => {
            if (qnSet.key == this.state && qnSet.index > 0) {
                qnSet.responses.push({ key: qnSet.list[qnSet.index-1].key, answer })
            }
        })
    }


    async performAction(state, responses) {
        switch(state) {
            case 'taxi':
                return await this.hireTax(responses)    
            case 'delivery':
                return await this.hireDelivery(responses)  
            case 'booking':
                return await this.setBooking(responses)  
        }
    }

    hireDelivery(responses) {
        if(responses.find(i => i.key == 'confirmation').answer.toLowerCase() != 'yes') {
            return { success: false, message: 'You have declined the above information.' }
        }
        const row = JobModel({
            client: this.details._id,
            destination: responses.find(i => i.key == 'destination').answer,
            pickup_location: responses.find(i => i.key == 'pickup_location').answer,
            time: responses.find(i => i.key == 'time').answer,
            goods_type: responses.find(i => i.key == 'goods_type').answer,
            confirmation: responses.find(i => i.key == 'confirmation').answer == 'Yes' ? true : false,
            type: 'delivery'
          })
          try {
            row.save()
            return { success: true, message: 'You have created a delivery service request successfully. One of our driver will be in touch with you.' }
          } catch (e) {
            return { success: false, message: 'Could not hire a delivery service.' }
          }
          
          
     }
    
    hireTax(responses) {
        if(responses.find(i => i.key == 'confirmation').answer.toLowerCase() != 'yes') {
            return { success: false, message: 'You have declined the above information.' }
        }
        const row = JobModel({
            client: this.details._id,
            destination: responses.find(i => i.key == 'destination').answer,
            current_location: responses.find(i => i.key == 'current_location').answer,
            time: responses.find(i => i.key == 'time').answer,
            pple_count: isNumeric(responses.find(i => i.key == 'pple_count').answer) ? Number(responses.find(i => i.key == 'pple_count').answer) : 1,
            confirmation: responses.find(i => i.key == 'confirmation').answer == 'Yes' ? true : false,
            type: 'taxi'
          })
          try {
            row.save()
            return { success: true, message: 'You have created a tax hire request successfully. One of our driver will be in touch with you.' }
          } catch (e) {
            return { success: false, message: 'Taxi hiring failed.' }
          }
          
    }
    
    async setBooking(responses) {
        if(responses.find(i => i.key == 'confirmation').answer.toLowerCase() != 'yes') {
            return { success: false, message: 'You have declined the above information.' }
        }
        const row = JobModel({
            client: this.details._id,
            destination: responses.find(i => i.key == 'destination').answer,
            current_location: responses.find(i => i.key == 'current_location').answer,
            time: responses.find(i => i.key == 'time').answer,
            date: responses.find(i => i.key == 'date').answer,
            // vehicleType: responses.find(i => i.key == 'vehicleType').answer,
            pple_count: responses.find(i => i.key == 'pple_count').answer,
            // luggage: responses.find(i => i.key == 'luggage').answer,
            confirmation: responses.find(i => i.key == 'confirmation').answer == 'Yes' ? true : false,
            type: 'booking'
          })
          try {
            row.save()
            return { success: true, message: 'You have created booking request successfully. One of our driver will be in touch with you' }
          } catch (e) {
            return { success: false, message: 'Could not book a taxi service.' }
          }
     }

    async askQuestion(answer) {
        const { index, list } = this.questions.find(i => i.key == this.state)

        if (index > 0) {
            this.saveUserResponse(answer)
        }

        if (index ==  list.length) {
            const qnSetResponses = this.questions.find(qn => qn.key == this.state).responses

            const result = await this.performAction(this.state, qnSetResponses)

            let mssg = ''

            if (result.success) {
                mssg = result.message
            } else {
                mssg = result.message
            }

            this.questions.forEach(qnSet => {
                if (qnSet.key == this.state && qnSet.index > 0) {
                    qnSet.responses = []
                    qnSet.index = 0
                }
            })
            this.state = ''
            return mssg
        } else {
            this.questions.forEach(i => {
                if(i.key == this.state) {
                    i.index++
                }
            })
        }
        const { key, text } = list[index]
        return key === '' ? this.getHelpMessage : `${text}`
    }

    clientMenu(msg2 = '') {
        let msg = `${msg2 == '' ? '' : msg2 + '\n\n'}`
        this.commands.forEach((cmd, i) => {
            msg = msg + `${i+1}. ${cmd.text}\n`
        })
        return messageWrapper(msg)
    }

    async handleUserInput(answer) {

        if (answer.trim().toLowerCase() == 'main menu' || answer.trim().toLowerCase() == 'cancel') {
            this.questions.forEach(qnSet => {
                if (qnSet.key == this.state && qnSet.index > 0) {
                    qnSet.responses = []
                    qnSet.index = 0
                }
            })
            this.state = ''
            return this.clientMenu()
        }

        if (this.state == '') {
            if (isNumeric(answer)) {
                switch(Number(answer)) {
                    case 1:
                        this.state = 'taxi'
                        break;
                    case 2:
                        this.state = 'delivery'
                        break;
                    case 3:
                        this.state = 'booking'
                        break;
                    case 4:
                        this.state = 'help'
                        break;
                    case 5:
                        this.state = 'suggestions'
                        break;
                    default:
                        return messageWrapper('Option is not yet available or Invaid input. Try again.')
                }
            } else {
                return messageWrapper('Invalid input, Please enter numbers from the provided list.')
            }
        }
        switch(this.state) {
            case 'taxi':
                return messageWrapper(await this.askQuestion(answer))
            case 'delivery':
                return messageWrapper(await this.askQuestion(answer))
            case 'booking':
                return messageWrapper(await this.askQuestion(answer))
            case 'suggestions':
                return messageWrapper(await this.askQuestion(answer))
            case 'help':
                this.state = ''
                return messageWrapper('For further assistance please contact Customer Care on *0719445433*')
            default:
                return messageWrapper('Option is not yet available or invaid input. Try again.')
        }
    }

}

function messageWrapper(text) {
    return text+'\n\n' + 'Options:\n*main menu* or\n*cancel*'
}

module.exports = {
    Client,
    messageWrapper
}