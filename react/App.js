import React from 'react'
import axios from 'axios'
import Modal from 'react-modal'
import FingerprintJS from 'fingerprintjs2'

function getFPAsync() {
  return new Promise((resolve, reject) => {
    new FingerprintJS().get(resolve)
  })
}

Modal.setAppElement('#container')
class PollApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {polls: []}
  }

  async componentDidMount() {
    const polls = await axios.get('/api/polls')
    const newPoll = polls.data.data.map((poll, index) => {
      return poll
    })
    this.setState({
      polls: this.state.polls.concat(newPoll)
    })
  }

  async vote(response, pollId) {
    const fp = await getFPAsync()
    const data = {
      response: response,
      fingerprint: fp
    }
    console.log('fp:' + fp)
    
    const voteResponse = await axios.post('/api/polls/' + pollId, data)
    const snackbarContainer = document.querySelector('#vote-toast')
    if(voteResponse.data.success)
      snackbarContainer.MaterialSnackbar.showSnackbar({message: '투표가 완료되었습니다.'})
    else
      snackbarContainer.MaterialSnackbar.showSnackbar({message: voteResponse.data.error})
  }

  render() {
    return (
      <div className="PollApp">
        <div className="mdl-grid">
          
        </div>
        <div id="vote-toast" className="mdl-js-snackbar mdl-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button className="mdl-snackbar__action" type="button"></button>
        </div>
        <PollList polls={this.state.polls} vote={this.vote.bind(this)} />
      </div>
    )
  }
}

class PollList extends React.Component {
  pollOnClick(event) {
    event.preventDefault()
  }

  render() {
    let Polls = <div>Loading Messages...</div>
    if(this.props.polls) {
      Polls = this.props.polls.map((poll, index) => {
        return <Poll PollData={poll} key={index} vote={this.props.vote} />
      })
    }
    return (
      <div className="pollList">
          {Polls}
      </div>
    )
  }
}

class Poll extends React.Component {
  render() {
    return (
      <div className="demo-card-wide mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{this.props.PollData.title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {this.props.PollData.contents}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={() => this.props.vote(true, this.props.PollData._id)}>
            찬성
          </a>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={() => this.props.vote(false, this.props.PollData._id)}>
            반대
          </a>
        </div>
        <div className="mdl-card__menu">
          
        </div>
      </div>
    )
  }
}

export default PollApp