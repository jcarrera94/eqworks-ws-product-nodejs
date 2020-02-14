import React, { Component } from 'react';
import Fuse from 'fuse.js';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activeMap: {}
    }
  }

  componentDidMount() {
    this.initTableData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.initTableData(nextProps);
  }

  initTableData = (props) => {
    const { state: { poi } } = props;
    this.setState({ data: poi });
  }

  handleChange = (e) => {
    const { fuzzySearchOptions } = Table.constants;
    const { data } = this.state;
    const { target: { value } } = e;

    const fuse = new Fuse(data, fuzzySearchOptions);
    let results = fuse.search(value);
    let map = {};

    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        map[item.poi_id] = true;
      }
    }
    this.setState({ activeMap: map });
  }

  render() {
    const { data, activeMap } = this.state;
    return (
      <div className="table">
        <div className="search-field">
          <input placeholder="Search..." onChange={this.handleChange} />
        </div>
        <table>
          <thead>
            <tr className="table-header">
              <th>Location Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {data.map(obj => {
              return (
                <tr key={obj.poi_id} className={activeMap[obj.poi_id] ? 'active-row' : 'in-active'}>
                  <td>{obj.name}</td>
                  <td>{obj.lat}</td>
                  <td>{obj.lon}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;

Table.constants = {
  fuzzySearchOptions: {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 150,
    minMatchCharLength: 1,
    keys: ['name', 'lat', 'lon']
  }
};