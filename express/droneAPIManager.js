const droneAPIURL = "http://drones.17-356.isri.cmu.edu/api/"
const fetch = require("node-fetch")

const airbaseID = 4

const sendDroneWithLocation = (droneID, latitude, longitude) => {
  const endpoint = droneAPIURL + "drones/" + droneID.toString() + "/send"
  return fetch(endpoint,
    {
      method: 'PUT',
      body: JSON.stringify({lat: lat, lon: lon})
    }).then(res => {
      if(res.status == 204) {
        return true
      } else {
        return false
      }
    }).catch(res => {
      return false
    })
}

const getDrone = (droneID, callback) => {
  const endpoint = droneAPIURL + "drones/" + droneID.toString()
  console.log(endpoint)
  console.log(droneID)
  return fetch(endpoint,
    {
      method: 'GET',
    }).then(response => {
        response.json().then((value) => {
          console.log("here3", value)
          callback(value)
        }).catch(err => console.log(err))
    }).catch(err => {
      callback(null)
    })

}

const getAirbase = (airbaseID, callback) => {
  const endpoint = droneAPIURL + "airbases/" + airbaseID.toString()
  return fetch(endpoint)
        .then((response) => {
          response.json().then((value) => {
            console.log("here2", value);
            callback(value);
          })
        })
        .catch((err) => callback(null))
}

const getFreeDroneInAirbase = (airbase, callback) => {
  if(airbase != null) {
    console.log("here1", airbase)
    for(var i = 0; i < airbase.drones.length; i++) {
      getDrone(parseInt(airbase.drones[i]), drone =>  {
        if(drone.current_delivery == null) {
          callback(drone.id)
        }
      })
    }
  }
}

const getFreeDroneID = (callback) => {
  getAirbase(airbaseID, (airbase) => getFreeDroneInAirbase(airbase, next))
}

module.exports = {
  getFreeDroneID
}
