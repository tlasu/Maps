function init(config) {

    const inactive = {
        color: "blue",
        weight: 1
    };

    const active = {
        color: "orange",
        weight: 1
    };

    const map = L.map("map", config.mapOption);

    L.control.scale({
        imperial: false,
        metric: true
    }).addTo(map);

    

    L.control.layers({
        "地理院 標準地図": L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 20,
            maxNativeZoom: 18,
            attribution: 'Map data <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>'
        }).addTo(map),
        "地理院 淡色地図(Zoom2～)": L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 20,
            maxNativeZoom: 18,
            attribution: 'Map data <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>'
        }),
        "地理院 English(Zoom2～)": L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/english/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 20,
            maxNativeZoom: 18,
            attribution: 'Map data <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>'
        }),
        "地理院 陰影起伏(Zoom2～)": L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png', {
            minZoom: 2,
            maxZoom: 20,
            maxNativeZoom: 18,
            attribution: 'Map data <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>'
        }),
        "地理院 写真(Zoom9～)": L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg', {
            minZoom: 9,
            maxZoom: 20,
            maxNativeZoom: 18,
            attribution: 'Map data <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>( Zoom9～13:Landsat8画像（GSI,TSIC,GEO Grid/AIST）, Landsat8画像（courtesy of the U.S. Geological Survey）, 海底地形（GEBCO）)'
        })
    }).addTo(map);

    const bounds = config.bounds;
    const cells = {};

    
    const set_latlonlist = function(box){
        return `area=${box.getSouthWest()['lat']},${box.getNorthEast()['lat']},\
${box.getSouthWest()['lng']},${box.getNorthEast()['lng']}`;
    }

    const makegeojsontxt = function(box){
    const tt =`
    {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "coordinates": [
                [
                  [
                    ${box.getSouthWest()['lng']},
                    ${box.getSouthWest()['lat']}
                  ],
                  [
                    ${box.getNorthEast()['lng']},
                    ${box.getNorthEast()['lat']}
                  ],
                  [
                    ${box.getNorthEast()['lng']},
                    ${box.getNorthEast()['lat']}
                  ],
                  [
                    ${box.getSouthEast()['lng']},
                    ${box.getSouthEast()['lat']}
                  ],
                  [
                    ${box.getSouthWest()['lng']},
                    ${box.getSouthWest()['lat']}
                  ]
                ]
              ],
              "type": "Polygon"
            }
          }
        ]
      }`
      console.log(tt);
        
    }
    const update = function () {
        const box = L.latLngBounds(markers.map(m => m.getLatLng()));
        rectangle.setBounds(box);

        const urls = [];
        makegeojsontxt(box)
        ;
        const latlngtext = set_latlonlist(box);
        //document.getElementById("count").innerHTML = urls.length;
        document.getElementById("urls").textContent = latlngtext;
    };
    
    const rectangle = L.rectangle(bounds, {
        color: "#666666",
        weight: 1
    }).addTo(map);

    const markers = [
        bounds.getNorthWest(),
        bounds.getSouthEast()
    ].map(p => L.marker(p, {
        draggable: true
    }).on("move", function () {
        rectangle.setBounds(L.latLngBounds(markers.map(m => m.getLatLng())));
    }).on("dragend", update).addTo(map));    


    update();


}
