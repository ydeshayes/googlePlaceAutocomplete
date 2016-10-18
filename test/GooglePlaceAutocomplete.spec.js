/* global expect*/

import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import GooglePlaceAutocomplete from '../src';

describe('<GooglePlaceAutocomplete />', () => {

  it('Render GooglePlaceAutocomplete', () => {

    const onNewRequest = sinon.spy();

    const onChange = sinon.spy();

    let wrapper = shallow(<GooglePlaceAutocomplete
                          onNewRequest={onNewRequest}
                          onChange={onChange}
                          name={'location'}
                        />);
  });

});
