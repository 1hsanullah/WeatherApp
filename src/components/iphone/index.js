// import preact
import { h, render, Component } from 'preact';
// import stylesheets for iphone & button
import style from './style';
// Import the different pages of the app
import IphoneLandingPage from '../Pages/LandingPage/iphone.js';
import IphoneWeatherPage from '../Pages/WeatherPage/iphone.js';
import IphoneSearchPage from '../Pages/SearchPage/iphone.js';
import IphoneSchedulesPage from '../Pages/SchedulesPage/iphone.js';
import IphoneSchedulePage from '../Pages/SchedulePage/iphone.js';
import IphoneNewSchedulePage from '../Pages/NewSchedulePage/iphone.js';
import IphoneSettingsPage from '../Pages/SettingsPage/iphone.js';

export default class Iphone extends Component {
	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setPageContent(<IphoneLandingPage onAdvance={this.goToWeatherHerePage.bind(this)}/>);
	}
	// Sets the state of the object with the new page content
	setPageContent(newContent){
		this.setState({pageContent: newContent});
	}
	// Sets the page content to the landing page
	goToHomePage(){
		this.setPageContent(<IphoneLandingPage onAdvance={this.goToWeatherHerePage.bind(this)}/>);
	}
	// Sets the page content to the weather page at the user's location
	goToWeatherHerePage(){
		navigator.geolocation.getCurrentPosition((position)=>{
			this.setPageContent(<IphoneWeatherPage LAT={position.coords.latitude} LON={position.coords.longitude}/>);
		});
	}
	// Sets the page content to the search page
	goToSearchPage(){
		this.setPageContent(<IphoneSearchPage locationCallback={this.locationCallback.bind(this)} nameCallback={this.nameCallback.bind(this)} goText="Display Weather"/>);
	}
	// Callback for showing the weather page by location
	locationCallback(location){
		this.setPageContent(<IphoneWeatherPage LOCID={location["id"]}/>);
	}
	// Callback for showing the weather page by location name
	nameCallback(name){
		this.setPageContent(<IphoneWeatherPage LOCNAME={name}/>);
	}
	// Sets the page content to the schedules page
	goToSchedulesPage(){
		this.setPageContent(<IphoneSchedulesPage onNewSchedule={this.goToNewSchedulePage.bind(this)} onSelectSchedule={this.goToSchedulePage.bind(this)}/>);
	}
	// Sets the page content to the new schedule page
	goToNewSchedulePage(){
		this.setPageContent(<IphoneNewSchedulePage defaultTitle="New Schedule" onCancel={this.goToHomePage.bind(this)} onSave={this.goToHomePage.bind(this)}/>);
	}
	// Sets the page content to a schedule's page
	goToSchedulePage(schedule){
		this.setPageContent(<IphoneSchedulePage schedule={schedule} onLocation={this.locationCallback.bind(this)}/>);
	}
	// Sets the page content to the settings page
	goToSettingsPage(){
		this.setPageContent(<IphoneSettingsPage/>);
	}
	// Display the page content and the bottom navbar buttons
	render() {
		return (
			<div class={ style.container }>
				<div>
					{ this.state.pageContent }
				</div>
				<ol class={style.bottomNavbar}>
					<li class={style.list}><img class={style.home} src="../assets/icons/home.png" onclick={this.goToHomePage.bind(this)}></img></li>
					<li class={style.list}><img class={style.calendar} src="../assets/icons/calendar.png" onclick={this.goToSchedulesPage.bind(this)}></img></li>
					<li class={style.list}><img class={style.search} src="../assets/icons/search.png" onclick={this.goToSearchPage.bind(this)}></img></li>
					<li class={style.list}><img class={style.settings} src="../assets/icons/settings.png" onclick={this.goToSettingsPage.bind(this)}></img></li>
				</ol>
				<div class={style.fog}>
					<img src="../assets/icons/fog.png"></img>
				</div>
			</div>
		);
	}
}
