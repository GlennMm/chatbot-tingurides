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
      return 'TINGU Rides - Login \n' + this.gameMessage
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
      }
  
      if (this.currentQuestionIndex < this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        messages.push(this.askNextQuestion())
      } else if (this.currentQuestionIndex == this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        
        const msg = await this.login().then(async ({loggedIn, user}) => {
          if (loggedIn) {
            // todo set user as logged in
            const userSession = {
              phone: req.body.From,
              mode: 'multi-player',
              type: user.type,
              username: this.responses.find(i => i.key == 'fullname').answer
            };
            await req.saveUserSession(userSession);
            return 'navigation to the correct "route" '
          } else {
            return '*Login failed*. Exiting to main menu..., and try again'
          }
        }).catch(err => {
          return 'Something went wrong with our service, try again later.'
        })
        messages.push(msg)
        this.exit()
      }
      return messages
    }
  }
  
  module.exports = Login
  
  