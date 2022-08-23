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
            { text: 'Help' },
            { text: 'Suggestion', action: 'suggestion' }
        ]
        this.questions = [
            { 
                key: 'taxi', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Can you pin the desired destination.' },
                    { key: 'current_location', text: 'Can send your current location.' },
                    { key: 'time', text: 'What time would you want to the taxi? e.g ~08:30 today' },
                    { key: 'pple_count', text: 'How many people will you be travellign with?' },
                    { key: 'confirmation', text: 'Confirmation that the above information is correct. Yes or No' },
                ],
                responses: []
            },
            { 
                key: 'delivery', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Can you pin the desired destination.' },
                    { key: 'pickup_location', text: 'Can send your current location.' },
                    { key: 'time', text: 'What time would you want to the taxi? e.g ~08:30 today`' },
                    { key: 'goods_type', text: 'What type of good would like to transport?' },
                    { key: 'confirmation', text: 'Confirmation that the above information is correct. Yes or No' },
                ],
                responses: [] 
            },
            { 
                key: 'booking', 
                index: 0, 
                list: [
                    { key: 'destination', text: 'Can you pin the desired destination.' },
                    { key: 'current_location', text: 'Where would like to be picked up?.' },
                    { key: 'time', text: 'What time would you to book? e.g 08:30 or now' },
                    { key: 'date', text: 'What date would you to book? e.g 20/02/2022`' },
                    { key: 'vehicleType', text: 'Choose the type of vehicle you want to book \n1. 4 seater \n2. 7 seater' },
                    { key: 'pple_count', text: 'How many people will you be travellign with?' },
                    { key: 'luggage', text: 'Will you havign any lugguage? *Yes* or *No*, if Yes, special the additional goods. ' },
                    { key: 'confirmation', text: 'Confirmation that the above information is correct. Yes or No' },
                ],
                responses: [] 
            },
            { 
                key: 'suggestion', 
                index: 0, 
                list: [
                    { key: 'suggestion', text: 'Give use your suggestion' },
                    { key: 'confirmation', text: 'Confirmation that the above information is correct. Yes or No' },
                ],
                responses: [] 
            },
        ]
    }

    getJobHistory() { }

    createJob() { }
    
    updateJob(id) { }
    
    saveSuggestion() { }

    

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
        let result
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
            const item = row.save()
            return { success: true, message: 'You have hired a delivery service successfully.' }
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
            const item = row.save()
            return { success: true, message: 'You have hired a tax successfully' }
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
            vehicleType: responses.find(i => i.key == 'vehicleType').answer,
            pple_count: responses.find(i => i.key == 'pple_count').answer,
            luggage: responses.find(i => i.key == 'luggage').answer,
            confirmation: responses.find(i => i.key == 'confirmation').answer == 'Yes' ? true : false,
            type: 'booking'
          })
          try {
            const item = row.save()
            return { success: true, message: 'You have book a taxi successfully.' }
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

            console.log(result)

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
        return key === '' ? this.getHelpMessage : text
    }

    clientMenu() {
        let msg = ''
        this.commands.forEach((cmd, i) => {
            msg = msg + `${i+1}. ${cmd.text}\n`
        })
        return msg
    }

    async handleUserInput(answer) {

        if (answer.trim() == '/menu') {
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
                        return this.clientMenu()
                    case 5:
                        this.state = 'suggestions'
                        break;
                    default:
                        return 'Option is not yet available or Invaid input. Try again.'
                }
            } else {
                return 'Invalid input, Please enter numbers from the provided list.'
            }
        }
        switch(this.state) {
            case 'taxi':
                return await this.askQuestion(answer)
            case 'delivery':
                return await this.askQuestion(answer)
            case 'booking':
                return await this.askQuestion(answer)
            case 'suggestions':
                return await this.askQuestion(answer)
            default:
                return 'Option is not yet available or Invaid input. Try again.'
        }
    }
    

}

module.exports = {
    Client
}