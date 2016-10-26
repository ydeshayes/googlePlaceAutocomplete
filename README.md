# GooglePlaceAutocomplete component for ReactJS

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
  npm install googlePlaceAutocomplete
```

## Features

* AutoComplete that auto-load google places

## Getting started


```jsx
<GooglePlaceAutocomplete searchText={'paris'}
                         onChange={onAutoCompleteInputChangeFct}
                         onNewRequest={onClickLocationFct}
                         name={'location'}
/>
```
### Props:

* Same as AutoComplete material-ui component (http://www.material-ui.com/#/components/auto-complete)

* onNewRequest: function -> (selectedData, searchedText, selectedDataIndex)


## Development

* `npm run build` - produces production version
* `npm run dev` - produces development version
* `npm test` - run the tests
