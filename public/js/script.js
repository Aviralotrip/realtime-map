const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      socket.emit("send coordinates", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}


const map = L.map("map").setView([0, 0], 10);
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribute:"OpenStreetMap",
}).addTo(map);


const marker ={}

socket.on("recieve coordinates", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude],16);

    if(!marker[id]){    
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }else{
        marker[id].setLatLng([latitude, longitude]);
    }
})


socket.on("user-dissconected", (id) => {
    if(marker[id]){
        map.removeLayer(marker[id]);
        delete marker[id];
    }

})