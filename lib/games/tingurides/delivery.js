class Delivery {
    static name = 'Hire a delivery vehicle'
  
    constructor(gameId) {
      this.state = 'play'
      this.gameId = gameId
      this.questions = [
        { key: 'load', question: 'Give us the name of the goods you want us to transport' },
        { key: 'from', question: 'Where would you like us to pick' },
        { key: 'to', question: 'Where would you like us to deliver your goods?' },
        { key: 'receiver', question: 'Give us the name of the person who will receive the goods.' }
      ]
      this.responses = []
      this.currentQuestionIndex = 0
      this.confirmed = false
      this.rejected = false
      this.question_type = null
    }
  
    get welcomeMessage() {
      return  'Welcome to TINGU Rides - Delivery Service \n' +  this.gameMessage
    }
  
    get gameMessage() {
      return 'To get started enter type \n Hire or Exit \n'
    }
  
    askNextQuestion() {
      let message = `${this.questions[this.currentQuestionIndex].question}`
      this.currentQuestionIndex++
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
  
      if (this.currentQuestionIndex == 0) {
        messages.push(this.askNextQuestion())
      } else if (this.currentQuestionIndex < this.questions.length) {
        this.responses.push({ qn: this.questions[this.currentQuestionIndex].question, answer })
        messages.push(this.askNextQuestion())
      } else if (this.currentQuestionIndex == this.questions.length) {
        this.responses.push({ qn: this.questions[this.currentQuestionIndex - 1].question, answer })
        messages.push('Confirm the information your have entered is correct. \n *Yes* or *No*')
        this.currentQuestionIndex++
      } else if (this.currentQuestionIndex > this.questions.length) {
        if (answer.trim().toLowerCase() == 'yes') {
          this.responses.push({ qn: 'Confirmed', answer })
          messages.push('Thank you for booking delivery service successfully. The assigned driver will contact you soon.')
          this.exit()
          messages.push('Type */h* to view the main menu.')
        } else if (answer.trim().toLowerCase() == 'no') {
          this.responses.push({ qn: 'Confirmed', answer })
          messages.push('You have cancelled your delivery booking.')
          this.exit()
          messages.push('Type */h* to view the main menu.')
        } else {
          messages.push('A *Yes* or *No* response is require.')
        }
      }
  
      return messages
    }
  }
  
  module.exports = Delivery
  
  