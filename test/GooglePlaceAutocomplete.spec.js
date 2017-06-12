/* global expect*/

import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AutocompleteService from './MockAutoCompleteService';
import GooglePlaceAutocomplete from '../src';

describe('<GooglePlaceAutocomplete />', () => {
  before(function () {
    global.google = {
      maps: {
        LatLng: function (lat, lng) {
          return {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),

            lat: function () { return this.latitude; },
            lng: function () { return this.longitude; }
          };
        },
        LatLngBounds: function (ne, sw) {
          return {
            getSouthWest: function () { return sw; },
            getNorthEast: function () { return ne; }
          };
        },
        places: {
          AutocompleteService
        }
      }
    };
  });

  it('Render GooglePlaceAutocomplete', () => {

    const onNewRequest = sinon.spy();

    const onChange = sinon.spy();

    let wrapper = shallow(<GooglePlaceAutocomplete
                            onNewRequest={onNewRequest}
                            onChange={onChange}
                            name={'location'}
                          />);
  });

  it('Accepts country restrictions', () => {
    sinon.spy(AutocompleteService.prototype, 'getPlacePredictions');
    const onNewRequest = sinon.spy();

    const onChange = sinon.spy();

    let wrapper = shallow(<GooglePlaceAutocomplete
                            onNewRequest={onNewRequest}
                            onChange={onChange}
                            searchText=""
                            restrictions={['France']}
                            name={'location'}
                          />);

    wrapper.setProps({ searchText: 'test' });

    expect(AutocompleteService.prototype.getPlacePredictions.calledOnce).to.be.true;
    expect(AutocompleteService.prototype.getPlacePredictions.args[0][0]).to.have.property('componentRestrictions');

    AutocompleteService.prototype.getPlacePredictions.restore();
  });
});
