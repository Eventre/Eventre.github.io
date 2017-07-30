import React, { Component } from 'react';
import Event from './event.jsx';
import { connect } from 'react-redux';
import { filter as ldFilter, map as ldMap } from 'lodash';

const filterEventByType = (type, events) => {
  return ldFilter(events, (event) => {
    return event.type === type;
  });
};

const filterEventByTitle = (string, events) => {
  return ldFilter(events, (event) => {
    return event.title.toLowerCase().indexOf(string.toLowerCase()) !== -1;
  });
};

//Grab events and loading info from store
//grab selected event as well to tell event
//component which one was last clickked
@connect((state) => {
  return {
    events: state.event.events,
    typeFilter: state.event.filter,
    searchFilter: state.event.searchString,
    selectedEvent: state.event.selectedEvent,
    loading: state.event.loading
  };
})

export default class EventContainer extends Component {
  render() {
    const { events, typeFilter, searchFilter, selectedEvent, loading } = this.props;

    let showEvents = events;

    //uses filters from store, checks if
    //it is not empty string, then filters
    //events by type, and then by name,
    //if it is empty, leave the events alone
    if (typeFilter) {
      showEvents = filterEventByType(typeFilter, showEvents);
    }

    if (searchFilter) {
      showEvents = filterEventByTitle(searchFilter, showEvents);
    }

    //check if events exists if it does,
    //map through each one and print it,
    //otherwise tell user we are loading
    return (
      <div className="event-container">
        {
          !loading
          ? <div>
            {
              ldMap(showEvents, (event) =>
                <Event
                  event={event}
                  key={event._id}
                  selected={selectedEvent ? selectedEvent._id : null}
                  handleClick={this._handleClick}
                />
              )
            }
            </div>
          : <div className="loader"></div>
        }
      </div>
    );
  }

  //function handles clicks by setting sidebar info
  _handleClick = (event) => {
    this.props.dispatch({type: 'SET_EVENT_INFO', data: event});
  }
}
