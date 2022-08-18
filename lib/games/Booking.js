// const { alphabet } = require('./utils')

class Booking {
  static name = 'Booking'

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
    return  'Welcome to TINGU Rides\n\n' +  this.gameMessage
  }

  get gameMessage() {
    
    return 'What would like to do today. \n' +
      ' 1. Hire Taxi \n' + 
      ' 2. Hire Delivery \n' +
      ' 3. Partners \n' +
      ' 4. Help desk or quick tutorial \n' +
      ' 5. Complaint or suggestions'
  }

  askNextQuestion() {
    let message = ''
    if ( this.questions[this.question_type].length <= 0 ||  this.questions[this.question_type][this.currentQuestionIndex] == undefined) {
      message = 'We could find the right questions. Try again laters. \n\n' + this.gameMessage
      this.reset()
    } else {
      let { question, responses } = this.questions[this.question_type][this.currentQuestionIndex]
      message = question+'\n'

      responses.forEach(response => {
        message += `\n${response.letter} ${response.text}`
      })

      this.currentQuestionIndex++
    }
    return message 
  }

  confirmResponses() {
    let message = 'Confirm that all the information you enteres is correct. \n Yes or No'
    return message
  }

  get successMessage() {
    let message = `🎉🎉🎉🎉 Your booking was completed sucessfully. 🎉🎉🎉🎉\n
      You have been assigned to driver [Driver Name] \n
      He / She will be arriving in approx. 10mins \n
      You can contact the driver on this number +263 771 123 123 \nThank you for using [CMP NAME] for your delivery and commutes \n ${JSON.stringify(this.responses)}` 
    return message
  }

  reset() {
    this.responses = []
    this.currentQuestionIndex = 0
    this.confirmed = false
    this.rejected = false
    this.question_type = null
  }

  handleUserResponse(answer) {

    const messages = []

    if (answer.trim() == '') {
      messages.push('🌈 You can not input empty value.')
      return messages
    }
    
  //  const messages = []

    if (this.question_type == null) {
      let ans = Number(answer)

      if (Number.isNaN(ans)) {
        messages.push('You must enter a number not letters.')
        return messages
      }   
      
      switch(ans) {
        case 1: 
          this.question_type = 'taxi' 
          break
        case 2:
          this.question_type = 'delivery' 
          break
        case 3:
          this.question_type = 'partners'
          break
        case 4:
          this.question_type = 'help'
          break
        case 5:
          this.question_type = 'complaints'
          break
        default:
          this.question_type = null
      }
      
      if (this.question_type == null) {
        messages.push('Select a number from the provided list.')
        messages.push(this.gameMessage)
        return messages
      }
      
      messages.push(this.askNextQuestion())
      return messages
    }
    switch(this.question_type) {
      case 'taxi':

        if (this.currentQuestionIndex < this.questions[this.question_type].length) {
          this.responses.push({ 
            question: this.questions[this.question_type][this.currentQuestionIndex].question, 
            answer 
          })
          messages.push(this.askNextQuestion())
          return messages
        }
        
        if (this.currentQuestionIndex == this.questions[this.question_type].length) {
          this.responses.push({ 
            question: this.questions[this.question_type][this.currentQuestionIndex-1].question, 
            answer 
          })
          messages.push(this.confirmResponses())
          this.currentQuestionIndex++
          return messages
        }

        this.responses.push({ 
          question: 'Confirmatoin', 
          answer 
        })

        
        if (answer == 'Yes') {
          this.confirmed = true  
        }

        if (this.confirmed) {
          messages.push(this.successMessage)
        } else {
          messages.push(`You have cancelled you inputs. You place an order anytime you want. \n\n` + this.gameMessage)
        }

        // this.state = 'gameover'
        
        break
      case 'delivery':
        messages.push('Sorry delivery booking service not yet available \n\n' + this.gameMessage)
        break
      case 'partners':
        messages.push('Sorry a partners section is not yet available \n\n' + this.gameMessage)
        break
      case 'help':
        messages.push('Sorry a quick tutorial is not yet available \n\n' + this.gameMessage)
        break
      case 'complaints':
        messages.push('Sorry comment is not yet available. \n\n' + this.gameMessage)
        break
      default:
        messages.push(this.welcomeMessage)
    }
    return messages
  }
}

module.exports = Booking

