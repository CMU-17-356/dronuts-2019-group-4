import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {


      return (
      <header>
      <div className="container">
      <div className="brand">
      <img
      className="logo"
      src="https://cmu-17-356.github.io/Dronuts/assets/Dronut.png"
      alt="Dronuts Logo"
      />
      </div>
      </div>
       </header>
        );
     }
  }

  export default Header;