import preactLocalStorage from 'preact-localstorage';
//Importing preactLocalStorage

export default class SettingsStorage{//Exports the class
    constructor(){
        const settings = preactLocalStorage.getObject("settings");
        this.state = {
            settings: settings === {} ? {tempUnits: "C"} : settings
        };
        this.TEMP_UNITS = {
            Fahrenheit: "F",
            Celsius: "C",
            Kelvin: "K"
        };
    }

    setTempUnits(unit){//Class that takes a single argument unit, representing a tempertaure unit symbol
        if (Object.values(this.TEMP_UNITS).indexOf(unit) < 0){
            return false;
        }
        this.state["settings"]["tempUnits"] = unit;
        console.log(this.state["settings"]);
        preactLocalStorage.setObject("settings", this.state["settings"]);
        return true;
    }

    getTempUnits(){//Class of getTempUnits, it takes no arguments
        return this.state["settings"]["tempUnits"];
    }
}