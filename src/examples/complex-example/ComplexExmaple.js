import React from 'react'

import { DragNDropContainer, DragNDropItem } from '../../react-dnd-ax'
import { countries } from '../data'
import Country from './Country'
// import './ComplexExample.scss'

class ComplexExample extends React.Component {
  state = {
    countries: countries,
  }

  onReorderCountries = (newOrderCountries) => {
    this.setState({
      countries: [...newOrderCountries]
    })
  }

  render() {
    console.log(this.state.countries);
    const ModuleItem = DragNDropItem(Country)

    const CountryList = DragNDropContainer((props) => {
      console.log(props.countries);
      return (
        <div>
          {
            props.items.map((country, index) => {
              return <ModuleItem
                country={country}
                module={country}
                index={index}
                key={country.name}
                preview={<span>{country.name}</span>}
                {...props}
              />
            })
          }
        </div>
      )
    })

    return (
      <div className="container">
        <CountryList
          items={this.state.countries}
          onReorderItem={this.onReorderCountries}
        />
      </div>
    )
  }
}

export default ComplexExample
