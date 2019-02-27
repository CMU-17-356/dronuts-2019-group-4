import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/customer/Header";
import Menu from "./components/customer/Menu";
import axios from "axios";
import queryString from "query-string";

//based on https://github.com/sivadass/react-shopping-cart
class App extends Component {
	constructor() {
		super();
		this.state = {
			items: [],
			cart: [],
			totalItems: 0,
			totalAmount: 0,
			quantity: 1,
               message: "Haven't heard from the express server yet.."
		}
	}

     componentDidMount() {
     axios.get("/message").then(response => {
	      console.log(response);
	    });
     }

		
	getItems() {
	    //TODO change to backend by changing url
	    const url = "https://res.cloudinary.com/sivadass/raw/upload/v1535817394/json/products.json";
	      //"api/allItems";
	    axios.get(url).then(response => {
	      this.setState({
	        items: response.data
	      });
	    });
    }

	componentWillMount() {
		this.getItems();
          var query = queryString.parse(this.props.location.search);
          if (query.token) {
               window.localStorage.setItem("jwt", query.token);
               this.props.history.push("/");
          }
	}

     // Add to Cart
    handleAddToCart = (selectedItems) => {
     	const cartItem = this.state.cart;
     	const itemID = selectedItems.id;
     	const itemQty = selectedItems.quantity;
     	if (this.checkItem(itemID)) {
     		let index = cartItem.findIndex(x => x.id === itemID);
     		cartItem[index].quantity =
     		Number(cartItem[index].quantity) + Number(itemQty);
     		this.setState({
     			cart: cartItem
     		});
     	} else {
     		cartItem.push(selectedItems);
     	}
     	this.setState({
     		cart: cartItem,
     	});
     	setTimeout(
     		function() {
     			this.setState({
     				quantity: 1
     			});
     			console.log(this.state.quantity);
     			console.log(this.state.cart);
     		}.bind(this),
     		1000
     		);
     	this.sumTotalItems(this.state.cart);
     	this.sumTotalAmount(this.state.cart);
     }
     handleRemoveItem = (id, e) => {
     	const cart = this.state.cart;
     	const index = cart.findIndex(x => x.id === id);
     	cart.splice(index, 1);
     	this.setState({
     		cart: cart
     	});
     	this.sumTotalItems(this.state.cart);
     	this.sumTotalAmount(this.state.cart);
     	e.preventDefault();
     }

     checkItem = (itemID) => {
     	const cart = this.state.cart;
     	return cart.some(function(item) {
     		return item.id === itemID;
     	});
     }
     sumTotalItems = () => {
     	//const total = 0;
     	const cart = this.state.cart;
     	const total = cart.length;
     	this.setState({
     		totalItems: total
     	});
     }
     sumTotalAmount = () => {
     	var total = 0;
     	const cart = this.state.cart;
     	for (var i = 0; i < cart.length; i++) {
     		total += cart[i].price * parseInt(cart[i].quantity);
     	}
     	this.setState({
     		totalAmount: total
     	});
     }

	//Reset Quantity
	updateQuantity = (qty) => {
		this.setState({
			quantity: qty
		});
	}

	render() {
		return (
      <div className="App">
			<div className="container">
			<Header
			total={this.state.totalAmount}
			totalItems={this.state.totalItems}
			cartItems={this.state.cart}
			removeItem={this.handleRemoveItem}
			updateQuantity={this.updateQuantity}
			itemQuantity={this.state.moq}
			/>
      <a href="http://localhost:3000/auth/google" class="button">
               <div>
                 <span class="svgIcon t-popup-svg">
                   <svg
                     class="svgIcon-use"
                     width="25"
                     height="37"
                     viewBox="0 0 25 25"
                   >
                     <g fill="none" fill-rule="evenodd">
                       <path
                         d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z"
                         fill="#4285F4"
                       />
                       <path
                         d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z"
                         fill="#34A853"
                       />
                       <path
                         d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z"
                         fill="#FBBC05"
                       />
                       <path
                         d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z"
                         fill="#EA4335"
                       />
                     </g>
                   </svg>
                 </span>
                 <span class="button-label">Sign in with Google</span>
               </div>
               </a>
			<Menu
			itemsList={this.state.items}
			addToCart={this.handleAddToCart}
			itemQuantity={this.state.quantity}
			updateQuantity={this.updateQuantity}
			/>
			</div>
               </div>
			);
		}
	}

	export default App;
