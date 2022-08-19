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

    login() {
      return ClientModel.findOne({ 
        fullname: this.responses.find(i => i.key == 'fullname').answer
      }).then(res => {
        return res.password === this.responses.find(i => i.key == 'password').answer 
        ? true 
        : false
      })
    }
  
    async handleUserResponse(answer) {
  
      const messages = []
  
      if (answer.trim() == '') {
        messages.push('🌈 You can not input empty value.')
        return messages
      }
  
      if (answer.trim().toLowerCase() == 'exit') {
        this.exit()
      }
  
      // if (this.currentQuestionIndex == 0) {
      //   messages.push(this.askNextQuestion())
      // } else 
      if (this.currentQuestionIndex < this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        messages.push(this.askNextQuestion())
      } else if (this.currentQuestionIndex == this.questions.length) {
        this.responses.push({ key: this.questions[this.currentQuestionIndex - 1].key, answer })
        // todo add login logic with communicate with db */
        
        const msg = await this.login().then(loggedIn => {
          if (loggedIn) {
            return 'navigation to the correct "route" '
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
  
  