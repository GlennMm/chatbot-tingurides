class HireTax {
  static name = 'Hire a taxi'

  constructor(gameId) {
    this.state = 'play'
    this.gameId = gameId
    this.questions = [
      { key: 'from', question: 'Where you we pick you up?' },
      { key: 'to', question: 'Where would you like to go?' },
      { key: 'passanger', question: 'How many passangers will be board the taxi?' }
    ]
    this.responses = []
    this.currentQuestionIndex = 0
    this.confirmed = false
    this.rejected = false
    this.question_type = null
  }

  get welcomeMessage() {
    return 'Welcome to TINGU Rides - Taxi Service \n' + this.gameMessage
  }

  get gameMessage() {
    return 'To get started enter type \n *Hire* or *Exit* \n'
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
        messages.push('Thank you for registering successfully. The assigned driver will contact you soon.')
        this.exit()
        messages.push('Type */h* to view the main menu.')
      } else if (answer.trim().toLowerCase() == 'no') {
        this.responses.push({ qn: 'Confirmed', answer })
        messages.push('You have cancelled you registration.')
        this.exit()
        messages.push('Type */h* to view the main menu.')
      } else {
        messages.push('A *Yes* or *No* response is require.')
      }
    }

    return messages
  }
}

module.exports = HireTax

