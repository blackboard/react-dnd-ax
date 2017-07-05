export const basicItems = Array.from(Array(100).keys()).map((num) => {
  return {
    id: num,
    text: `Row ${num}`
  }
})

export const countries = [
  {
    name: 'China',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853564-c1827d2c-6195-11e7-906f-65dd50b5c978.jpeg',
    abbr: 'cn',
    cities: [
      {
        name: 'Beijing 北京',
        url_suffix: 'Beijing',
      },
      {
        name: 'Shanghai 上海',
        url_suffix: 'Shanghai',
      },
      {
        name: 'Baoding 保定',
        url_suffix: 'Baoding',
      },
      {
        name: 'Nanchang 南昌',
        url_suffix: '南昌',
      },
    ]
  },
  {
    name: 'United States',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853668-31ce28b0-6196-11e7-9c39-1b6f3f04f854.jpeg',
    abbr: 'us',
    cities: [
      {
        name: 'Washington, D.C.',
        url_suffix: 'Washington,_D.C.',
      },
      {
        name: 'Austin',
        url_suffix: 'Austin,_Texas',
      },
      {
        name: 'New York',
        url_suffix: 'New_York',
      },
      {
        name: 'Seattle',
        url_suffix: 'Seattle',
      },
    ]
  },
  {
    name: 'Germany',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853566-c18461c8-6195-11e7-8f0e-5de089837110.jpeg',
    abbr: 'de',
    cities: [
      {
        name: 'Berlin',
        url_suffix: 'Berlin',
      },
      {
        name: 'Dresden',
        url_suffix: 'Dresden',
      },
      {
        name: 'Munich',
        url_suffix: 'Munich',
      },
      {
        name: 'Frankfurt',
        url_suffix: 'Frankfurt',
      },
    ]
  },
  {
    name: 'United Kingdom',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853568-c184e40e-6195-11e7-8556-4895e6f541c3.jpeg',
    abbr: 'uk',
    cities: [
      {
        name: 'London',
        url_suffix: 'London',
      },
      {
        name: 'Southampton',
        url_suffix: 'Southampton',
      },
      {
        name: 'Manchester',
        url_suffix: 'Manchester',
      },
      {
        name: 'Swansea',
        url_suffix: 'Swansea',
      },
    ]
  },
  {
    name: 'New Zealand',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853569-c1864fba-6195-11e7-837f-bdf8facb3dbe.jpeg',
    abbr: 'nz',
    cities: [
      {
        name: 'Wellington',
        url_suffix: 'Wellington',
      },
      {
        name: 'Auckland',
        url_suffix: 'Auckland',
      },
      {
        name: 'Queenstown',
        url_suffix: 'Queenstown,_New_Zealand',
      },
      {
        name: 'Dunedin',
        url_suffix: 'Dunedin',
      },
    ]
  },
  {
    name: 'Switzerland',
    bgImg: 'https://user-images.githubusercontent.com/7331987/27853565-c183d028-6195-11e7-8c23-b13eed47a9fe.jpeg',
    abbr: 'ch',
    cities: [
      {
        name: 'Zürich',
        url_suffix: 'Zürich',
      },
      {
        name: 'Lucerne',
        url_suffix: 'Lucerne',
      },
      {
        name: 'Interlaken',
        url_suffix: 'Interlaken',
      },
      {
        name: 'Geneva',
        url_suffix: 'Geneva',
      },
    ]
  },
]
