function getMinutes(time) {
    let parts = time.split(":");
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function highlightCurrent() {

    let now = new Date();
    let current = now.getHours() * 60 + now.getMinutes();

    let rows = document.querySelectorAll(".row");

    rows.forEach(row => {

        let start = getMinutes(row.dataset.start);
        let end = getMinutes(row.dataset.end);

        if (current >= start && current <= end) {
            row.classList.add("current");
        }
        else {
            row.classList.remove("current");
        }

    });

}

setInterval(highlightCurrent, 60000);
highlightCurrent();