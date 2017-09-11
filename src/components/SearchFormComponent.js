import React, {Component} from 'react';

class SearchForm extends Component {

	
	searchLocation(evt){
		evt.preventDefault();
		let location = document.getElementById("search-input").value;
		this.props.fetchData(location);
	}

	render(){
		return(
			<div className="row" >
				<form id="search" className="form-horizontal" method="GET">
					<div className="col-xs-10">
						<input type="text"  className="form-control" placeholder="WHERE YOU AT?" id="search-input"/>
					</div>
					<input type="submit" className=" btn btn-default col-xs-2" defaultValue="GO" onClick={this.searchLocation.bind(this)}  />
				</form>
			</div>
      	)
	}
}

export default SearchForm