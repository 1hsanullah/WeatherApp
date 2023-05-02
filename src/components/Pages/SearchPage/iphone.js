// import preact
import { h, render, Component } from 'preact';
// Import stylesheets for iphone, this page and button
import style from '../../iphone/style';
import page_style from './style_iphone';
import style_iphone from '../../button/style_iphone';
// Import the list of all locations to map location names to location id's
import locations from '../../../assets/allLocations.json';

export default class IphoneSearchPage extends Component{//Initializes the state of the component
    constructor(props){
        super(props);
        this.state = {
            input: "",
            advanceButtonText: props.goText,
            suggestions: locations,
            location_callback: props.locationCallback,
            name_callback: props.nameCallback
        };
    }

    inputChange(e){//This upadates the state of the component based on the input
        e.preventDefault();
        this.setState(
            {
                input: e.target.value,
                suggestions: locations.filter( (country) => {
                    return country["name"].toLowerCase().match(e.target.value.toLowerCase());
                })
            }
        );
    }
	render(){
	console.log(this.props.onAdvance);
	return (
		<div>
			<div class={ style.header }>
				<div class={ style.appTitle }>Search</div>
			</div>
            <div>
                <input type="text" placeholder="Search" onInput={this.inputChange.bind(this)} value={this.state.input}/>
                {/* <Button class={ style_iphone.button } clickFunction={()=>{this.state.name_callback(this.state.input)}} Text={this.state.advanceButtonText}/> */}
            </div>
			<div class= { style_iphone.container }>
            <ol class={page_style.searchSuggestions}>
                    {
                        this.state.suggestions.map((item, idx) => {
                            if (idx >= 200){
                                return null;
                            }
                            const text = item["name"] + " (" + item["country"] + ")";
                            return (<li key={item["id"]}><button onClick={()=>{this.state.location_callback(item)}}>{text}</button></li>);
                        })
                    }
                </ol>
			</div>
		</div>
	);
	}
}