import React from 'react'
import { GoogleMap, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';
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
  const [zoom,setZoom] = useState(9);
  const [id,setId] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_MAP_API}`,
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
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
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      }
    }
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
              }}
              onClick={()=>{
                setCenter({
                  lat: item?.place?.location?.latitude,
                  lng: item?.place?.location?.longitude,
                });
                setZoom(15);
                setId(item.id);
              }}
              />
              {id === item.id ? ( <InfoWindowF 
                position={{
                  lat:item?.place?.location?.latitude,
                  lng:item?.place?.location?.longitude,
                }}
                onCloseClick={()=>{
                  setId(null);
                  setZoom(11);
                }}
              > 
                <div>
                  <h3>{item?.place?.name}</h3>
                  <img src={item?.full_picture} alt="img" width={200}/>
                  <p>{item?.message}</p>
                  <a
                    href={item?.permalink_url}
                    target='_blank'
                    rel='nonreferrer'
                  >
                    게시물 보러가기
                  </a>
                </div>
              </InfoWindowF>
              ): null}
            </>
          );
        })}
      </GoogleMap>
  ) : <></>
}

export default React.memo(Map)