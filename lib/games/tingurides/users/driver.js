const { isNumeric } = require('validator').default
const { JobModel } = require('../../db-models/tingurides.models')

class Driver {
    
    constructor({ details, loggedIn }) {
        this.details = details
        this.loggedIn = loggedIn
        this.state = ''
        this.availableJobs = []  
        this.init()
    }

    
    questions = [
        {
            index: 0,
            key: 'take_job',
            list: [
                { 
                    key: 'list', 
                    text: 'the list of available jobs'
                },
                { key: 'confirmation', text: 'Confirm that the information you enter is correct. *Yes* or *No*' }
            ],
            responses: []
        },
        {
            index: 0,
            key: 'end_job',
            list: [
                { key: 'distance',  text: 'Enter the distance travelled in kilometers.' },
                { key: 'confirmation', text: 'Confirm that the information you enter is correct. *Yes* or *No*' }
            ],
            responses: []
        },
        {
            index: 0,
            key: 'cancel_job',
            list: [
                { 
                    key: 'delete', 
                    text: 'Are you sure you want to cancel you current job?'
                },
                { key: 'confirmation', text: 'Confirm that the information you enter is correct. *Yes* or *No*' }
            ],
            responses: []
        }
    ]
    currentJob = null
    commands = [
        { text: 'Take Job', action: 'take_job' },
        { text: 'View Current Job', action: 'current_job' },
        { text: 'End Job', action: 'end_job' },
        { text: 'Cancel Job', action: 'cancel_job' },
        { text: 'Job History', action: 'job_history' }
    ]

    async init() {
        if (this.loggedIn == false) {
            return
        }
        this.currentJob = await this.getCurrentJob()
    }

    getAvaiJobs() {
        return this.availableJobs
    }

    async getCurrentJob() {
        const currentJobs = await JobModel.find({ driver: this.details._id, status: 'inprogress' }).populate('client')
        return this.jobDetail(currentJobs[0])
    }

    generateJobLayout(job, ind) {
        return  `*${ind+1}*\n Client Name : ${job['client']['fullname']}\nCurrently at :  ${ job['current_location'] == undefined ? job['pickup_location'] : job['current_location'] }\nDestination : ${job['destination']}\nYou can contact the client on this number ${job['client']['phone_number']} to dicuss more about the journey.`
    }

    jobDetail(job) {
        console.log(console.log(job))
        return  `Client Name : ${job['client']['fullname']}\nCurrently at :  ${ job['current_location'] == undefined ? job['pickup_location'] : job['current_location'] }\nDestination : ${job['destination']}\nYou can contact the client on this number ${job['client']['phone_number']} to dicuss more about the journey.`
    }

    async jobHistory() {
        let msg = ''
        let jobs = await JobModel.find({ status: 'pending' }).populate('client')
        if (jobs.length <= 0) { 
            return 'You have not yet finished any jobs yet.' 
        }
        jobs.forEach(job => {
            msg = msg + '\n\n' + this.generateJobLayout(job)
        })
        return msg
    }

    async getAvailableJobs() {
        let msg = ''
        let jobs = await JobModel.find({ status: 'pending' }).populate('client')
        this.availableJobs = jobs
        if (jobs.length <= 0) { 
            return 'There are not jobs yet.' 
        }
        jobs.forEach((job, ind) => {
            msg = msg + '\n\n' + this.generateJobLayout(job, ind)
        })
        return msg
    }

    async takeJob(responses) {

        const job = responses[0].answer
        const confirmed = responses[1].answer

        if (isNumeric(job) && confirmed.toLowerCase() == 'yes') {
            const jobIndex = Number(job) - 1 
            const jobb = this.availableJobs[jobIndex]
            
            if (jobb == undefined) {
                return { success: false,  message: 'The job you selected is not available.' }
            }
            try {

                const currentJobs = await JobModel.find({ driver: this.details._id, status: 'inprogress' })

                if (currentJobs.length > 0) {
                    return { success: false, message: 'You already have a job that you have not yet finished.' }
                }
                
                const res = await JobModel.findById(jobb._id)
                res.status = 'inprogress'
                res.driver = this.details._id
                await res.save()
                return { success: true, message: 'You have successfully took the job.' }
            } catch (e) {
                return { success: false, message: 'Something went wrong' }
            }

        } else {
            return { success: false,  message: 'Invalid input. Please try again.' }
        }

    }

    async performAction(state, responses) {
        switch(state) {
            case 'take_job':
                return await this.takeJob(responses)
            case 'end_job':
                return await this.endJob(responses)
            case 'cancel_job':
                return await this.cancelJob(responses)
            default:
                return 'invalid state'
        }
    }

    async endJob(response) {
        
        if (!isNumeric(response[0].answer.toLowerCase()) || response[0].answer.toLowerCase() != 'yes' ) {
            return { success: true, message: 'Invalid input try again. Type *menu* to view the menu.' }
        }
        

        if (this.currentJob == undefined) {
            return { success: false,  message: 'You currently do not have a job in progress yet.' }
        }
        try {

            const currentJobs = await JobModel.find({ driver: this.details._id, status: 'inprogress' })

            if (currentJobs.length > 0) {
                return { success: false, message: 'You already have a job that you have not yet finished.' }
            }
            
            const res = await JobModel.findById(jobb._id)
            res.status = 'done'
            res.distance = distance
            res.rate = 15
            await res.save()
            return { success: true, message: 'You have cancelled your current job.' }
        } catch (e) {
            return { success: false, message: 'Something went wrong' }
        }
    }

    async cancelJob(response) {

        if (response[0].answer.toLowerCase() != 'yes' || response[0].answer.toLowerCase() != 'yes' ) {
            return { success: true, message: 'Type *menu* to view the menu.' }
        }

        if (this.currentJob == undefined) {
            return { success: false,  message: 'You currently do not have a job in progress yet.' }
        }
        try {

            const currentJobs = await JobModel.find({ driver: this.details._id, status: 'inprogress' })

            if (currentJobs.length > 0) {
                return { success: false, message: 'You already have a job that you have not yet finished.' }
            }
            
            const res = await JobModel.findById(jobb._id)
            res.status = 'pending'
            res.driver = null
            await res.save()
            return { success: true, message: 'You have cancelled your current job.' }
        } catch (e) {
            return { success: false, message: 'Something went wrong' }
        }
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
        if (this.state == 'take_job' && key == 'list') {
            let txt = await this.getAvailableJobs()
            return index == 0 ? `${txt} \n Choose the number of job you want to take.` : text
        } else {
            return key === '' ? 'key is empty' : text
        }
    }

    clientMenu() {
        let msg = ''
        this.commands.forEach((cmd, i) => {
            msg = msg + `${i+1}. ${cmd.text}\n`
        })
        return msg
    }

    async handleUserInput(answer) {

        if (answer.trim() == 'menu') {
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
                        this.state = 'take_job'
                        break;
                    case 2:
                        return this.getCurrentJob()
                    case 3:
                        this.state = 'end_job'
                        break;
                    case 4:
                        this.state = 'cancel_job'
                        break
                    case 5:
                        return await this.jobHistory()
                    default:
                        return 'Option is not yet available or Invaid input. Try again.'
                }
            } else {
                return 'Invalid input, Please enter numbers from the provided list.'
            }
        }
        
        await this.getAvailableJobs()
        
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