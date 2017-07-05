import React from 'react'

import { DragNDropContainer, DragNDropItem } from '../../react-dnd-ax'
import { countries } from '../data'
import Country from './Country'

import '../styles/common.scss'
import './ComplexExample.scss'

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
    const ModuleItem = DragNDropItem(Country)

    const CountryList = DragNDropContainer((props) => {
      return (
        <div>
          {
            props.items.map((country, index) => {
              return <ModuleItem
                country={country}
                index={index} // mandatory: index is required by react-dnd-ax
                key={country.name} // provide the key for react
                preview={<span>{country.name}</span>} // you can define your own preview element here
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
