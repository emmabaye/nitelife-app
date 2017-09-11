'use strict';


var searchForm = document.querySelector("#search");
var searchInput = document.querySelector("#search-input");
var result = document.querySelector(".result");
var goingForm = document.querySelectorAll(".going-form");
var goingButton = document.querySelectorAll(".going-button");


var attachFormParameters = function(){
	
	for( var i = 0; i < goingForm.length; i++){
		console.log("attach");
		console.log(goingForm[i].childNodes[0].value)
		// 1 GOING
		goingForm[i].going = true;
		goingForm[i].addEventListener('submit', function(evt){
		evt.preventDefault();

		// since goingForm is not accessible in listener
		var goingForm = evt.target;
		var goingButton = evt.target.childNodes[1];
		var going = goingForm.going;
		console.log(goingForm.childNodes[0].value)

		if(going){
			var personsGoing = 1 + parseInt(goingButton.innerHTML.split(" ")[0]);
			goingButton.innerHTML = personsGoing + " GOING";
			goingForm.going = false;
		} else if(!going){
			var personsGoing = parseInt(goingButton.innerHTML.split(" ")[0]) - 1;
			goingButton.innerHTML = personsGoing + " GOING";
			goingForm.going = true;
		}
		
		fetch('/venueId', {
			method: 'POST',
			credentials: 'include',
			body: new FormData(goingForm)
		}).then(function(response){
			return response.json()
		}).then(function(json){
			console.log(json);
			//update button value with value from data base
			//gingButton = 
		})

	}, false)

}
}

searchForm.addEventListener('submit',function(evt){
	evt.preventDefault();
	console.log(searchInput.value);
	console.log("Hello");
	
	fetch('/search/france', {
	}).then(function(response){
			result.innerHTML = "<div class=\"row spinner\"><p class=\"h1\"><i class=\"fa fa-spinner fa-pulse\"></i></p></div>"

			return response.json()
		}). then(function(jsonData){
			result.innerHTML = "";

			jsonData.forEach(function(item){
				console.log(item);
				var imageUrl = item.venue.photos.groups[0].items[0].prefix + "200x200" + item.venue.photos.groups[0].items[0].suffix;
				var venueUrl = item.venue.url;
				var div = document.createElement("div");
				div.className = "row result-row";
				div.innerHTML = "<img src=\""+ imageUrl +"\"><span><a href=\""+ 
				 venueUrl +"\">"+ item.venue.name +"</a><form class=\"going-form\"   enctype=\"multipart/form-data\">" +
					"<input type=\"hidden\" name=\"venueId\" value=\"" + item.venue.id + "\"><button  class=\"going-button\">0 GOING</button></form></span><br><br><p >"+ item.tips[0].text +"</p>";
				result.append(div);

				
			});

		}).then(function(){

			// Reload form and button array to contain new objects
			goingButton = document.querySelectorAll(".going-button");
			goingForm = document.querySelectorAll(".going-form");

			attachFormParameters();
		})
})


console.log("Run");
// number of persons going to the restuarant



;




