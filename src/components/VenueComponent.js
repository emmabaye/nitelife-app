import React, {Component} from 'react';
import axios from 'axios';
import {_getEnvURL} from '../utilities.js';



 export class Venue extends Component{

 	constructor(props){
 		super(props);
 		this.state = {
 			id: this.props.venueDetails.venue.id,
 			name: this.props.venueDetails.venue.name,
 			imageUrl: this.props.venueDetails.venue.photos.groups[0].items[0].prefix + "200x200" + this.props.venueDetails.venue.photos.groups[0].items[0].suffix,
 			venueUrl: this.props.venueDetails.venue.url,
 			tip: this.props.venueDetails.tips[0].text,
 			isLoggedIn : this.props.isLoggedIn,
 			personsGoing: 0
				
 		}
 	}


 	going = (evt) => {
 		evt.preventDefault();
 		console.log("banana");
 		console.log("isLoggedIn: ",this.state.isLoggedIn);

 		if(!this.state.isLoggedIn){
 			console.log("YOU ARE NOT LOGGED IN");
 			localStorage.setItem('searchInput',  document.getElementById("search-input").value);
 			window.location = _getEnvURL("/auth/facebook");
 		}

		axios({
			method: 'post',
			url: _getEnvURL('/venueId'),
			data: {
				venueId: this.state.id
				},
			withCredentials: true,
			})
			.then(function(response) {
				console.log("venue response",response.data);
				this.setState({personsGoing: response.data.going});
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
 	}


 	componentDidMount() {

 		console.log(this.state.id);
 		axios({
			method: 'get',
			url: _getEnvURL('/venueId'),
			params: {
				venueId: this.state.id
				},
			withCredentials: true,
			})
			.then(function(response) {
				console.log("venue response",response.data);
				this.setState({personsGoing: response.data.going});
			}.bind(this))
			.catch(function(error) {
				console.log(error);
			});
 	}

	render(){
		return (
			<div className="row result-row">
				<img alt="" src={this.state.imageUrl}/>
				<a href={this.state.venueUrl} >{this.state.name}</a>
				<form className="going-form" method="POST" encType="multipart/form-data" action={_getEnvURL('/venueId')}>
					<input type="hidden" name="venueId" defaultValue={this.state.id} />
					<button className="going-button" onClick={this.going}>{this.state.personsGoing} GOING</button>
				</form>
				<br />
				<p>{this.state.tip}</p>
			</div>
			)
	}
}
