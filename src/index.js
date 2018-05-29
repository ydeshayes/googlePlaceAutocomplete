import { withStyles } from '@material-ui/core';
import Downshift from 'downshift';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import TextField from '@material-ui/core/TextField';

import PropTypes from 'prop-types';

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 250,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

@withStyles(styles)
export class GoogleAddress extends React.Component {
  state = {
    suggestions: []
  }
  constructor(props) {
    super(props);
    if (typeof window !== 'undefined') {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    } else {

      this.autocompleteService = {};
    }
    this.state = {
      value: props.selectedValue ? props.selectedValue : '',
      suggestions: []
    };
  }
  getSuggestions = e => {
    if (!e.target.value.length || !this.autocompleteService) {
      return false;
    }

    let request = {
      input: e.target.value,
      location: new google.maps.LatLng(this.props.location.lat, this.props.location.lng),
      radius: this.props.radius,
      types: this.props.types,
      bounds: this.getBounds()
    };

    if (this.props.restrictions) {
      request.componentRestrictions = { ...this.props.restrictions };
    }

    this.autocompleteService.getPlacePredictions(request, resp => {
      this.setState({
        suggestions: (resp || []).map(place => ({label: place.description}))
      })
    });
  }
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
  }
  onSuggestionSelected(selection) {
    this.props.onSuggestionSelected(selection);
    if (this.props.clearOnSelected) {
      this.setState({

      })
    }
  }
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Downshift onChange={this.props.onSuggestionSelected}>
          {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                classes,
                InputProps: getInputProps({
                  placeholder: 'Enter Address',
                  value: this.props.value,
                  onChange: e => {
                    if (this.props.onChange) this.props.onChange(e)
                    this.getSuggestions(e)
                  },
                  id: 'integration-downshift-multiple',
                }),
              })}
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {this.state.suggestions.map((suggestion, index) =>
                    renderSuggestion({
                      suggestion,
                      index,
                      itemProps: getItemProps({ item: suggestion.label }),
                      highlightedIndex,
                      selectedItem,
                    }),
                  )}
                </Paper>
              ) : null}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

GoogleAddress.propTypes = {
  location: PropTypes.object,
  radius: PropTypes.number,
  onSuggestionSelected: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  getRef: PropTypes.func,
  types: PropTypes.arrayOf(PropTypes.string),
  bounds: PropTypes.object,
  clearOnSelection: PropTypes.bool,
  restrictions: PropTypes.shape({
    country: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string)
    ])
  })
};

GoogleAddress.defaultProps = {
  location: {lat: 0, lng: 0},
  radius: 0,
};
