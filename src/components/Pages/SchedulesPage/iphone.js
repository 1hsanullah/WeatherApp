// Import preact
import { h, render, Component } from 'preact';
// Import Button class
import Button from '../../button';
// Import stylesheets for iphone, this page and button
import style from '../../iphone/style';
import page_style from './style_iphone';
import style_iphone from '../../button/style_iphone';
// Import schedule storage to retrieve the stored schedules
import ScheduleStorage from '../../ScheduleStorage.js';


export default class IphoneSchedulesPage extends Component{
    constructor(props){
        super(props);
        // Construct a data store object to access the persistent storage
        const dataStore = new ScheduleStorage();
        // Store the neccessary information in the state of the object
        this.state = {
            schedules: dataStore.getSchedules(),
            newScheduleCallback: props.onNewSchedule,
            selectScheduleCallback: props.onSelectSchedule,
        };
    }

    // Render the list of schedules
	render(){
	    return (
		<div>
			<div class={ style.header }>
				<div class={ style.appTitle }>Schedules</div>
			</div>
            <div class={style_iphone.container}>
                <Button class={ style_iphone.button } clickFunction={this.state.newScheduleCallback} Text="Add new schedule"/>
            </div>
			<div class= { style_iphone.container }>
            <ol class={page_style.schedulesList}>
                    {
                        this.state.schedules.map((item, idx) => {
                            const text = item["title"];
                            let repeatsText = "Repeats: " + ScheduleStorage.getRepeatAsText(item.repeat);
                            return (
                            <li key={idx}>
                                <button onClick={()=>{this.state.selectScheduleCallback(item)}}>
                                    <div>
                                        <h1>{text}</h1>
                                        <h2>{repeatsText}</h2>
                                        {
                                        item.entries.map((item, idx) =>{
                                            let info = item.location["name"] + " (" + item.location["country"] + ") at ";
                                            if (item["hour"] == 0) info += "00";
                                            else info += item["hour"];
                                            info += ":";
                                            if (item["minute"] == 0) info += "00";
                                            else info += item["minute"];

                                            return <p>{info}</p>
                                        })
                                        }
                                    </div>
                                </button>
                            </li>);
                        })
                    }
                </ol>
			</div>
		</div>
	    );
	}
}