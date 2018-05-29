/* global google*/
import { MenuItem, Paper, TextField, withStyles } from '@material-ui/core';
import Autosuggest from 'react-autosuggest';
import React from 'react';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import PropTypes from 'prop-types';

function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps;

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.description, query);
  const parts = parse(suggestion.description, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.description;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    height: 200
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0
  },
  suggestion: {
    display: 'block'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  textField: {
    width: '100%'
  }
});

@withStyles(styles)
export class GooglePlaceAutocomplete extends React.Component {

  constructor(props) {
    super(props);
    if (typeof window === 'undefined') {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    } else {
      this.autocompleteService = {};
    }
    this.state = {
      value: props.selectedValue ? props.selectedValue : '',
      suggestions: []
    };
  }

  updateDataSource = (data) => {
    if (!data || !data.length) {
      return false;
    }

    if (this.state.suggestions) {
      this.previousData = { ...this.state.suggestions };
    }
    this.setState({
      suggestions: data
    });
  };

  getBounds = () => {
    if (!this.props.bounds || (!this.props.bounds.ne && !this.props.bounds.south)) {
      return undefined;
    }

    if (this.props.bounds.ne && this.props.bounds.sw) {
      return new google.maps.LatLngBounds(this.props.bounds.sw, this.props.bounds.ne);
    }

    return {
      ...this.props.bounds
    };
  };

  getSuggestions = (searchText) => {
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

    if (this.props.restrictions) {
      request.componentRestrictions = { ...this.props.restrictions };
    }

    this.autocompleteService.getPlacePredictions(request, data => this.updateDataSource(data));
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.getSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  handleSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log(suggestionValue);
    this.props.onSuggestionSelected(suggestion, suggestionValue);
  }

  render() {
    const { classes, placeholder } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={this.handleSuggestionSelected}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder: placeholder,
          value: this.state.value,
          onChange: this.handleChange
        }}
      />
    );
  }
}

GooglePlaceAutocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  selectedValue: PropTypes.string,
  onSuggestionSelected: PropTypes.func,
  // Google maps parameters,
  location: PropTypes.object,
  radius: PropTypes.number,
  restrictions: PropTypes.shape({
    country: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  })
};

GooglePlaceAutocomplete.defaultProps = {
  location: {lat: 0, lng: 0},
  radius: 0
};
