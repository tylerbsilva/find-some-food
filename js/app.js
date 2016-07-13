// API KEY: AIzaSyDRj8hLWs2TGSwdlB4eXTYF8EF6QwG-74M

function App(){
	// SET DEFAULT LOCATION TO SF
	var CURRENT_LOCATION = new google.maps.LatLng(37.7749, -122.4194);
	var MAP;
	// INITIALIZE FUNCTION, TAKES THE 3 IDS THAT WILL HANDLE INPUT AND OUTPUT
	function init(formID, searchID, mapID){
		//CHECK IF GEOLOCATION IS AVAILABLE
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				CURRENT_LOCATION = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			});
		}
		setupMap(mapID);
		// SETUP FORM SUBMISSION
		document.getElementById(formID).addEventListener('submit', function(e){
			e.preventDefault();
			var input = document.getElementById(searchID).value;
			SearchForm().handleSubmit(input, MAP, function(data, status, location){
				CURRENT_LOCATION = location;
				document.getElementById('pre').innerHTML = JSON.stringify(data);
			});
		});
	};
	function setupMap(mapID){
		MAP = new google.maps.Map(document.getElementById(mapID), {
      center: new google.maps.LatLng(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng),
      zoom: 15
    });
	};
	return {
		init: init
	}
}

function SearchForm(){

	function handleSubmit(input, mapObj, callback){
		var service = new google.maps.places.PlacesService(mapObj);
		var geocoder = new google.maps.Geocoder();
		var location;
		geocoder.geocode({
			address: input
		}, function(data, status){
			if(status !== "OK") {
				return alert("Something's wrong with your search, please try again!")
			}
			location = data[0].geometry.location;
			service.nearbySearch({
				location: location,
				radius: '5000'
			}, function(data, status){
				callback(data, status, location);
			});
		});
	}

	function geocodeAddress(addressString, callback){
		geocoder.geocode({
			address : addressString
		}, function(data, status){
			callback(data,status);
		});
	}
	return {
		handleSubmit : handleSubmit
	}
}
var app = App();
app.init('placesForm', 'placesSearch', 'placesOutput');
