import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { useQuery } from 'react-query';
import LoadingScreen from './LoadingScreen';
import { useState } from 'react';
import { MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

function Map() {
  const [center,setCenter] = useState({lat: 37.5665, lng: 126.9779});

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API}`,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    map.setZoom(9)
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  // get Facebook data

  const getFBData = async ()=>{
    const { data } = await axios.get(`${process.env.REACT_APP_FACEBOOK_API}`);
    return data;
  }

  const {isLoading, isError, data} = useQuery('FBData',getFBData,
  {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  
  if (isLoading){
    return <LoadingScreen/>;
  }

  if(isError){
    return <div>Error</div>
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {data.map((item) => {
          return (
            <>
              <MarkerF 
              key={item.id}
              position={{
                lat:item?.place?.location?.latitude,
                lng:item?.place?.location?.longitude,
              }}
              icon ={{
                url: "/images/garbage.png",
                scaledSize: new window.google.maps.Size(32,35),
              }}/>
            </>
          )
        })}
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)