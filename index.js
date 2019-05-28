const header = document.getElementById("myNav");
const sticky = header.offsetTop;

//make sticky navbar
window.onscroll = () => {
    if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
    } else {
        header.classList.remove("sticky");
    }
}

const url = "https://api.propublica.org/congress/v1/113/senate/members.json"

//function to get data from API
const fetchData = async (url) => {

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'X-API-Key': "HpC3jACcynQl3Q85Tov0jCR2jyfa8KVa2go9XPhj"
        }
    })

    // error object which is to reject promise
    if (response.status !== 200) {
        throw new Error("cannot fetch data")
    }
    const result = response.json()
    return result
}

//when promise is resolved, have to return promise and catch any error
fetchData(url)
    .then(data => {
        let myData = data.results[0].members
        congressTable(myData)
    })
    .catch(err => console.log(err.message))


const congressTable = (members) => {

    const tableBody = document.getElementById("tbody");

    members.map(member => {
        let row = tableBody.insertRow()
        row.insertCell().innerHTML = `<a href= ${member.url} target="_blank"> ${member.first_name} ${member.middle_name ? member.middle_name : ""} ${member.last_name} </keya>`;
        row.insertCell().innerHTML = member.party;
        row.insertCell().innerHTML = member.state;
        row.insertCell().innerHTML = member.seniority;
        row.insertCell().innerHTML = member.votes_with_party_pct.toFixed(1) + "%"
        tableBody.append(row);
    })
}
