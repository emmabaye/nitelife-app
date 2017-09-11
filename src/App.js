import React, { Component } from 'react';
import SearchForm from './components/SearchFormComponent';
import {Venue} from './components/VenueComponent';
import '../public/css/font-awesome.min.css';
import '../public/css/main.css';
import axios from 'axios';
import {_getEnvURL} from './utilities.js';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      venues: [],
      loading: true,
      isLoggedIn: false
    };


  }

  componentWillMount(){
    //check if user is logged in
      axios({
        method:'get',
        url: _getEnvURL('/authStatus'),
        withCredentials: true
      }).then((json)  => {
          return json.data
      }).then((jsonData) => {
          console.log(" authStatus: ", jsonData);
          this.setState({isLoggedIn: jsonData.authStatus})
          console.log(this.state.isLoggedIn)
      }).catch(function(error){
          console.log("Error: ", error);
      })
      
   
  }
  

  async fetchData(location){
      this.setState({...this.state, loading: true});
      try{
        let response = await axios({
          method: 'get',
          url: _getEnvURL('/search/' + location),
          withCredentials: true
        });
        let json = await response.data;
        console.log(json);
        this.setState({venues: json, loading: false});
        //console.log(this.state.venues);
      }
      catch(e) {
        this.setState({...this.state.venues, loading: false});
        console.log("ERROR ", e)
      } 
    }


    userHasLoggedIn(){
      if(localStorage.searchInput === undefined){
        return;
      }
      document.getElementById("search-input").value = localStorage.getItem('searchInput');
      this.fetchData(localStorage.getItem('searchInput'));
      localStorage.removeItem('searchInput')
      console.log("userHasLoggedIn");
    }


  componentDidMount(){
    this.setState({...this.state, loading: false});
    this.userHasLoggedIn();
    console.log("NODE_ENV:  ", process.env.NODE_ENV);
    console.log("Page has loaded");

  }


  render() {

    return (
          <div className="container" >
          {this.state.isLoggedIn && <a id="logout" href={_getEnvURL("/logout")}>Log Out</a>}
            <div className="row">
              <h1>Plans tonight?</h1>
            </div>
            <div className="row">
              <p className="h1"><i className="fa fa-map-marker"></i> <i className="fa fa-car"></i> <i className="fa fa-glass"></i></p>
            </div>
            <div className="row">
              <p className="h4">See which bars are hopping tonight and RSVP ahead of time! <br/>Remember: take a cab and drink responsibly.</p>
              <br />
            </div>

            <SearchForm fetchData={this.fetchData.bind(this)} />
            {this.state.venues.error && <b><p><br/>{this.state.venues.error}</p></b>}

            {/* RESULTS */}
            <div  className="container result">
              <div className="row spinner">
                <p className="h1">{this.state.loading && <i className="fa fa-spinner fa-pulse"></i>}</p>
              </div>
                {
                  (this.state.venues.length > 0) ? this.state.venues.map((item) =>  <Venue key={item.venue.id} venueDetails={item} isLoggedIn={this.state.isLoggedIn}/>): ""
                }
            </div>
          </div>
    ); 
  
  }

}

export default App;
