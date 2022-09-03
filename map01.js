let mainTable = document.querySelector('#colorsTable')
mainTable.addEventListener('click', getColor)
let theParent = document.querySelector('svg')
theParent.addEventListener('click', fillCountry, false)
let chosenColor = { color: '', default: '#D0D0D0' }

//----------------------------------------------------
//pick up a color by clicking

function getColor(e) {
  if (e.target.matches('span')) {
    chosenColor.color = e.target.dataset.color
    let colorsBoxes = document.querySelectorAll('.selectedColorBox')
    for (const colorsBoxe of colorsBoxes) {
      colorsBoxe.classList.remove('selectedColorBox')
    }
    e.target.classList.add('selectedColorBox')
    document.getElementById('currentColor').innerHTML = e.target.dataset.color
  }
}

//----------------------------------------------------
// fill a country(path) by clicking

function fillCountry(e) {
  if (e.target.matches('path')) {
    if (
      e.target.style.fill === chosenColor.color &&
      e.target.style.fill !== chosenColor.default
    ) {
      e.target.style.fill = chosenColor.default
    } else {
      e.target.style.fill = chosenColor.color
    }
  }
}

//----------------------------------------------------
//zoom with respect the mouse pointer postion

const container = document.querySelector('#divContainer')
const image = document.querySelector('#mapContainer')
const speed = 0.5
let size = {
  w: image.offsetWidth,
  h: image.offsetHeight,
}
let pos = { x: 0, y: 0 }
let target = { x: 0, y: 0 }
let pointer = { x: 0, y: 0 }
let scale = 1

window.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault()
    if (event.ctrlKey) {
      pointer.x = event.pageX - container.offsetLeft
      pointer.y = event.pageY - container.offsetTop
      target.x = (pointer.x - pos.x) / scale
      target.y = (pointer.y - pos.y) / scale

      scale += -1 * Math.max(-1, Math.min(1, event.deltaY)) * speed * scale

      //max_scale = 4
      const max_scale = 8
      const min_scale = 1
      scale = Math.max(min_scale, Math.min(max_scale, scale))

      pos.x = -target.x * scale + pointer.x
      pos.y = -target.y * scale + pointer.y

      if (pos.x > 0) pos.x = 0
      if (pos.x + size.w * scale < size.w) pos.x = -size.w * (scale - 1)
      if (pos.y > 0) pos.y = 0
      if (pos.y + size.h * scale < size.h) pos.y = -size.h * (scale - 1)

      image.style.transform = `translate(${pos.x}px,${pos.y}px) scale(${scale},${scale})`
    } else {
      pos.x -= event.deltaX * 2
      pos.y -= event.deltaY * 2
    }
  },
  { passive: false }
)

//----------------------------------------------------

window.addEventListener('mousemove', getMouseDirection, false)

let oldX = 0
let oldY = 0

function getMouseDirection(e) {
  if (e.altKey) {
    //deal with the horizontal case
    if (oldX < e.pageX) {
      pos.x = pos.x + 10
    } else {
      pos.x = pos.x - 10
    }

    //deal with the vertical case
    if (oldY < e.pageY) {
      pos.y = pos.y + 10
    } else {
      pos.y = pos.y - 10
    }

    oldX = e.pageX
    oldY = e.pageY

    image.style.transform = `translate(${pos.x}px,${pos.y}px) scale(${scale},${scale})`
  }
}
