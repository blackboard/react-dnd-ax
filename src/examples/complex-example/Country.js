import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'

class Country extends React.Component {

  render() {
    const { country, dragPointRef } = this.props
    const linksArr = country.cities
      .map((city) => {
        const linkObj = {
          link: `https://en.wikipedia.org/wiki/${city.url_suffix}`,
          title: city.name,
        }
        return linkObj
      })
    return (
      <div className="country-row">
        <div className="title-bar">
          <span className="country-name">{country.name}</span>
          <div
            role="button"
            ref={dragPointRef}
            className="drag-point"
            draggable
            tabIndex="0"
            title="Move country"
          >
            <Icon name="arrows"/>
          </div>
        </div>
        <div className="content-section">
          <div className="country-preview" style={{backgroundImage: `url(${country.bgImg})`}}  />
          <ul className="city-list">
            {
              linksArr.map((city, index) => {
                return (
                  <li className="link-item" key={index}>
                    <a href={city.link} className="link" target="_blank" rel="noopener noreferrer" alt={city.title}>{city.title}</a>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

Country.propTypes = {
  dragPointRef: PropTypes.func,
  index: PropTypes.number.isRequired,
}

export default Country
