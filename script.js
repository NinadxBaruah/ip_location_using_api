const ipAddress = document.querySelector("#ip-address");
const get_ip = document.querySelector("#get-ip");
const ipLat = document.querySelector("#ip-lat");
const ipLog = document.querySelector("#ip-log");
const ipCity = document.querySelector("#ip-city");
//ninad
const ipRegion = document.querySelector("#ip-region");
const ipOrg = document.querySelector("#ip-org");
const timeZone = document.querySelector("#timezone");
const dateAndTime = document.querySelector("#dateandtime");
const pincode = document.querySelector("#pincode");
const pincodeData = document.getElementById("pincodeData");
const message = document.getElementById("Message");

get_ip.addEventListener("click", () => {
  
  document.getElementById("big_div").style.display = "block";
  // fetching the IP from the api
  fetch("https://api64.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => {
      ipAddress.innerText += data.ip;
      const ip = data.ip;
      console.log(data.ip);
      // returning the data of the api to get long and lat for the next fetch chain
      return fetch(`https://ipinfo.io/${ip}/geo?token=527ff387fcffd4`);
    })
    .then((response) => response.json())
    .then((data) => {
      // here showing the lat , log , regeion , postal from the api json data
      console.log(data);
      ipCity.innerText += data.city;
      ipRegion.innerText += data.region;
      ipOrg.innerText += data.org;
      const corrdinates = data.loc.split(",");
    //ninad
      ipLat.innerText += corrdinates[0];
      ipLog.innerText += corrdinates[1];

      console.log(corrdinates);
      // and also pushing the data of timezone and post into coordinate array so that access the data into next fetch chain
      // this array also includes the lat and long
      corrdinates.push(data.timezone, data.postal);
      return corrdinates;
    })
    .then((data) => {
      console.log(data);

      const map = document.getElementById("map");
      // Now showing the map in the screen using lat and long from the returnning data from above fetch
      map.innerHTML = `<iframe src="https://maps.google.com/maps?q=${data[0]}, ${data[1]}&z=15&output=embed" width="100%" height="400px" frameborder="0" style="border:0"></iframe>`;

      timeZone.innerText += data[2];
      // using timezone creating time and date form users lat and long not mine
      // we also have the time zone data inthe corrdinate array and now into data variable
      let timeDateStr = new Date().toLocaleString("en-US", {
        timeZone: data[2],
      });
      dateAndTime.innerText += timeDateStr;
      pincode.innerText += data[3];

      fetch(`https://api.postalpincode.in/pincode/${data[3]}`)
        .then((response) => response.json())
        .then((data) => {
          message.innerText = data[0].Message;
        //ninad
        });

      // Here returning the postal code so that can get the all the postal details in the next fetch chain
      return data[3];
    })
    .then((data) => {
      fetch(`https://api.postalpincode.in/pincode/${data}`)
        .then((response) => response.json())
        .then((data) => {
          const data1 = data[0].PostOffice;
          // console.log(data);
          data1.forEach((postOffice) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML =
              "<label>Name:</label><p>" +
              postOffice.Name +
              "</p><br /><label>Brunch type:</label><p>" +
              postOffice.BranchType +
              "</p><br /><label>District:</label><p>" +
              postOffice.District +
              "</p><br /><label>Devision:</label><p>" +
              postOffice.Division +
              "</p>";

            pincodeData.appendChild(card);
          });
        });
        
    });
});

//  .catch((error) => {
//       console.log(error);
//     });
