/* global google*/

import React, { Component } from 'react';
import { AutoComplete } from 'material-ui';

class GooglePlaceAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.state = {
      dataSource: [],
      data: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.searchText !== nextProps.searchText) {
      this.onUpdateInput(nextProps.searchText, this.state.dataSource);
      this.onInputChange(nextProps.searchText);
    }
  }

  updateDatasource(data) {
    if(!data || !data.length) {
      return false;
    }

    if(this.state.data) {
      this.previousData = { ...this.state.data };
    }
    this.setState({
      dataSource: data.map(place => place.description),
      data
    });
  }

  getBounds() {
    if(!this.props.bounds || (!this.props.bounds.ne && !this.props.bounds.south)) {
      return undefined;
    }

    if(this.props.bounds.ne && this.props.bounds.sw) {
      return new google.maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
    }

    return {
      ...this.props.bounds
    };
  }

  onUpdateInput(searchText, dataSource) {
    if (!searchText.length || !this.autocompleteService) {
      return false;
    }

    let request = {
      input: searchText,
      location: new google.maps.LatLng(this.props.location.lat, this.props.location.lng),
      radius: this.props.radius,
      types: this.props.types,
      bounds: this.getBounds()
    };

    this.autocompleteService.getPlacePredictions(request, data => this.updateDatasource(data));
  }

  onNewRequest(searchText, index) {
    // The index in dataSource of the list item selected, or -1 if enter is pressed in the TextField
    if(index === -1) {
      return false;
    }
    const data = this.previousData || this.state.data;

    this.props.onNewRequest(data[index], searchText, index);
  }

  onInputChange(searchText, dataSource, params) {
    this.props.onChange({target: {value: searchText}}, dataSource, params);
  }

  render() {
    const {location, radius, bounds, types, ...autoCompleteProps} = this.props; // eslint-disable-line no-unused-vars

    return (
      <AutoComplete
        openOnFocus={true}
        {...autoCompleteProps}
        ref={this.props.getRef}
        filter={this.props.filter}
        onUpdateInput={this.onInputChange.bind(this)}
        dataSource={this.state.dataSource}
        onNewRequest={this.onNewRequest.bind(this)}
      />
    );
  }
}

GooglePlaceAutocomplete.propTypes = {
  location: React.PropTypes.object,
  radius: React.PropTypes.number,
  onNewRequest: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  getRef: React.PropTypes.func,
  types: React.PropTypes.arrayOf(React.PropTypes.string),
  bounds: React.PropTypes.object
};

GooglePlaceAutocomplete.defaultProps = {
  location: {lat: 0, lng: 0},
  radius: 0,
  filter: AutoComplete.noFilter
};

export default GooglePlaceAutocomplete;
