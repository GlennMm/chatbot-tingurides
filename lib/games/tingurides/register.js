class Register {
    static name = 'Signup / Register'
  
    constructor(gameId) {
      this.state = 'play'
      this.gameId = gameId
      this.questions = { 
        client: [
            { question: 'Enter your Fullname.' },
            { question: 'Enter your National ID Number.' },
            { question: 'Enter your Date Of Birth.' },
            { question: 'Enter your Occupation.' }
        ],
        driver: [ 
            { question: 'Enter your Fullname.' },
            { question: 'Enter your National ID Number.' },
            { question: 'Enter your Date Of Birth.' },
            { question: 'Enter the class of your drivers licence.' },
            { question: 'Enter your vehicle licence number.' },
            { question: 'Enter number of seat you vehicle has.' },
            { question: 'Enter net vehicle mass of your vehicle.' },
        ]
      }
      this.responses = []
      this.currentQuestionIndex = 0
      this.confirmed = false
      this.rejected = false
      this.user_type = null
    }
  
    get welcomeMessage() {
      return  'Welcome to TINGU Rides - Register \n' +  this.gameMessage
    }
  
    get gameMessage() {
      return `
      Select the type user you want to register as a \n 
      *Driver* or *Client* \n`
    }
  
    askNextQuestion() {
      let message = `${this.questions[this.user_type][this.currentQuestionIndex].question}`
      this.currentQuestionIndex += 1
      return message
    }
  
    exit() {
      this.state = 'gameover'
      
    }
  
    handleUserResponse(answer) {
  
      const messages = []
  
      if (answer.trim() == '') {
        messages.push('🌈 You can not input empty value.')
        return messages
      }

      if (answer.trim().toLowerCase() == 'exit') {
        this.exit()
      }

      if (this.user_type != null) {
        switch(this.user_type) {
            case 'client':
                if (this.currentQuestionIndex < this.questions[this.user_type].length) {
                    this.responses.push({ qn: this.questions[this.user_type][this.currentQuestionIndex].question , answer })
                    messages.push(this.askNextQuestion())
                } else if (this.currentQuestionIndex == this.questions[this.user_type].length) {
                    messages.push('Confirm the information your have entered is correct. \n *Yes* or *No*')
                    this.currentQuestionIndex++
                } else if (this.currentQuestionIndex > this.questions[this.user_type].length) {
                    if (answer.trim().toLowerCase() == 'yes') {
                        this.responses.push({ qn: 'Confirmed', answer })
                        messages.push('Thank you for registering successfully. ' + JSON.stringify(this.responses))
                        this.exit()
                        messages.push('Type */h* to view the main menu.')
                    } else if (answer.trim().toLowerCase() == 'no') {
                        this.responses.push({ qn: 'Confirmed', answer })
                        messages.push('You have cancelled you registration. ' + JSON.stringify(this.responses))
                        this.exit()
                        messages.push('Type */h* to view the main menu.')
                    } else {
                        messages.push('A *Yes* or *No* response is require.')
                    }
                }
                break;
            case 'driver':
                if (this.currentQuestionIndex < this.questions[this.user_type].length) {
                  this.responses.push({ qn: this.questions[this.user_type][this.currentQuestionIndex].question , answer })
                  messages.push(this.askNextQuestion())
              } else if (this.currentQuestionIndex == this.questions[this.user_type].length) {
                  messages.push('Confirm the information your have entered is correct. \n *Yes* or *No*')
                  this.currentQuestionIndex++
              } else if (this.currentQuestionIndex > this.questions[this.user_type].length) {
                  if (answer.trim().toLowerCase() == 'yes') {
                      this.responses.push({ qn: 'Confirmed', answer })
                      messages.push('Thank you for registering successfully. ' + JSON.stringify(this.responses))
                      this.exit()
                      messages.push('Type */h* to view the main menu.')
                  } else if (answer.trim().toLowerCase() == 'no') {
                      this.responses.push({ qn: 'Confirmed', answer })
                      messages.push('You have cancelled you registration. ' + JSON.stringify(this.responses))
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
        if (answer.trim().toLowerCase() == 'client') {
            this.user_type = 'client'
            messages.push('You have choosen to register as a client. \nCan you give use the following informatoin about you by answering the following questions.\n\n\n'+this.askNextQuestion())
        }
        else if (answer.trim().toLowerCase() == 'driver') {
            this.user_type = 'driver'
            messages.push('You have choosen to register as a driver. \nCan you give use the following informatoin about you by answering the following questions.\n\n\n'+this.askNextQuestion())
        } else {
            messages.push('You should choose either a driver or a client.')
        }
      }
      return messages
    }
  }
  
  module.exports = Register