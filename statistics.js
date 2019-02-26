 window.onscroll = function () {
     myFunction()
 };

 var header = document.getElementById("myNav");
 var sticky = header.offsetTop;

 function myFunction() {
     if (window.pageYOffset > sticky) {
         header.classList.add("sticky");
     } else {
         header.classList.remove("sticky");
     }
 }


 if ((window.location.pathname == "/house-attendance-starter-page.html") || (window.location.pathname == "/house-party-loyalty-starter-page.html") || (window.location.pathname == "/house-starter-page.html")) {
     url = "https://api.propublica.org/congress/v1/113/house/members.json";

 } else {
     url = "https://api.propublica.org/congress/v1/113/senate/members.json";
 }

 fetch(url, {
     method: "GET",
     headers: {
         'X-API-Key': "HpC3jACcynQl3Q85Tov0jCR2jyfa8KVa2go9XPhj"
     }
 }).then(function (response) {

     if (response.ok) {
         return response.json();
     }
     throw new Error(response.statusText);
 }).then(function (json) {

     if (window.location.pathname == "/house-attendance-starter-page.html") {
         genAttendTable(json.results[0].members);
         getBottomAttendance(json.results[0].members);
         getTopAttendance(json.results[0].members);
     } else if (window.location.pathname == "/house-party-loyalty-starter-page.html") {
         genAttendTable(json.results[0].members);
         getBottomLoyalty(json.results[0].members);
         getTopLoyalty(json.results[0].members);
     } else if (window.location.pathname == "/senate-attendance-starter-page.html") {
         genAttendTable(json.results[0].members);
         getBottomAttendance(json.results[0].members);
         getTopAttendance(json.results[0].members);
     } else if (window.location.pathname == "/senate-party-loyalty-starter-page.html") {
         genAttendTable(json.results[0].members);
         getBottomLoyalty(json.results[0].members);
         getTopLoyalty(json.results[0].members);
     } else {
         stateSelectList(json.results[0].members);
         genMemberTable(json.results[0].members);
         filterByCheck();
         filterBySelect();
         showHideRow();

     }

     document.getElementById("lds-dual-ring").style.display = "none";

 }).catch(function (error) {
     console.log("Request failed: " + error.message);
 });

 function genAttendTable(members) {

     var allDem = members.filter(member => member.party === "D");
     var allRep = members.filter(member => member.party === "R");
     var allInd = members.filter(member => member.party === "I");

     var avgDemVotes = allDem.reduce((add, member) =>
         add + (member.votes_with_party_pct / allDem.length), 0);
     var avgRepVotes = allRep.reduce((add, member) => add + (member.votes_with_party_pct / allRep.length), 0);
     var avgIndVotes = allInd.reduce((add, member) => add + (member.votes_with_party_pct / allInd.length), 0);
     var allVotes = members.reduce((add, member) => add + (member.votes_with_party_pct / members.length), 0);
     var tBody = document.getElementById("attendance");

     const row1 = document.createElement("tr");
     row1.insertCell().innerHTML = "Republican";
     row1.insertCell().innerHTML = allRep.length;
     row1.insertCell().innerHTML = avgRepVotes.toFixed(1);
     tBody.append(row1);
     const row2 = document.createElement("tr");
     row2.insertCell().innerHTML = "Democrat";
     row2.insertCell().innerHTML = allDem.length;
     row2.insertCell().innerHTML = avgDemVotes.toFixed(1);
     tBody.append(row2);
     const row3 = document.createElement("tr");
     row3.insertCell().innerHTML = "Independent";
     row3.insertCell().innerHTML = allInd.length;
     row3.insertCell().innerHTML = avgIndVotes.toFixed(1);
     tBody.append(row3);
     const row4 = document.createElement("tr");
     row4.insertCell().innerHTML = "Total";
     row4.insertCell().innerHTML = members.length;
     row4.insertCell().innerHTML = allVotes.toFixed(1);
     tBody.append(row4);
 }

 //bottom 10% attendence by number and percent of missed votes 
 function getBottomAttendance(members) {

     const ten_pct = (Math.round(members.length * 0.1) - 1);
     var sortBottom = members.sort(function (a, b) {
         return b.missed_votes_pct - a.missed_votes_pct;
     });

     var bottomTenPct = [];
     bottomTenPct = sortBottom.filter(member => member.missed_votes_pct >= sortBottom[ten_pct].missed_votes_pct);
     var tBody = document.getElementById("least_engaged");

     for (var i = 0; i < bottomTenPct.length; i++) {
         var row = document.createElement("tr");
         var col = [(bottomTenPct[i].first_name + " " + (bottomTenPct[i].middle_name || "") + " " + bottomTenPct[i].last_name), bottomTenPct[i].missed_votes, bottomTenPct[i].missed_votes_pct.toFixed(1)]

         for (var j = 0; j < col.length; j++) {
             var cell = document.createElement("td");
             cell.innerHTML = col[j];
             row.append(cell);
         }
         tBody.append(row);
     }
 }

 function getTopAttendance(members) {

     const ten_pct = (Math.round(members.length * 0.1) - 1);
     var sortTop = members.sort(function (a, b) {
         return a.missed_votes_pct - b.missed_votes_pct;
     });

     var topTenPct = [];
     topTenPct = sortTop.filter(member => member.missed_votes_pct <= sortTop[ten_pct].missed_votes_pct)

     var tBody = document.getElementById("most_engaged");

     for (var i = 0; i < topTenPct.length; i++) {
         var row = document.createElement("tr");
         var col = [(topTenPct[i].first_name + " " + (topTenPct[i].middle_name || "") + " " + topTenPct[i].last_name), topTenPct[i].missed_votes, topTenPct[i].missed_votes_pct.toFixed(1)];

         for (var j = 0; j < col.length; j++) {
             var cell = document.createElement("td");
             cell.innerHTML = col[j];
             row.append(cell);
         }
         tBody.append(row);
     }
 }

 function getTopAttendance(members, prop) {

     const ten_pct = (Math.round(members.length * 0.1) - 1);
     var sortTop = members.sort(function (a, b) {
         return a.missed_votes_pct - b.missed_votes_pct;
     });

     var topTenPct = [];
     topTenPct = sortTop.filter(member => member.missed_votes_pct <= sortTop[ten_pct].missed_votes_pct)

     var tBody = document.getElementById("most_engaged");

     for (var i = 0; i < topTenPct.length; i++) {
         var row = document.createElement("tr");
         var col = [(topTenPct[i].first_name + " " + (topTenPct[i].middle_name || "") + " " + topTenPct[i].last_name), topTenPct[i].missed_votes, topTenPct[i].missed_votes_pct.toFixed(1)];

         for (var j = 0; j < col.length; j++) {
             var cell = document.createElement("td");
             cell.innerHTML = col[j];
             row.append(cell);
         }
         tBody.append(row);
     }
 }




 function getBottomLoyalty(members) {

     const ten_pct = (Math.round(members.length * 0.1) - 1);
     var sortBottom = members.sort(function (a, b) {
         return a.votes_with_party_pct - b.votes_with_party_pct;
     });

     var bottomTenPct = [];
     bottomTenPct = sortBottom.filter(member => member.votes_with_party_pct <= sortBottom[ten_pct].votes_with_party_pct);

     var tBody = document.getElementById("least_loyal");
     for (var i = 0; i < bottomTenPct.length; i++) {

         var row = document.createElement("tr");
         var col = [(bottomTenPct[i].first_name + " " + (bottomTenPct[i].middle_name || "") + " " + bottomTenPct[i].last_name), bottomTenPct[i].total_votes, bottomTenPct[i].votes_with_party_pct.toFixed(1)]

         for (var j = 0; j < col.length; j++) {
             var cell = document.createElement("td");
             cell.innerHTML = col[j];
             row.append(cell);
         }
         tBody.append(row);
     }
 }

 function getTopLoyalty(members) {

     const ten_pct = (Math.round(members.length * 0.1) - 1);
     var sortTop = members.sort(function (a, b) {
         return b.votes_with_party_pct - a.votes_with_party_pct;
     });

     var topTenPct = [];
     topTenPct = sortTop.filter(member => member.votes_with_party_pct >= sortTop[ten_pct].votes_with_party_pct);

     var tBody = document.getElementById("most_loyal");
     for (var i = 0; i < topTenPct.length; i++) {
         var row = document.createElement("tr");
         var col = [topTenPct[i].first_name + " " + (topTenPct[i].middle_name || "") + " " + topTenPct[i].last_name, topTenPct[i].total_votes, topTenPct[i].votes_with_party_pct.toFixed(1)];

         for (var j = 0; j < col.length; j++) {
             var cell = document.createElement("td");
             cell.innerHTML = col[j];
             row.append(cell);
         }
         tBody.append(row);
     }
 }

 function genMemberTable(members) {

     var tBody = document.getElementById("tbody");
     for (var i = 0; i < members.length; i++) {
         var row = document.createElement("tr")
         //var link = members.url;
         var a = document.createElement("a");
         //a.setAttribute("href", link);
         //a.setAttribute("target", "_blank");
         row.insertCell().innerHTML = '<a href=' + members[i].url + ' + target="_blank">' + (members[i].first_name + " " + (members[i].middle_name || "") + " " + members[i].last_name) + '</a>';
         row.insertCell().innerHTML = members[i].party;
         row.insertCell().innerHTML = members[i].state;
         row.insertCell().innerHTML = members[i].seniority;
         row.insertCell().innerHTML = members[i].votes_with_party_pct.toFixed(1) + "%";
         tbody.append(row); //append each row to table body
     }
 }

 function stateSelectList(members) {

     var allStates = [];
     members.filter(member => allStates.push(member.state));
     var uniqueStates = [...new Set(allStates)].sort();

     var select = document.getElementById("state-filter");

     for (var i = 0; i < uniqueStates.length; i++) {
         var newOption = document.createElement("option")
         newOption.setAttribute("value", uniqueStates[i]);
         newOption.append(uniqueStates[i]);
         select.append(newOption);
     }
 }

 function filterByCheck() {
     var allCheckBox = document.querySelectorAll("input[name=chkb]");
     for (var i = 0; i < allCheckBox.length; i++) {
         allCheckBox[i].addEventListener("click", showHideRow, false);
     }
 }

 function filterBySelect() {
     var select = document.getElementById("state-filter").addEventListener("change", showHideRow, false);
     // console.log(select);
 }

 function showHideRow() {
     var allRows = document.getElementById("tbody").rows;
     var select = document.getElementById("state-filter").value;
     var allCheckBox = document.querySelectorAll("input[name=chkb]:checked");

     for (var i = 0; i < allRows.length; i++) {
         allRows[i].style.display = "none";
         if (allCheckBox.length == 0 && select == "ALL") {
             allRows[i].style.display = "table-row";

         } else {
             if ((allCheckBox.length == 0) && (select == allRows[i].children[2].innerHTML)) {
                 allRows[i].style.display = "table-row";


             } else {
                 for (var j = 0; j < allCheckBox.length; j++) {
                     if ((select === "ALL") && (allCheckBox[j].value === allRows[i].children[1].innerHTML)) {
                         allRows[i].style.display = "table-row";
                     } else {
                         if ((select === allRows[i].children[2].innerHTML) && (allCheckBox[j].value === allRows[i].children[1].innerHTML)) {
                             allRows[i].style.display = "table-row";

                         }
                     }
                 }

             }
         }
     }

     //var rows = document.querySelectorAll("tr");
     //if ((rows.length - 1) == allRows.length) {
     //  const emptyRow = document.createElement("tr");
     // emptyRow.insertCell().innerHTML = "No results";
     // tbody.append(emptyRow);
     //}
 }
