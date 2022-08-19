const { ClientModel } = require('../../db-models/tingurides.models')

class Register {
  static name = 'Signup / Register'

  constructor(gameId) {
    this.state = 'play'
    this.gameId = gameId
    this.questions = {
      client: [
        { key: 'fullname', question: 'Enter your Fullname.' },
        { key: 'nat_id', question: 'Enter your National ID Number.' },
        { key: 'dob', question: 'Enter your Date Of Birth.' },
        { key: 'occupation', question: 'Enter your Occupation.' },
        { key: 'password', question: 'Enter your password.' },
        { key: 'confirm_password', question: 'Re-Enter your password.' },
      ],
      // driver: [
      //   { question: 'Enter your Fullname.' },
      //   { question: 'Enter your National ID Number.' },
      //   { question: 'Enter your Date Of Birth.' },
      //   { question: 'Enter the class of your drivers licence.' },
      //   { question: 'Enter your vehicle licence number.' },
      //   { question: 'Enter number of seat you vehicle has.' },
      //   { question: 'Enter net vehicle mass of your vehicle.' },
      // ]
    }
    this.responses = []
    this.currentQuestionIndex = 0
    this.confirmed = false
    this.rejected = false
    this.user_type = null
  }

  get welcomeMessage() {
    return 'Welcome to TINGU Rides - Register \n' + this.gameMessage
  }

  get gameMessage() {
    return `
      Type *start* to get started. \n`
  }

  askNextQuestion() {
    let message = `${this.questions['client'][this.currentQuestionIndex].question}`
    this.currentQuestionIndex++
    return message
  }

  exit() {
    this.state = 'gameover'
  }

  async signupUser() {
    const pas = this.responses.find(i => i.key == 'password').answer
    const pass_con = this.responses.find(i => i.key == 'confirm_password').answer
    
    if (pas === pass_con) {

      return await ClientModel({
        fullname: this.responses.find(i => i.key == 'fullname').answer,
        nat_id: this.responses.find(i => i.key == 'nat_id').answer,
        dob: this.responses.find(i => i.key == 'dob').answer,
        occupation: this.responses.find(i => i.key == 'occupation').answer,
        phone_number: '+263778922386' ,
        confirmed: this.responses.find(i => i.key == 'confirmed').answer,
        password: this.responses.find(i => i.key == 'password').answer
      }).save((err) => {
        if(err) { 
          return 'Could not save your account details. Try again later.' 
        }
        return 'Create you account successfully. Now try logging in to your account.'
      })
    } else {
      return 'Password are not matching.'
    }
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

    if (this.user_type != null) {
      switch (this.user_type) {
        case 'start':
          if (this.currentQuestionIndex < this.questions['client'].length) {
            this.responses.push({ key: this.questions['client'][this.currentQuestionIndex - 1].key, answer })
            messages.push(this.askNextQuestion())
          } else if (this.currentQuestionIndex == this.questions['client'].length) {
            this.responses.push({ key: this.questions['client'][this.currentQuestionIndex - 1].key, answer })
            messages.push('Confirm the information your have entered is correct. \n *Yes* or *No*')
            this.currentQuestionIndex++
          } else if (this.currentQuestionIndex > this.questions['client'].length) {
            if (answer.trim().toLowerCase() == 'yes') {
              this.responses.push({ key: 'confirmed', answer })
              // todo push to db
              // const msg = this.signupUser()
              messages.push(await this.signupUser())
              this.exit()
              messages.push('Type */h* to view the main menu.')
            } else if (answer.trim().toLowerCase() == 'no') {
              this.responses.push({ qn: 'confirmed', answer })
              messages.push('You have cancelled you registration.')
              this.exit()
              messages.push('Type */h* to view the main menu.')
            } else {
              messages.push('A *Yes* or *No* response is require.')
            }
          }
          break;
        default:
          this.exit()
          messages = 'Enter /n to returning to main menu.'
      }
    } else {
      if (answer.trim().toLowerCase() == 'start') {
        this.user_type = 'start'
        messages.push('Niice let get started \nCan you give use the following informatoin about you by answering the following questions.\n\n\n' + this.askNextQuestion())
      } else {
        messages.push('You should choose either a driver or a client.')
      }
    }
    return messages
  }
}

module.exports = Register