// Import preact
import { h, render, Component } from 'preact';
// Import jquery for API calls
import $ from 'jquery';
// Import stylesheets for iphone, this page and button
import style from '../../iphone/style';
import page_style from './style_iphone';
import style_iphone from '../../button/style_iphone';
// Import APPID to use with the openweathermap API
import APPID from '../../../assets/APPID.json';
// Import settings storage to access preferences
import SettingsStorage from '../../SettingsStorage.js';
// Import method to translate a name to location
import nameToLocation from '../../translateNameToLocation.js';


export default class IphoneWeatherPage extends Component{
	// Constructor to set the state and retreive weather information
	constructor(props){
		super(props);
		// Setup access to the settings storage and store a boolean for if the server response failed
		this.state = {
			settingsStore: new SettingsStorage(),
			serverResponseFailed: false
		};
		// If the properties has a location ID defined, then use that
		if (props.LOCID){
			this.state.loc_id = props.LOCID;
			this.fetchWeatherData();
		}
		// Otherwise, if the properties has a latitude and longitude defined, use that
		else if (props.LAT && props.LON){
			this.fetchWeatherDataLatLon(props.LAT, props.LON);
		}
		// Otherwise, if the properties has a location name defined, use that
		else if (props.LOCNAME){
			nameToLocation(props.LOCNAME, this.lookupResponse.bind(this), this.serverFailed.bind(this));
		}
		// Otherwise there is no information to get the weather data, so set the server response failed boolean to true to display an error
		else{
			this.state.serverResponseFailed = true;
		}
	}

	// Callback method for looking up a name to a location id
	lookupResponse(parsed_json){
		// Try to access the first location id in the response json
		try{
			this.state.loc_id = parsed_json["list"][0]["id"];
			// Fetch the weather data of this location id
			this.fetchWeatherData();
		}
		// If there is a TypeError thrown, then the response json did not include a location id, set the state to reflect an error has occurred
		catch (TypeError){
			this.setState({serverResponseFailed: true});
		}
	}

	// Setup the url for fetching weather data using latitude and longitude
	fetchWeatherDataLatLon(lat, lon){
		var url = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&APPID="+APPID;
		// Execute the request to the constructed url
		this.fetchWeatherDataAJAX(url);
	}

	// Setup the url for fetching weather data using a location id
	fetchWeatherData() {
		var url = "http://api.openweathermap.org/data/2.5/weather?id="+this.state.loc_id+"&units=metric&APPID="+APPID;
		// Execute the request to the constructed url
		this.fetchWeatherDataAJAX(url);
	}

	// Executes a request for a JSON weather response to the url specified. Calls parseResponse on success and serverFailed on error
	fetchWeatherDataAJAX(url){
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse.bind(this),
			error : this.serverFailed.bind(this)
		})
	}

	// When the server fails to give a response, set the server response failed boolean to true
	serverFailed = (req, err) => {
		this.setState({serverResponseFailed:true});
	}

	// Extract the useful information from the json response and set the corresponding fields in the state of the object
	parseResponse = (parsed_json) => {
		// Extract useful information from the json response
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var min_temp_c = parsed_json['main']['temp_min'];
		var max_temp_c = parsed_json['main']['temp_max'];
		var conditions = parsed_json['weather']['0']['description'];
		var humidity = parsed_json['weather']['0']['description'];

		// Get target units to translate from celsius to
		const targetUnit = this.state["settingsStore"].getTempUnits();

		// Set the weather field in state so the information can be rendered later on
		this.setState({
			weather:{
				"locate": location,
				"temp": Math.round(this.translateTempToUnits(temp_c, targetUnit)),
				"min_temp": Math.round(this.translateTempToUnits(min_temp_c, targetUnit)),
				"max_temp": Math.round(this.translateTempToUnits(max_temp_c, targetUnit)),
				"cond": conditions
			}
		});
	}

	// Translate from degrees celsius to fahrenheit or kelvin
	translateTempToUnits(temp_c, target){
		if (target === this.state["settingsStore"].TEMP_UNITS.Kelvin){
			return temp_c + 273.15;
		}
		else if (target === this.state["settingsStore"].TEMP_UNITS.Fahrenheit){
			return (temp_c * 9 / 5) + 32;
		}
		return temp_c;
	}

	// Render the weather information
	render(){
		// Get the target unit to display for temperature
		const targetUnit = this.state["settingsStore"].getTempUnits();
		// By default, display as celsius
		let unitsStyle = page_style.celsius;
		// If settings are set to kelvin, display as kelvin instead
		if (targetUnit === this.state["settingsStore"].TEMP_UNITS.Kelvin){
			unitsStyle = page_style.kelvin;
		}
		// Otherwise, if settings are set to fahrenheit, display as fahrenheit instead
		else if (targetUnit === this.state["settingsStore"].TEMP_UNITS.Fahrenheit){
			unitsStyle = page_style.fahrenheit;
		}
		// Construct the style for displaying the temperatures
		const tempStyles = `${page_style.temperature} ${page_style.filled} ${unitsStyle}`;
		// Display the weather information if it has been fetched correctly.
		// Otherwise display a message corresponding to whether an error occurred or the weather information is still being fetched.
		return (this.state.weather ?
			<div>
				<div class={ style.header }>
					<div class={ style.city }>{ this.state.weather.locate }</div>
				</div>
				<div class={ style.details }>
					<div class={ style.conditions }>{ this.state.weather.cond }</div>
					<table class={ page_style.tempsTable }>
						<tr>
							<th>Minimum (today)</th>
							<th>Current Temperature</th>
							<th>Maximum (today)</th>
						</tr>
						<tr>
							<td class={tempStyles}>{ this.state.weather.min_temp }</td>
							<td class={tempStyles}>{ this.state.weather.temp }</td>
							<td class={tempStyles}>{ this.state.weather.max_temp }</td>
						</tr>
					</table>
				</div>
				<div class={ style_iphone.container }>
				</div>
			</div> : this.state["serverResponseFailed"] ?  <p>COULD NOT RETREIVE WEATHER DATA</p> : <p>Fetching data...</p>);
	}
}
