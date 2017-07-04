import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'

class Country extends React.Component {

  render() {
    const { country } = this.props
    const imgObj = {
      url: `../img/${country.bgImg}`,
      title: country.name,
    }
    const linksArr = country.cities
      .map((city) => {
        const linkObj = {
          link: `https://en.wikipedia.org/wiki/${city.url_suffix}`,
          title: city.name,
        }
        return linkObj
      })
    return (
      <div className="featured-links-component">
        <div className="featured-links-component__content drag-drop-item__highlight-area">
          <div className="featured-links-component__header">
            <div className="featured-links-component__header-left">
              <h3 className="subheader featured-links-component__title">{module.title}</h3>
            </div>
            {
              <div className="featured-links-component__header-right">
                <button
                  ref={this.props.dragPointRef}
                  id={`${country.abbr}-drag-point`}
                  className="featured-links-component__button featured-links-component__drag-point"
                  draggable
                  tabIndex="0"
                  title="Move module"
                >
                  <Icon name="arrows"/>
                </button>
              </div>
            }
          </div>
          <div className="featured-links-component__container">
            <div className="module-overview-component" style={{backgroundImage: imgObj.url}}>
              <div className="module-overview-component__overlay">
                <h2 className="subheader module-overview-component__headline">{imgObj.title}</h2>
              </div>
            </div>
            <div className="link-list-component">
              <ul className="link-list-component__list">
                {
                  linksArr.map((city, index) => {
                    return (
                      <li className="link-list-component__list-item" key={index}>
                      <a href={city.link} className="link-list-component__link -black" target="_blank" alt={city.title}>{city.title}</a>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
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
