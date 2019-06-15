function pushHistory() {
    let record = team.exportJSON();
    if (!record.event.length) return;
    
    record.startTime = startTime.getTime();
    record.startTimeString = startTime.toLocaleString();
    if (localStorage.history) {
        let history = JSON.parse(localStorage.history);
        history.push(record);
        localStorage.history = JSON.stringify(history);
    } else {
        localStorage.history = JSON.stringify([record]);
    }
}