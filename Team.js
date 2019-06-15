const Line1 = "Line 1";
const Line2 = "Line 2";
const Line3 = "Line 3";
const PassGerege = "Pass Gerege";
const ReachMountain = "Reach Mountain urtuu";
const ReachUukhai = "Reach Uukhai zone";
const Shagai = "Shagai";
const Camel = "Camel";
const Horse = "Horse";
const UUKHAI = "UUKHAI";
const NoTask = "No Task";

class Team {
	constructor(name = undefined, field = undefined) {
		this.name = name ? name : "";
		this.field = field ? field : "";
		this.reset();
	}

	setName(name) {
		this.name = name;
	}

	setField(Field) {
		this.field = field;
	}

	reset() {
		this.score = 0;
		this.numOfRetry = 0;
		this.numOfViolation = 0;
		this.onRetry = false;
		this.event = [];
		this.curTaskMR1 = Line1;
		this.curTaskMR2 = NoTask;
		this.shagaiThrown = 0;
	}

	toggleRetry(){
		if (this.onRetry) {
			this.addEvent("Retry End");
		} else {
			this.addEvent("Retry Start");
			this.numOfRetry++;
		}
		this.onRetry = !this.onRetry;
	}

	violation() {
		this.numOfViolation++;
		this.addEvent("Violation");
		if (!this.onRetry)
			this.toggleRetry();
	}

	addEvent(event) {
		this.event.push({time: timer.getRawTime(), timeString:timer.getTimeString(), event: event});
	}

	findEvent(event) {
		for (var pastEvent of this.event) {
			if (pastEvent.event == event)
				return true;
		}
		return false;
	}

	findAllEvent(event) {
		let events = [];
		for (var pastEvent of this.event) {
			if (pastEvent.event == event)
				events.push(pastEvent);
		}
		return events;
	}

	undo() {
		if (!this.event.length) return;
		switch (this.event.pop().event) {
			case "Retry Start":
				--this.numOfRetry;
				this.onRetry = false;
				break;

			case "Retry End":
				this.onRetry = true;
				break;

			case "Violation":
				--this.numOfViolation;
				break;

			case Line1:
				this.score -= 20;
				this.curTaskMR1 = Line1;
				break;

			case PassGerege:
				this.score -= 20;
				this.curTaskMR1 = PassGerege;
				this.curTaskMR2 = NoTask;
				break;

			case Line2:
				this.score -= 30;
				this.curTaskMR2 = Line2;
				break;
			
			case Line3:
				this.score -= 30;
				this.curTaskMR2 = Line3;
				break;

			case ReachMountain:
				this.score -= 30;
				this.curTaskMR1 = PassGerege;
				this.curTaskMR2 = ReachMountain;
				break;

			case Shagai:
				--this.shagaiThrown;
				this.score -= 20;
				if (this.score < 180)
					this.curTaskMR2 = ReachMountain;
				break;

			case Camel:
				--this.shagaiThrown;
				this.score -= 40;
				if (this.score < 180)
					this.curTaskMR2 = ReachMountain;
				break;

			case Horse:
				--this.shagaiThrown;
				this.score -= 50;
				if (this.score < 180)
					this.curTaskMR2 = ReachMountain;
				break;
		}
	}

	completeTaskMR1(shagai = None) {
		if (this.onRetry || this.curTaskMR1 == NoTask)
			return false;

		switch (this.curTaskMR1) {
			case Line1:
				this.score += 20;
				this.curTaskMR1 = PassGerege;
				this.addEvent(Line1);
				break;

			case PassGerege:
				if (this.findEvent(PassGerege)) return false;
				this.score += 20;
				this.curTaskMR2 = Line2;
				this.addEvent(PassGerege);
				break;

			case Shagai:
				if (this.shagaiThrown >= 3) return false;
				++this.shagaiThrown;

				switch (shagai) {
					case Shagai: this.score += 20; break;
					case Camel:  this.score += 40; break;
					case Horse:  this.score += 50; break;
					default: break;
				}

				this.addEvent(shagai);

				if (this.score >= 180 && this.curTaskMR2 == ReachMountain)
					this.curTaskMR2 = ReachUukhai;
				break;
			default: break;
		}

		return true;
	}

	completeTaskMR2() {
		if (this.onRetry || this.curTaskMR2 == NoTask)
			return false;

		switch (this.curTaskMR2) {
			case Line2:
				this.score += 30;
				this.curTaskMR2 = Line3;
				this.addEvent(Line2);
				break;

			case Line3:
				this.score += 30;
				this.curTaskMR2 = ReachMountain;
				this.addEvent(Line3);
				break;

			case ReachMountain:
				if (this.findEvent(ReachMountain)) return false;
				this.score += 30;
				this.curTaskMR1 = Shagai;
				this.addEvent(ReachMountain);
				break;

			case ReachUukhai:
				this.score += 30;
				this.curTaskMR2 = UUKHAI;
				this.addEvent(ReachUukhai);
				break;

			case UUKHAI:
				if (this.findEvent(UUKHAI)) return false;
				this.addEvent(UUKHAI);
				break;

			default: break;
		}
		return true;
    }
    
    exportJSON() {
        return {
            field: this.field,
            name: this.name,
            score: this.score,
            retry: this.numOfRetry,
            violation: this.numOfViolation,
            event: this.event
        }
    }
}