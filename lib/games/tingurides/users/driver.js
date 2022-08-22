const { isNumeric } = require('validator').default
const { BookingModel, TaxiModel, DeliveryModel } = require('../../db-models/tingurides.models')

class Driver {
    
    constructor({ details, loggedIn }) {
        this.details = details
        this.loggedIn = loggedIn
    }

    state = ''
    avaliableJobs = []
    _jobHistory = []
    currentJob = null
    commands = [
        { text: 'Take Job', action: 'take_job' },
        { text: 'End Job', action: 'end_job' },
        { text: 'Cancel Job', action: 'cancel_job' },
        { text: 'Job History', action: 'job_history' }
    ]
    questions = [
        {
            index: 0,
            key: 'take_job',
            list: [
                { key: 'list', text: 'Showing the list here' },
                { key: 'take', text: 'Take Job. *Yes* or *No*' },
                { key: 'confirm', text: 'Taking Job.' }
            ],
            responses: []
        }
    ]

    listAvailableJobs() { return `` }
    
    listBookings() {}
    
    takeAJob() {}
    
    geCommands() {}
    
    updateJobs() {}

    generateJobLayout(job) {
        return  `\n
        Client Name : ${job['client']['fullname']}\n
        Currently at :  ${job['current_location']}\n
        Destination : ${job['destination']}\n
        You can contact the client on this number ${job['client']['phone_number']} to dicuss more about the journey.
        `
    }

    async jobHistory() {
        let msg = ''
        let deliveries = await DeliveryModel.find({ status: 'pending' }).populate('client')
        let bookings = await BookingModel.find({ status: 'pending' }).populate('client')
        let taxis = await TaxiModel.find({ status: 'pending' }).populate('client');
        let jobs = [ ...taxis, ...deliveries, ...bookings]
        jobs.forEach(job => {
            msg = msg + '\n' + this.generateJobLayout(job)
        })
        return msg
    }

    async askQuestion(answer) {
        const { index, list } = this.questions.find(i => i.key == this.state)

        if (index > 0) {
            this.questions.forEach(qnSet => {
                if (qnSet.key == this.state && qnSet.index > 0) {
                    qnSet.responses.push({ key: qnSet.list[qnSet.index-1].key, answer })
                }
            })
        }

        if (index ==  list.length) {
            
            const qnSetResponses = this.questions.find(qn => qn.key == this.state).responses

            // const result = await this.performAction(this.state, qnSetResponses)

            let mssg = ''

            console.log(qnSetResponses)

            // if (result.success) {
                mssg = 'Done /menu'
            // } else {
            //     mssg = 'result.message'
            // }

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
        return key === '' ? 'key is empty' : text
    }

    async handleUserInput(answer) {

        if (answer.trim() == '/menu') {
            return this.clientMenu()
        }

        if (this.state == '') {
            if (isNumeric(answer)) {
                switch(Number(answer)) {
                    case 1:
                        this.state = 'take_job'
                        break;
                    case 2:
                        this.state = 'end_job'
                        break;
                    case 3:
                        this.state = 'cancel_job'
                    case 4:
                        return await this.jobHistory()
                    default:
                        return 'Option is not yet available or Invaid input. Try again.'
                }
            } else {
                return 'Invalid input, Please enter numbers from the provided list.'
            }
        }
        switch(this.state) {
            case 'take_job':
                return await this.askQuestion(answer)
            case 'end_job':
                return await this.askQuestion(answer)
            case 'cancel_job':
                return await this.askQuestion(answer)
            default:
                return 'Option is not yet available or Invaid input. Try again.'
        }
    }

}

module.exports = {
    Driver
}