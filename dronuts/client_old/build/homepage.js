import React from 'react';
import { render } from 'react-dom';

class Homepage extends React.Component {
	render() {
		(<div>
			Homepage of Dronuts Group 4
			<button>Order Now</button>
			<button>About Us</button>
			<button>Sign In</button>
		</div>)
	}
}

ReactDOM.render(<Homepage />, document.getElementById("root"));
