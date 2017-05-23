import React from 'react'
import axios from 'axios'

class AddUserApp extends React.Component {
  async onClick(e) {
    e.preventDefault()
    const data = {
      name : this.name.value,
      userId : this.userId.value
    }

    const response = await axios.post('/api/users', data)
    const snackbarContainer = document.querySelector('#vote-toast')
    if(response.data.success)
      snackbarContainer.MaterialSnackbar.showSnackbar({message: '추가되었습니다.'})
    else
      snackbarContainer.MaterialSnackbar.showSnackbar({message: response.data.error})
  }

  render() {
    return (
      <div className="AddUserApp">
        <div className="mdl-grid">
          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
            <input className="mdl-textfield__input" ref={name => this.name = name} type="text" id="name" />
            <label className="mdl-textfield__label" htmlFor="name">이름</label>
          </div>
          <div className="mdl-cell mdl-cell--2-col mdl-cell--2-col-tablet" />
          <div className="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--5-col mdl-cell--3-col-tablet">
            <input className="mdl-textfield__input" ref={userId => this.userId = userId} type="text" id="userId" />
            <label className="mdl-textfield__label" htmlFor="userId">학번</label>
          </div>
        </div>
        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.onClick.bind(this)} >
          추가
        </button>
        <div id="vote-toast" className="mdl-js-snackbar mdl-snackbar">
          <div className="mdl-snackbar__text"></div>
          <button className="mdl-snackbar__action" type="button"></button>
        </div>
      </div>
    )
  }
}

export default AddUserApp