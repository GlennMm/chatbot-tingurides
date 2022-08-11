const { alphabet } = require('./utils')

class Booking {
  static name = 'Booking'

  constructor(gameId) {
    this.state = 'play'
    this.gameId = gameId
    this.questions = { 
      delivery: [
        {
          question: 'How are you today?', 
          responses: [
            { letter: 'A', text: 'Doing Well' },
            { letter: 'B', text: 'Doing Great' },
            { letter: 'C', text: 'It could have been worse.' },
            { letter: 'D', text: 'Life is bad...' },
          ]
        },
        {
          question: 'How is work life?', 
          responses: [
            { letter: 'A', text: 'Oky' },
            { letter: 'B', text: 'Satisfiying' },
            { letter: 'C', text: 'Awful.' },
            { letter: 'D', text: 'So-so cant complain much.' },
          ]
        },
        {
          question: 'How is family?', 
          responses: [
            { letter: 'A', text: 'Oky' },
            { letter: 'B', text: 'Satisfiying' },
            { letter: 'C', text: 'Awful.' },
            { letter: 'D', text: 'So-so cant complain much.' },
          ]
        }

      ],

    }
    this.responses = []
    this.currentQuestionIndex = 0
    this.confirmed = false
    this.rejected = false
    this.question_type = null
  }

  get welcomeMessage() {
    return  'Welcome to [CMP Name] delivery service\n\n' +  this.gameMessage
  }

  get gameMessage() {
    return 'Choose the service you want to use. \n' +
      ' 1. Good delivery \n' 
      // ' 2. Hire tax \n' +
      // ' 3. Help desk or quick tutorial \n' +
      // ' 4. Comment and suggestions'
  }

  askNextQuestion() {
    let { question, responses } = this.questions[this.question_type][this.currentQuestionIndex]
    let message = question+'\n'

    responses.forEach(response => {
      message += `\n${response.letter} ${response.text}`
    })

    this.currentQuestionIndex++
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
          this.question_type = 'delivery' 
          break
        case 2:
          this.question_type = 'tax' 
          break
        case 3:
          this.question_type = 'help' 
          break
        case 4:
          this.question_type = 'comment'
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
      case 'delivery':

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
          messages.push(`You have cancelled you inputs. You place an order anytime you want.\n\n ${JSON.stringify(this.responses)}`)
        }

        this.state = 'gameover'
        
        break
      case 'tax':
        messages.push('Sorry tax booking service not yet available')
        break
      case 'help':
        messages.push('Sorry a quick tutorial is not yet available')
        break
      case 'comment':
        messages.push('Sorry comment is not yet available.')
        break
      default:
        messages.push(this.welcomeMessage())
    }
    return messages
  }
}

module.exports = Booking

