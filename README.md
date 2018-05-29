[![Build Status](https://travis-ci.org/ydeshayes/googlePlaceAutocomplete.svg?branch=master)](https://travis-ci.org/ydeshayes/googlePlaceAutocomplete)
# material-ui-places component for ReactJS

Wrapper on top of the material-ui AutoComplete component that use google place api

## Installation

Add this script to your html page:
```html
<head>
  <script src="https://maps.googleapis.com/maps/api/js?libraries=places"></script>
</head>
```

Material-ui is required:

```
  npm install material-ui
```

```
  npm install material-ui-places
```

## Features

* AutoComplete that auto-load google places

## Getting started


```jsx
<GoogleAddress
  placeholder="Address"
  value={this.state.value}
  onChange={this.handleChange}
  onSuggestionSelected={this.addAddress}
  types={['address']}
  location={{lat: '35.9981298', lng: '-83.9541637'}}
/>
```
### Props:

* onChange: a function to run when the input value is changed (aside from the regular fetching suggestions)

* value: You can use this if you want to set the input value yourself, combined with on change. You can use this for example if you want to clear the input after the users picks a selection (see example below)


* location: This will tell google where to bias the location results, to return more likely places {lat: latitude, lng: longitude}, default: ```{lat: 0, lng: 0}``` see [LatLng](https://developers.google.com/maps/documentation/javascript/reference?hl=fr#LatLng)

* radius: number, default: ```0```

* bounds: object, ```{sw: southWest, ne: northEast}``` for [LatLngBounds](https://developers.google.com/maps/documentation/javascript/reference?hl=fr#LatLngBounds) or ```{south: south, east: east, north: north, west: west}``` for [LatLngBoundsLiteral](https://developers.google.com/maps/documentation/javascript/reference?hl=fr#LatLngBoundsLiteral)  default: ```undefined```

* getRef: function -> (ref)

* types: Array, ```
The types of predictions to be returned. Four types are supported: 'establishment' for businesses, 'geocode' for addresses, '(regions)' for administrative regions and '(cities)' for localities. If nothing is specified, all types are returned.```, default ```undefined```

* restrictions: ```country:  Array|String```, ```{ country: [ 'fr', 'gb'] | 'gb' }```
Restricts predictions to the specified country (ISO 3166-1 Alpha-2 country code, case insensitive). E.g., us, br, au. You can provide a single one, or an array of up to 5 country code strings. See [ComponentRestrictions](https://developers.google.com/maps/documentation/javascript/reference#ComponentRestrictions)

### Example
```js
import { Button } from '@material-ui/core';
import React from 'react';

import { GoogleAddress } from '../components/google-address';

export class UserAccount extends React.Component {
  addAddress = description => {
    fetch('/add-address', {
      headers: {
        ['Content-Type']: 'text/plain'
      },
      credentials: 'same-origin',
      method: 'POST',
      body: description,
    })
    this.setState({
      value: ''
    })
  }
  handleChange = e => {
    this.setState({
      value: e.target.value
    })
  }
  state = {
    value: ''
  }
  render() {
    return <div>
      <h1>Account Info</h1>
      <GoogleAddress
        placeholder="Address"
        value={this.state.value}
        onChange={this.handleChange}
        onSuggestionSelected={this.addAddress}
        types={['address']}
        location={{lat: '35.9981298', lng: '-83.9541637'}}
      />
      <Button onClick={this.verify_address}>Add Address</Button>
    </div>
  }
}
```


## Development

* `npm run build` - produces production version
* `npm run dev` - produces development version
* `npm test` - run the tests
