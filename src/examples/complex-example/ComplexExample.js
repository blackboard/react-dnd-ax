import React from 'react'

import { DragNDropContainer, DragNDropItem } from '../../react-dnd-ax'
import { countries } from '../data'
import Country from './Country'

import '../styles/common.css'
import './ComplexExample.css'

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
    const ModuleItem = DragNDropItem(Country) // Country is your existing component

    const CountryList = DragNDropContainer((props) => {
      return (
        <div>
          {
            props.items.map((country, index) => {
              return <ModuleItem
                country={country}
                index={index} // mandatory: give index to the DragNDropItem HOC
                key={country.name}
                preview={<span>{country.name}</span>} // customize your preview
                {...props} // mandatory: need to pass down the props
              />
            })
          }
        </div>
      )
    })

    return (
      <div id="complex-container" className="container">
        <CountryList
          items={this.state.countries}
          onReorderItem={this.onReorderCountries}
          scrollContainerId="complex-container"
        />
      </div>
    )
  }
}

export default ComplexExample
