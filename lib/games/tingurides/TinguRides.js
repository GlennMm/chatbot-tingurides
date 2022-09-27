const { Client } = require('./TinguUtils')
const { Driver } = require('./users/driver')
const { isNumeric } = require('validator').default
const { ClientModel } = require('../db-models/tingurides.models')

class Tingurides {
    static name = 'Tingu Rides'

    constructor(gameId, req) {
        this.state = 'play'
        this.gameId = gameId
        this.data = {
            user: null,
            loggedIn: false
        }
        this.client = new Client({ details: {}, loggedIn: false })
        this.driver = new Driver({ details: {}, loggedIn: false })
        this.req = req
    }

    questions = [
        {
            key: 'register',
            index: 0,
            list: [
                { key: 'fullname', text: 'Enter your Fullname.' },
                { key: 'nat_id', text: 'Enter your National ID Number.' },
                { key: 'password', text: 'Enter your password.' },
                { key: 'confirm_password', text: 'Re-Enter your password.' },
                { key: 'confirmed', text: 'Confirm if the above information is correct. *Yes* or *No*' },
            ],
            responses: []
        }
    ]
    qnState = ''
    commands = [
        { text: 'Register', action: 'register' },
        { text: 'About TINGU RIDES', action: 'about' }
    ]

    async login(responses) {
        const res = await ClientModel.findOne({
            fullname: responses.find(i => i.key == 'fullname').answer
        })

        this.data = {
            loggedIn : res != null ? true : false,
            user: res != null ? res : null,
        }

        if (this.data.user?.type == 'client') {
            this.client.details = res
        } else if (this.data.user?.type == 'driver') {
            this.driver.details = res
        }
        return this.data
    }

    async signupUser(responses) {
        const pas = responses.find(i => i.key == 'password').answer
        const pass_con = responses.find(i => i.key == 'confirm_password').answer

        if(responses.find(i => i.key == 'confirmed').answer.toLowerCase() == 'no') {
            return { success: false, message: 'You have declined the abovr information.' }
        }

        if (pas === pass_con) {
          const row = ClientModel({
            fullname: responses.find(i => i.key == 'fullname').answer,
            nat_id: responses.find(i => i.key == 'nat_id').answer,
            phone_number: this.req.body.From,
            type: 'client',
            confirmed: responses.find(i => i.key == 'confirmed').answer,
            password: responses.find(i => i.key == 'password').answer
          })
          const item = await row.save((err) => {
            if(err) {
              return { success: false, message: 'Something went wrong with our systems.' } 
            }
            this.data = {
              user: row,
              loggedIn: true
            }
            return { success: true, message: 'Account was registered successfully.' }
          })
          return { success: item != undefined ? true : false, message: 'Account was registered successfully.' }
        } else {
          return { success: false, message: 'Password not matching.' }
        }
      }

    logout() {
        this.data = {
            user: null,
            loggedIn
        }
        if (this.data.user) {
            if (this.data.user.type == 'client') {
                this.client = null
            } else if (this.data.user.type == 'driver') {
                this.driver = null
            }
        }
    }

    get welcomeMessage() {
        return  'Welcome to *TINGU RIDES*\n' +  this.gameMessage
    }

    get gameMessage() {
        let msg = 'What would like to do today.\n'
        this.commands.map((cmd, i) => `${i+1} ${cmd.text}\n`).forEach((item, i) => {
            msg = msg + item
        })
        return msg
    }

    get successMessage() {
        let message = `🎉🎉🎉🎉 Your booking was completed sucessfully. 🎉🎉🎉🎉\n` 
        return message
    }

    reset() {
        this.data = {
            user: null,
            loggedIn: false
        }
        this.client = new Client(this.data)
        this.driver = new Driver(this.data)
        this.qnState = ''
    }

    async performAction(action, data) {
        switch (action) {
            case 'login':
                const { loggedIn, user } = await this.login(data)
                return { success: loggedIn, data: user }
            case 'register':
                const result = await this.signupUser(data)
                return { success: result, data: result.message }
            default:
                return 'action not found.'
        }
    }

    saveUserResponse(answer) {
        this.questions.forEach(qnSet => {
            if (qnSet.key == this.qnState && qnSet.index > 0) {
                qnSet.responses.push({ key: qnSet.list[qnSet.index-1].key, answer })
            }
        })
    }

    get loggedInMenu() {
        let msg = ''
        console.log(this.data.user.user)
        if (this.data.user.user.type == 'client') {
            this.client.commands.forEach((cmd, i) => {
                msg = msg + `${i+1}. ${cmd.text}\n`
            })
        } else if (this.data.user.type == 'driver') {
            this.driver.commands.forEach((cmd, i) => {
                msg = msg + `${i+1}. ${cmd.text}\n`
            })
        }
        return msg
    }

    sendSuccesMessage(state) {
        if(state == 'login') {
            let msg = 'Welcome to *TINGU RIDES*. Please enter your preferences for today.\n' + this.loggedInMenu + '\n To logout enter *logout*'
            return msg
        } else if (state == 'register') {
            return 'Your account was created successfully. To see the main menu type *main menu*.\n'
        }
    }

    failedMessage(state, msg = '') {
        switch(state) {
            case 'login':
                return 'Login failed. You may try again'
            case 'register':
                return 'Your account registration failed. ' + msg
        }
    }

    async askQuestion(answer) {
        const { index, list } = this.questions.find(i => i.key == this.qnState)

        if (index > 0) {
            this.saveUserResponse(answer)
        }

        if (index ==  list.length) {
            const qnSetResponses = this.questions.find(qn => qn.key == this.qnState).responses

            const result = await this.performAction(this.qnState, qnSetResponses)

            let mssg = ''

            if (result.success) {
                mssg = this.sendSuccesMessage(this.qnState)
            } else {
                mssg = this.failedMessage(this.qnState, result.message)
            }

            this.questions.forEach(qnSet => {
                if (qnSet.key == this.qnState && qnSet.index > 0) {
                    qnSet.responses = []
                    qnSet.index = 0
                }
            })
            this.qnState = ''
            return mssg
        } else {
            this.questions.forEach(i => {
                if(i.key == this.qnState) {
                    i.index++
                }
            })
        }
        const { key, text } = list[index]
        return key === '' ? this.getHelpMessage : text
    }

    async handleUserResponse(answer) {
        
        const messages = []

        if (answer.trim() == '') {
            messages.push('🌈 You can not input empty value.')
            return messages
        }

        // if (this.qnState == '' && answer == 'help') {
        //     messages.push(this.getHelpMessage)
        //     return messages
        // }

        if (answer.trim().toLowerCase() == 'logout' || answer.trim().toLowerCase() == 'cancel') {
            this.reset()
            // this.state = 'gameover'
            messages.push('You are now logged out.')
            return messages
        }

        if (this.data.loggedIn == true && this.data.user.type == 'client') {
            let action = await this.client.handleUserInput(answer)
            messages.push(action)
            return messages
        } else if (this.data.loggedIn == true && this.data.user.type == 'driver') {
            let action = await this.driver.handleUserInput(answer)
            messages.push(action)
            return messages
        }
        else if (this.qnState == '') {
            if (isNumeric(answer)) {
                this.qnState = Number(answer)
                switch(this.qnState) {
                    case 1:
                        this.qnState = 'register'
                        break;
                    case 2:
                        this.qnState = ''
                        messages.push('You have enter the about page for TinguRides. The page is under construction. try one of the following options. \n\n' + this.gameMessage)
                        return messages
                    default:
                        messages.push('Option is not yet available or Invaid input. Try choosing one of the following options. \n\n' + this.gameMessage)
                        return messages
                }
            } else {
                messages.push('Option is not yet available or Invaid input. Try choosing one of the following options. \n\n' + this.gameMessage)
                return messages
            }
        }
        switch(this.qnState) {
            case 'login':
                messages.push(await this.askQuestion(answer))
                return messages
            case 'register':
                messages.push(await this.askQuestion(answer))
                return messages
            default:
                messages.push('Option is not yet available or Invaid input. Choose one of the following options.')
                return messages
        }

    }

}

module.exports = Tingurides