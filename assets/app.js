const API_KEY = '8a22d1422a54e506e8d24576ca19a497'

let historyArray = []

// test request
axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${API_KEY}`)
  .then(res => {
    let irvine = res.data
    console.log(irvine.current.uvi)
  })
  .catch(err => console.error(err))

axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=manila&units=imperial&appid=${API_KEY}`)
  .then(res => {
    let irvine = res.data
    console.log(irvine)
  })
  .catch(err => console.error(err))

// reset UI
const resetUI = _ =>{
  document.getElementById('currentData').innerHTML = ''
  document.getElementById('forecastCard').innerHTML = ''
}
// render forecast
const renderForecast = (city) => {
  for (let i = 0; i < 5; i++) {
    let card = document.createElement('div')
    card.innerHTML = `
    <div class="card" style="width: 10rem;">
      <div class="card-body bg-primary text-light">
        <h5 class="card-title">${city.list[i * 8].dt_txt.substring(0, 10)}</h5>
        <h6 class="card-subtitle mb-2">${city.list[0].weather[0].main}</h6>
        <p class="card-text">Temp: ${city.list[i * 8].main.temp}° F</p>
        <p class="card-text">Temp: ${city.list[i * 8].main.humidity}° F</p>
      </div>
    </div>
    `
    document.getElementById('forecastCard').append(card)
  }
}
// render Data (send this function "res.data")
const renderData = (city) =>{
  resetUI()
  // create object to hold data
  let cityData = document.createElement('div')
  console.log(city.list[0].dt_txt)
  cityData.innerHTML = `
      <h2>${city.city.name} (${city.list[0].dt_txt.substring(0, 10)}) ${city.list[0].weather[0].main}</h2>
      <h6>Temperature: ${city.list[0].main.temp}° F</h6>
      <h6>Humidity: ${city.list[0].main.humidity}%</h6>
      <h6>Wind Speed: ${city.list[0].wind.speed} MPH</h6>
      `
  // implement UV index
  axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.city.coord.lat}&lon=${city.city.coord.lon}&exclude=hourly,daily&appid=${API_KEY}`)
    .then(resp => {
      let uvgetter = resp.data
      let uvData = document.createElement('h6')

      if (uvgetter.current.uvi > 9) {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-danger">${uvgetter.current.uvi}</button>
        `
      } else if (uvgetter.current.uvi > 5) {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-warning">${uvgetter.current.uvi}</button>
        `
      } else {
        uvData.innerHTML = `
          UV Index: <button type="button" class="btn btn-primary">${uvgetter.current.uvi}</button>
        `
      }
      cityData.append(uvData)
    })
    .catch(err => console.error(err))
    // end uv index

  document.getElementById('currentData').append(cityData)

  renderForecast(city)
}
// render history
const renderHistory = (city) =>{
  let historyItem = document.createElement('li')
  historyItem.classList.add("list-group-item")
  historyItem.innerHTML = `
  <div class="cityDat" data-text="${city.city.name}">
    ${city.city.name}
  </div>
  `
  document.getElementById('history').prepend(historyItem)
}

// submit button listener
document.getElementById('submit').addEventListener('click', event =>{
  event.preventDefault()
  // axios request
  axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${document.getElementById('searchCity').value}&units=imperial&appid=${API_KEY}`)
    .then(res => {
      let city = res.data

      historyArray.unshift(
        {
          name: `${city.city.name}`,
          results: city
        }
      )
      renderData(city)
      // append to history list
      renderHistory(city)
      document.getElementById('searchCity').value = ''
    })
    .catch(err => console.error(err))
})

// list item listener
document.addEventListener('click', event =>{
  event.preventDefault()
  if(event.target.classList.contains('cityDat')) {
    // filter array to just results that match the city in history
    const result = historyArray.filter(city => city.name === event.target.dataset.text)
    renderData(result[0].results)
  }
})

//navBar dashboard listener
document.addEventListener('click', event =>{
  event.preventDefault()
  if(event.target.classList.contains('weather-dash')) {
    renderData(historyArray[0].results)
  }
})