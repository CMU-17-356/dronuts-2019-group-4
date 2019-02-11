import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
	state = {message: "Haven't heard from the express server yet.."}

	componentDidMount() {
	fetch('/message')
		.then(res => res.json())
		.then(response => this.setState(response));
	}

	render() {
		return (
			<div className="App">
			<h1>
				Drone-based donut delivery service
			</h1>
			<p>{this.state.message}</p>
			</div>
		);
	}
}

export default App;
