import { h, render, Component } from 'preact';
//Imports three symbols from the preact library: h, render, and Component
import Button from '../../button';
import style from '../../iphone/style';
import style_iphone from '../../button/style_iphone';

export default class IphoneLandingPage extends Component{//Default export of the module
	render(){
	console.log(this.props.onAdvance);
	return (//This returns a virtual DOM tree
		<div>
			<div class={ style.header }>
				<div class={ style.appTitle }>COMMUTE WEATHER</div>
			</div>
			<div class= { style_iphone.container }>
				<Button class={ style_iphone.button } clickFunction={this.props.onAdvance} Text="Display weather here"/>
			</div>
		</div>
	);
	}
}