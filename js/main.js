'use strict'

// DONE: Render the cinema (7x15 with middle path)
// DONE: implement the Seat selection flow
// DONE: Popup shows the seat identier - e.g.: 3-5 or 7-15
// DONE: Popup should contain seat price (for now 4$ to all) 
// DONE: allow booking the seat ('S', 'X', 'B')
// DONE: Uplift your model - each seat should have its own price... 
// DONE: in seat details, show available seats around 
// DONE: Upload to GitHub Pages

var gCinema
var gElSelectedSeat = null

function onInit() {
    gCinema = createCinema()
    renderCinema()
}

function createCinema() {
    const cinema = []
    for (var i = 0; i < 7; i++) {
        cinema[i] = []
        for (var j = 0; j < 15; j++) {
            const cell = {
                isSeat: (j !== 3 && j !== 11 & i !== 3)
            }
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }

            cinema[i][j] = cell
        }
    }

    cinema[4][4].isBooked = true
    cinema[4][5].isBooked = true
    cinema[2][7].isBooked = true
    cinema[2][8].isBooked = true
    cinema[5][12].isBooked = true
    cinema[5][13].isBooked = true
    cinema[5][14].isBooked = true
    cinema[1][1].isBooked = true
    cinema[1][2].isBooked = true
    return cinema
}

function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            // For cell of type SEAT add seat class:
            var className = (cell.isSeat) ? 'seat' : ''
            if (cell.isBooked) {
                className += ' booked'
            }
            // Add a seat title:
            const title = `Seat: ${i + 1}, ${j + 1}`

            // TODO: for cell that is booked add booked class

            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]
    // ignore none seats and booked
    if (!cell.isSeat || cell.isBooked) return

    console.log('Cell clicked: ', elCell, i, j)

    // Support selecting a seat
    elCell.classList.add('selected')

    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }

    // Only a single seat should be selected
    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        showSeatDetails({ i, j })
    } else {
        hideSeatDetails()
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]
    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    const elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn)
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

    gCinema[i][j].isBooked = true
    renderCinema()

    hideSeatDetails()
}



function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count
}

function highlightAvailableSeatsAround(board, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) {

                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.classList.add('highlight')
                setTimeout(() => {
                    elCell.classList.remove('highlight')
                    renderCinema()
                }, 3000)
            }
        }
    }
}

function highlightSeats() {
    const i = +gElSelectedSeat.dataset.i
    const j = +gElSelectedSeat.dataset.j
    highlightAvailableSeatsAround(gCinema, i, j)
    setTimeout(hideSeatDetails, 3000)
}

