import React from 'react'
import axios from 'axios'

class AdminApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {votes: []}
  }
  
  async refreshVotes() {
    const votes = await axios.get('/api/polls')
    const newVotes = votes.data.data.map((vote, index) => {
      return vote
    })
    this.setState({
      votes: newVotes
    })
  }
  
  async componentDidMount() {
    await this.refreshVotes()
  }

  render() {
    return (
      <div className="AdminApp">
        <AddVote refreshVotes={this.refreshVotes.bind(this)} />
        <VoteList votes={this.state.votes} refreshVotes={this.refreshVotes.bind(this)} />
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <form action="/admin/logout" method="GET" >
              <button type="submit" className="mdl-button mdl-js-button mdl-button--raised">
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

class VoteList extends React.Component {
  render() {
    let votes = <div> Loading... </div>
    votes = this.props.votes.map((vote, index) => {
      return <Vote VoteData={vote} key={index} refreshVotes={this.props.refreshVotes} />
    })
    return (
      <div className="Votes"> 
        {votes}
      </div>
    )
  }
}

class Vote extends React.Component {
  async deleteVotes(e) {
    e.preventDefault()
    const res = await axios.delete('/api/polls/' + this.props.VoteData._id)
    if(res.data.success)
      alert('성공!')
    else
      alert(res.data.error)
    this.props.refreshVotes()
  }
  render() {
    return (
      <div className="demo-card-wide mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">{this.props.VoteData.title}</h2>
        </div>
        <div className="mdl-card__supporting-text">
          {this.props.VoteData.contents}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" >
            {'찬성 ' + this.props.VoteData.upCount + ' 표'}
          </a>
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" >
            {'반대 ' + this.props.VoteData.downCount + ' 표'}
          </a>
        </div>
        <div className="mdl-card__menu">
          <button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" onClick={this.deleteVotes.bind(this)} >
            <i className="material-icons">delete_forever</i>
          </button>
        </div>
      </div>
    )
  }
}

class AddVote extends React.Component {
  async addVote(e) {
    e.preventDefault()
    const data = {
      title: this.title.value,
      contents: this.contents.value
    }

    const res = await axios.post('/api/polls', data)
    if(res.data.success)
      this.props.refreshVotes()
    else
      alert(res.data.error)
  }

  render() {
    return (
      <div className="mdl-grid">
        <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
          <input className="mdl-textfield__input" ref={title => this.title = title} type="text" id="title" />
          <label className="mdl-textfield__label" htmlFor="title">제목</label>
        </div>
        <div className="mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet" />
        <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
          <input className="mdl-textfield__input" ref={contents => this.contents = contents} type="text" id="contents" />
          <label className="mdl-textfield__label" htmlFor="contents">내용</label>
        </div>
        <div className="mdl-cell mdl-cell--12-col">
          <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.addVote.bind(this)}>
            등록
          </button>
        </div>
      </div>
    )
  }
}


export default AdminApp