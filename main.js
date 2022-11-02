const cards = document.querySelector('[data-js="cards"]')
const userDates = document.querySelector('[data-js="user-dates"]')
const options = document.querySelectorAll('[data-js="options"]')

let externalData = []
const times = {
  'daily': 'Yesterday',
  'weekly': 'Last Week',
  'monthly': 'Last Month'
}

const init = async () => {
  externalData = [... await fetchData()]
}

const fetchData = async () => {
  try {
    const request = await fetch('./data.json')
    const data = await request.json()
    return data
  } catch (error) {
    cards.setAttribute('class', 'error')
    cards.innerHTML = `
      <div>Can't get data</div>
    `
    throw new Error(error)
  }

}

const updateTimeFrame = (currentData, state) => {
  const title = currentData.title.split(' ').join('-').toLowerCase()
  const dataFrames = document.querySelector(`[data-frames="${title}"]`)
  
  const cardInfo = currentData.timeframes[state]
  const currentPlural = cardInfo.current == 1 ? '' : 's'
  const previousPlural = cardInfo.previous == 1 ? '' : 's'

  dataFrames.innerHTML = `
    <span class="card__info-hours">${cardInfo.current}hr${currentPlural}</span>
    <span class="card__info-previous-hours">${times[state]} - ${cardInfo.previous}hr${previousPlural}</span>
  `
}

const updateTimeFrames = state => 
  externalData.forEach(currentData => updateTimeFrame(currentData, state))

const removeSelectedClass = () =>
  Array.from(userDates.children).forEach(userDate => 
    userDate.classList.remove('selected')
  )

const updateCards = e => {
  const isAValidValue = 
    (e.target.dataset.js == e.target.textContent.toLowerCase()) && 
    !Array.from(e.target.classList).includes('selected')
  if(!isAValidValue) return

  removeSelectedClass()
  e.target.classList = 'selected'
  
  updateTimeFrames(e.target.textContent.toLowerCase())
}

const addOptionHoverClassToTheCard = e => {
  e.target.parentElement.parentElement.classList.add('options-hover')
}

const removeOptionHoverClassToTheCard = e => {
  e.target.parentElement.parentElement.classList.remove('options-hover')
}

const changeCardBackgroundColor = option => {
  option.addEventListener('mouseenter', addOptionHoverClassToTheCard) 
  option.addEventListener('mouseleave', removeOptionHoverClassToTheCard)
}

userDates.addEventListener('click', updateCards)
options.forEach(changeCardBackgroundColor)

init()
