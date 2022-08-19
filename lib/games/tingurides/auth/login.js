const { ClientModel } = require('../../db-models/tingurides.models')

class Login {
    static name = 'Login'
    static userModel = ClientModel()
  
    constructor(gameId) {
      this.state = 'play'
      this.gameId = gameId
      this.questions = [
        { key: 'fullname', question: 'Enter your name' },
        { key: 'password', question: 'Enter your password. (Dont forget to delete it from the chart)' }
      ]
      this.responses = []
      this.currentQuestionIndex = 0
      this.confirmed = false
      this.rejected = false
      this.question_type = null
    }
  
    get welcomeMessage() {
      return 'Tingu Rides - Login \n' + this.gameMessage
    }
  
    get gameMessage() {
      return 'Type *Exit* to go back to the main menu \n\n' + this.askNextQuestion()
    }
  
    askNextQuestion() {
      let message = `${this.questions[this.currentQuestionIndex].question}`
      this.currentQuestionIndex++
      return message
    }
  
    exit() {
      this.state = 'gameover'
    }

    async login() {
      const res = await ClientModel.findOne({
        fullname: this.responses.find(i => i.key == 'fullname').answer
      })
      return res.password === this.responses.find(i_1 => i_1.key == 'password').answer
        ? { loggedIn: true, user: res }
        : { loggedIn: false, user: null }
    }
  
    async handleUserResponse(answer, req) {
  
      const messages = []
  
      if (answer.trim() == '') {
        messages.push('🌈 You can not input empty value.')
        return messages
      }
  
      if (answer.trim().toLowerCase() == 'exit') {
        this.exit()
        messages.push("You have successfully logged out. Press */h* to return to main menu.")
      }else if (this.currentQuestionIndex < this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        messages.push(this.askNextQuestion())
      } else if (this.currentQuestionIndex == this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        
        const msg = await this.login().then(async (data) => {
          console.log('LOGGED IN : ', data)
          if (data.loggedIn) {
            // todo set user as logged in
            if (data.user.type == 'client') {

              const userSession = {
                phone: req.body.From,
                mode: 'multi-player',
                type: data.user.type,
                username: this.responses.find(i => i.key == 'fullname').answer
              };
              await req.saveUserSession(userSession);
              return data.user.fullname + ' Welcome to your Clent Tingu Rides account\n \n1. hire a taxi \n 2.Delivery\n 3.Bookings\n 4.Help\n 5.Service History\n Please note these areas are still under development. Type */h* to exit and return to main menu'
            
            } else if (data.user.type == 'driver') {

              const userSession = {
                phone: req.body.From,
                mode: 'multi-player',
                type: data.user.type,
                username: this.responses.find(i => i.key == 'fullname').answer
              };
              await req.saveUserSession(userSession);
              return data.user.fullname + ' Welcome to your Driver Tingu Rides account\n \n1. View waiting clents \n 2.View your bookings\n 3.View your service history\n\n  Please note these areas are still under development. Type */h* to exit and return to main menu'

            }
            
          } else {
            return '*Login failed*. Exiting to main menu..., and try again'
          }
        }).catch(err => {
          console.log(err)
          return 'Something went wrong with our service, try again later.'
        })
        messages.push(msg)
        this.exit()
      }
      return messages
    }
  }
  
  module.exports = Login
  
  