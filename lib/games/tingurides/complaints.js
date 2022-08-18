class Complaints {
    static name = 'Complaints'
  
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
      return  'Welcome to TINGU Rides - Taxi Service \n' +  this.gameMessage
    }
  
    get gameMessage() {
      return 'To get started enter type \n Hire or Exit \n'
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
  
  module.exports = Complaints
  
  