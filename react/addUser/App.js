import React from 'react'
import axios from 'axios'

class AddUserApp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isEmailChecked: false, 
      isPasswordChecked: false,
      email: '',
      userpass: '',
      name: '',
      userId: ''
    }
  }
  onDataChange(e) {
    // e.preventDefault()
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    let updateData = {}
    updateData[target.name] = value    
    if(target.name === 'email') {
      this.setState({
        isEmailChecked: value.split('@')[1] === 'hanyang.ac.kr'
      })
    }
    this.setState(updateData)
  }
  async checkPassword(e) {
    e.preventDefault()
    this.setState({
      isPasswordChecked: e.target.value === this.state.userpass
    })
  }

  async onClick(e) {
    e.preventDefault()
    const data = {
      name : this.state.name,
      userId : this.state.userId,
      email: this.state.email,
      password: this.state.userpass
    }
    if(!this.state.isEmailChecked || !this.state.isPasswordChecked) {
      snackbarContainer.MaterialSnackbar.showSnackbar({message: '이메일과 비밀번호를 정확히 입력해주세요.'})
      return
    }
    const response = await axios.post('/api/users', data)
    const snackbarContainer = document.querySelector('#vote-toast')
    if(response.data.success)
      snackbarContainer.MaterialSnackbar.showSnackbar({message: '추가되었습니다. 이메일 인증을 진행해주세요.'})
    else
      snackbarContainer.MaterialSnackbar.showSnackbar({message: response.data.error})
  }

  render() {
    return (
      <div className="AddUserApp">
        <div className="mdl-layout mdl-js-layout mdl-color--grey-100">
          <main className="mdl-layout__content">
            <div className="mdl-card mdl-shadow--6dp">
              <div className="mdl-card__title mdl-color--primary mdl-color-text--white">
                <h2 className="mdl-card__title-text">Grimul Poll System</h2>
              </div>
              <div className="mdl-card__supporting-text">
                <form action="#">
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" onChange={this.onDataChange.bind(this)} name="name" type="text" id="name" />
                    <label className="mdl-textfield__label" htmlFor="name">이름</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" onChange={this.onDataChange.bind(this)} name="email" type="email" id="email" />
                    <label className="mdl-textfield__label" htmlFor="email">HY-in 이메일</label>
                  </div>
                  <div className="badEmail">
                    {this.state.email !== '' && !this.state.isEmailChecked ? '올바른 이메일을 입력해주세요!' : ''}
                  </div>
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" onChange={this.onDataChange.bind(this)} name="userpass" type="password" id="userpass" />
                    <label className="mdl-textfield__label" htmlFor="userpass-again">비밀번호</label>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" onChange={this.checkPassword.bind(this)} name="userpass-again" type="password" id="userpass-again" />
                    <label className="mdl-textfield__label" htmlFor="userpass-again">비밀번호 재입력</label>
                  </div>
                  <div className="badPassword">
                    {this.state.userpass !== '' && !this.state.isPasswordChecked ? '올바른 비밀번호를 입력해주세요!' : ''}
                  </div>
                  <div className="mdl-textfield mdl-js-textfield">
                    <input className="mdl-textfield__input" onChange={this.onDataChange.bind(this)} name="userId" type="text" id="userId" />
                    <label className="mdl-textfield__label" htmlFor="userId">학번</label>
                  </div>
                </form>
              </div>
              <div className="mdl-card__actions mdl-card--border">
                <button className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.onClick.bind(this)}>Sign up</button>
              </div>
            </div>
          </main>
        <div id="vote-toast" className="mdl-js-snackbar mdl-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button className="mdl-snackbar__action" type="button"></button>
        </div>
        </div>
      </div>
//      <div className="AddUserApp">
//        <div className="mdl-grid">
//          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
//            <input className="mdl-textfield__input" ref={name => this.name = name} type="text" id="name" />
//            <label className="mdl-textfield__label" htmlhtmlFor="name">이름</label>
//          </div>
//          <div className="mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet" />
//          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
//            <input className="mdl-textfield__input" ref={userId => this.userId = userId} type="text" id="userId" />
//            <label className="mdl-textfield__label" htmlhtmlFor="userId">학번</label>
//          </div>
//        </div>
//        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.onClick.bind(this)} >
//          추가
//        </button>
//      </div>
    )
  }
}

export default AddUserApp