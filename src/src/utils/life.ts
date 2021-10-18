import { Directions, Guy, IdLocation } from '../../global.types'
import { CANVAS_H, CANVAS_W, STEP_SIZE, SUBJECT_SIZE } from '../constants'
import { v4 as uuidv4 } from 'uuid'

let prevDirection: Directions | null = null

const getRandomPositionInMatrix = (
  min: number,
  max: number,
  multiple: number
) => {
  const res =
    Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min
  return res
}

export const generateEntities = (amount: number): Guy[] => {
  const guys = []

  for (let i = 0; i < amount; i++) {
    const newGuy: Guy = {
      id: uuidv4(),
      x: getRandomPositionInMatrix(STEP_SIZE, CANVAS_W, STEP_SIZE),
      y: getRandomPositionInMatrix(STEP_SIZE, CANVAS_W, STEP_SIZE),
      w: SUBJECT_SIZE,
      h: SUBJECT_SIZE,
      theGuy: i === amount - 1, // Math.random() <= 0.5,
    }

    guys.push(newGuy)
  }

  return guys
}

export const getRandomNotRepeatedDirection = (): Directions => {
  const directions = [0, 1, 2, 3]
  const posibilities = directions.filter(
    (direction) => direction !== prevDirection
  )

  return posibilities[
    Math.floor(Math.random() * posibilities.length)
  ] as Directions
}

export const randomMovement = (guy: Guy) => {
  const direction = getRandomNotRepeatedDirection()
  prevDirection = direction

  switch (direction) {
    case 0: {
      if (guy.y - SUBJECT_SIZE > 0) guy.y -= SUBJECT_SIZE
      break
    } // Up
    case 1: {
      if (guy.x + SUBJECT_SIZE < CANVAS_W) guy.x += SUBJECT_SIZE
      break
    } // Right
    case 2: {
      if (guy.y + SUBJECT_SIZE < CANVAS_H) guy.y += SUBJECT_SIZE
      break
    } // Down
    case 3: {
      if (guy.x - SUBJECT_SIZE > 0) guy.x -= SUBJECT_SIZE
      break
    } // Left
  }
}

export const killGuy = (guys: Guy[], guyId: string) => {
  const withoutTheGuy = guys.filter((guy) => guy.id !== guyId)
  return withoutTheGuy
}

export const wolvesAndSheep = (guys: Guy[], currentGuy: Guy): Guy[] => {
  // let areClose = false
  let newGuys: Guy[] = guys
  let aloneCaughtGuy = ''

  const areaAroundCurrentGuy: string[] = []

  const whitoutCurrentGuy = guys.filter((guy) => guy.id !== currentGuy.id)
  const allGuysParsedLocations: IdLocation[] = whitoutCurrentGuy.map((guy) => ({
    id: guy.id,
    location: `${guy.x},${guy.y}`,
  }))

  const initialMatchPointX =
    currentGuy.x - STEP_SIZE <= CANVAS_W ? currentGuy.x - STEP_SIZE : 0
  const initialMatchPointY =
    currentGuy.y - STEP_SIZE <= CANVAS_H ? currentGuy.y - STEP_SIZE : 0

  const limitAreaPerIteration = STEP_SIZE * 3

  for (
    let y = initialMatchPointY;
    y < limitAreaPerIteration + initialMatchPointY;
    y += STEP_SIZE
  ) {
    for (
      let x = initialMatchPointX;
      x < limitAreaPerIteration + initialMatchPointX;
      x += STEP_SIZE
    ) {
      // if (x !== currentGuy.x && y !== currentGuy.y) {
      const currentGuyParsedLocation = `${x},${y}`
      areaAroundCurrentGuy.push(currentGuyParsedLocation)
      // }
    }
  }

  let guysAroundAmount = 0

  const justAllGuysLocations = allGuysParsedLocations.map((guy) => guy.location) // [20,40, 10,20, 40,60, 80,20]

  // areaAroundCurrentGuy.forEach((currentGuyPosibleLocation) => {
  //   if (justAllGuysLocations.includes(currentGuyPosibleLocation)) {
  //     const guysAround = allGuysParsedLocations.filter((guyLocation) =>
  //       areaAroundCurrentGuy.includes(guyLocation.location)
  //     )

  //     guysAroundAmount = guysAround.length
  //     if (guysAroundAmount === 1 && currentGuy.theGuy) {
  //       console.log('die!')
  //       //   // caugth alone
  //       //   aloneCaughtGuy = guysAround[0].id
  //     }
  //   }
  // })

  const guysAround = allGuysParsedLocations.filter((guyLocation) =>
    areaAroundCurrentGuy.includes(guyLocation.location)
  )

  guysAroundAmount = guysAround.length
  // if (guysAroundAmount === 1 && currentGuy.theGuy) {
  //   newGuys = killGuy(guys, guysAround[0].id)
  // }

  if (currentGuy.theGuy && guysAroundAmount >= 2) {
    newGuys = killGuy(guys, currentGuy.id)
    console.log('Died')
  }

  // if (currentGuy.theGuy && guysAroundAmount === 1) {
  //   newGuys = killGuy(guys, aloneCaughtGuy)
  // }

  return newGuys
}
