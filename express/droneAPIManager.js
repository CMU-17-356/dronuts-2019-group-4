const droneAPIURL = "http://drones.17-356.isri.cmu.edu/api/"
const fetch = require("node-fetch")

const maxAirbaseID = 5

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

const getDrone = (droneID, next) => {
  const endpoint = droneAPIURL + "drones/" + droneID.toString()
  console.log(endpoint)
  console.log(droneID)
  return fetch(endpoint,
    {
      method: 'GET',
    }).then(response => {
        response.json().then((value) => {
          console.log("here3", value)
          next(value)
        }).catch(err => console.log(err))
    }).catch(err => {
      next(null)
    })

}

const getAirbase = (airbaseID, next) => {
  const endpoint = droneAPIURL + "airbases/" + airbaseID.toString()
  return fetch(endpoint)
        .then((response) => {
          response.json().then((value) => {
            console.log("here2", value);
            next(value);
          })
        })
        .catch((err) => next(null))
}

const getFreeDroneInAirbase = (airbase, next) => {
  if(airbase != null) {
    console.log("here1", airbase)
    for(var i = 0; i < airbase.drones.length; i++) {
      getDrone(parseInt(airbase.drones[i]), drone =>  {
        if(drone.current_delivery == null) {
          next(drone.id)
        }
      })
    }
  }
}

const getFreeDroneID = (next) => {
  for(var i = 1; i <= maxAirbaseID; i++) {
    getAirbase(i, (airbase) => getFreeDroneInAirbase(airbase, next))
  }
}

module.exports = {
  getFreeDroneID
}
