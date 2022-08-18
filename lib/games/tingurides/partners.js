class Partners {
    static name = 'Partners / Drivers'
  
    constructor(gameId) {
      this.state = 'play'
      this.gameId = gameId
      this.questions = { 
        delivery: [],
        taxi: [],
        partners: [],
        help: [],
        complaints: []
      }
      this.responses = []
      this.currentQuestionIndex = 0
      this.confirmed = false
      this.rejected = false
      this.question_type = null
    }
  
    get welcomeMessage() {
      return  'Welcome to TINGU Rides - Partners Service \n' +  this.gameMessage
    }
  
    get gameMessage() {
        // TODO display game menu -> ie options for partners
      return 'To get started enter type: Hire or Exit \n\n To exit go back to the main menu type *Exit*'
    }
  
    askNextQuestion() {
      let message = ''
      // TODO logic to asking question
      return message 
    }
  
    reset() {}
  
    handleUserResponse(answer) {
  
      const messages = []
  
      if (answer.trim() == '') {
        messages.push('🌈 You can not input empty value.')
        return messages
      }

      messages.push(`You -> ${answer}`)

      if (answer.toLowerCase() == 'exit') {
        this.state = 'gameover'
        messages.push('Type /h to view the main menu.')
      } else {
        messages.push('We are still playing. ' + this.gameMessage)
      }

      
  
      return messages
    }
  }
  
  module.exports = Partners
  
  