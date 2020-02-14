import React from 'react'

const link = 'https://www.google.com/maps/place/EQ+Works/@43.670887,-79.3918677,17z/data=!4m6!3m5!1s0x882b34afa0cbf83b:0x156240b075d4225b!4b1!8m2!3d43.670887!4d-79.389679';

const GeoNav = () => {
  return (
    <div className="center">
      <h3>Unfortunately I couldn't finish this feature</h3>
      <p>Due to the complexity of the assignment I was not able to get to the geo visualization feature. However, I would've done it with <a className="click-me" href={link}>this approach</a>. All jokes aside I would've enjoyed trying to find an unique solutin to display the POI's (points of interest) with a google maps API. I also would've combined the logic of the table with the geo visualization feature so users could search for specific POIs and the map would render the specific results. </p>
    </div>
  )
}

export default GeoNav
