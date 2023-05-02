// Import interface to local storage so that persistent data can be stored
import preactLocalStorage from 'preact-localstorage';

export default class ScheduleStorage{
    // Repeats enum
    static REPEATS = {
        MON: "M",
        TUE: "Tu",
        WED: "W",
        THU: "Th",
        FRI: "F",
        SAT: "Sa",
        SUN: "Su"
    }
    // Constructor to get the schedules from local storage and store in the object's state
    constructor(){
        // Get schedules json list from local storage
        const schedulesJSON = preactLocalStorage.get("schedules");
        // If schedules json is undefined, set the schedules to an empty list, otherwise set the schedules to the result of parsing the schedules json list
        this.state = {
            schedules: schedulesJSON === undefined ? [] : JSON.parse(schedulesJSON)
        };
    }

    // Static method to translate an object that has keys the same as the repeats enum, to a textual version
    static getRepeatAsText(repeats){
        // If all weekdays are set
        if (repeats[ScheduleStorage.REPEATS.MON] && repeats[ScheduleStorage.REPEATS.TUE] && repeats[ScheduleStorage.REPEATS.WED]
            && repeats[ScheduleStorage.REPEATS.THU] && repeats[ScheduleStorage.REPEATS.FRI]){
            // Then everyday is set if the weekend days are set too
            if (repeats[ScheduleStorage.REPEATS.SAT] && repeats[ScheduleStorage.REPEATS.SUN]){
                return "Every day";
            }
            // Otherwise if none of the weekend days are set then only the weekdays are set
            else if (!(repeats[ScheduleStorage.REPEATS.SAT] || repeats[ScheduleStorage.REPEATS.SUN])){
                return "Weekdays";
            }
        }
        // Otherwise if both weekend days are set
        else if (repeats[ScheduleStorage.REPEATS.SAT] && repeats[ScheduleStorage.REPEATS.SUN]){
            // Then only the days set are the weekend days if none of the weekdays are set
            if (!(repeats[ScheduleStorage.REPEATS.MON] || repeats[ScheduleStorage.REPEATS.TUE] || repeats[ScheduleStorage.REPEATS.WED]
                || repeats[ScheduleStorage.REPEATS.THU] || repeats[ScheduleStorage.REPEATS.FRI]))
            return "Weekends";
        }
        // Otherwise, simply list the names of the days
        let repeatsText = "";
        let hasRepeat = false;
        if (repeats[ScheduleStorage.REPEATS.MON]){
            repeatsText += "Mon, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.TUE]){
            repeatsText += "Tue, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.WED]){
            repeatsText += "Wed, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.THU]){
            repeatsText += "Thu, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.FRI]){
            repeatsText += "Fri, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.SAT]){
            repeatsText += "Sat, ";
            hasRepeat = true;
        }
        if (repeats[ScheduleStorage.REPEATS.SUN]){
            repeatsText += "Sun, ";
            hasRepeat = true;
        }
        // If there was a day selected then return the textual list of days, removing the ", " at the end from the last addition to the text
        if (hasRepeat){
            return repeatsText.substring(0, repeatsText.length - 2);
        }
        // Otherwise if no days are selected then there is no repeat
        return "Does not repeat";
    }

    // Add a schedule to the persistent data store
    addSchedule(schedule){
        // Add the schedule to the list of schedules
        this.state["schedules"].push(schedule);
        // Set the content of the persistent data store to the json text of the list of schedules
        preactLocalStorage.set("schedules", JSON.stringify(this.state["schedules"]));
    }

    // Return the list of schedules stored
    getSchedules(){
        return this.state["schedules"];
    }
}