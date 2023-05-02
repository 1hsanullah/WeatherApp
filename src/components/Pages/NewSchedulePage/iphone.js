// import preact
import { h, render, Component } from 'preact';
import Button from '../../button';
// Import stylesheets for iphone, this page and button
import style from '../../iphone/style';
import page_style from './style_iphone';
import style_iphone from '../../button/style_iphone';
// Import schedule storage to retrieve the stored schedules
import ScheduleStorage from '../../ScheduleStorage.js';
// Import 
import IphoneSearchPage from '../SearchPage/iphone.js';
import nameToLocation from '../../translateNameToLocation.js';


export default class IphoneNewSchedulePage extends Component{
    constructor(props){
        super(props);
        // Setup the default object of repeat values to be false for every day
        let defaultRepeat = {};
        for (const value of Object.values(ScheduleStorage.REPEATS)){
            defaultRepeat[value] = false;
        }
        // Setup the state of the object with the neccessary information
        this.state = {
            schedule: {
                title: props.title,
                repeat: defaultRepeat,
                entries: []
            },
            cancelCallback: props.onCancel,
            saveCallback: props.onSave,
            scheduleStorage: new ScheduleStorage(),
        };
        // Set the page content to the information entry page
        this.setContentToEntryInfo();
    }
    // When the name of the schedule is changed, push the change through to the state of the object
    scheduleNameChange(event){
        event.preventDefault();
        this.state["schedule"]["title"] = event.target.value;
    }
    // When the schedule is selected to be saved, add the schedule to the persistent storage, and call the save callback passed to the object
    saveSchedule(){
        this.state["scheduleStorage"].addSchedule(this.state["schedule"]);
        this.state["saveCallback"]();
    }
    // When the hour of an entry is changed, push the change through to the entry in the state of the object
    changeEntryHour(index, event){
        this.state.schedule.entries[index].hour = parseInt(event.target.value);
    }
    // When the minute of an entry is changed, push the change through to the entry in the state of the object
    changeEntryMinute(index, event){
        this.state.schedule.entries[index].minute = parseInt(event.target.value);
    }
    // If the repeat of a day is toggled, push the change through to the state of the object
    switchRepeat(day){
        this.state.schedule.repeat[day] = !this.state.schedule.repeat[day];
        this.setContentToEntryInfo();
    }
    // Add a new entry to the schedule, and switch the page content to the search page to select the location of the entry
    addNewEntry(){
        this.setState({
            pageContent: <IphoneSearchPage locationCallback={this.addNewEntryLocation.bind(this)} nameCallback={this.addNewEntryName.bind(this)} goText="Search"/>
        });
    }
    // Callback for adding a new entry by location
    addNewEntryLocation(location){
        // Add the location to the entries of the schedule, with the default time as 00:00
        this.state["schedule"]["entries"].push({
            location: location,
            hour: 0,
            minute: 0
        });
        // Switch the content of the page back to the information entry page
        this.setContentToEntryInfo();
    }
    // Callback for adding a new entry by name
    addNewEntryName(name){
        // Translate the location name to a location
        nameToLocation(name, this.parseLookupResponse.bind(this), null);
    }
    // Calls addNewEntryLocation with passing the correct parameter for the location
    parseLookupResponse(parsed_json){
		this.addNewEntryLocation(parsed_json["list"][0]);
	}
    // Set the content of the page to the information entry page
    setContentToEntryInfo(){
        this.setState({pageContent: <div>
        <div class={ style.header }>
            <div class={ style.appTitle }>New Schedule</div>
        </div>
        <div id="entries">
            <label for="schedule-name"></label>
            <input type="text" id="schedule-name" placeholder="Schedule Name" onInput={this.scheduleNameChange.bind(this)} value={this.state["schedule"]["title"]}></input>
            <div>
            {
                Object.keys(this.state.schedule.repeat).map((key, idx) => {
                    return <button class={(this.state.schedule.repeat[key]) ? page_style.repeat : page_style.norepeat} onClick={()=>this.switchRepeat(key)}>{key[0]}</button>;
                })
            }
            </div>
            <Button class={ style_iphone.button } clickFunction={()=>{this.addNewEntry()}} Text="Add new entry"/>
            <div id="maybethisone">
            
            {
                
                this.state["schedule"]["entries"].map((entry, idx)=>{
                    return <div>
                        <Button class={style_iphone.button} clickFunction={()=>{this.changeEntryLocation(idx)}} Text={entry["location"]["name"]}/>
                        <select name="hour" id="hour" onChange={(event)=>{this.changeEntryHour(idx, event)}}>
                            <option value="0">00</option>
                            <option value="1">01</option>
                            <option value="2">02</option>
                            <option value="3">03</option>
                            <option value="4">04</option>
                            <option value="5">05</option>
                            <option value="6">06</option>
                            <option value="7">07</option>
                            <option value="8">08</option>
                            <option value="9">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                        </select>
                        :
                        <select name="minute" id="minute" onChange={(event)=>{this.changeEntryMinute(idx, event)}}>
                            <option value="0">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </select>
                    </div>;
                }) 
            }
            </div>
        </div>
        <div class= { style_iphone.container }>
            <Button class={style_iphone.button} clickFunction={this.state["cancelCallback"]} Text="Cancel"></Button>
            <Button class={style_iphone.button} clickFunction={this.saveSchedule.bind(this)} Text="Save"></Button>
        </div>
    </div>});
    }
    // Render the current content of the page
	render(){
	    return this.state["pageContent"];
	}
}
