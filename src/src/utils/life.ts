import { Directions, Guy } from '../../global.types'
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
      theGuy: i === amount - 1,
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

export const getSurroundingGuys = (guys: Guy[], currentGuy: Guy): boolean => {
  let areClose = false
  const areaAroundCurrentGuy: string[] = []

  const whitoutCurrentGuy = guys.filter((guy) => guy.id !== currentGuy.id)
  const allGuysParsedLocations = whitoutCurrentGuy.map(
    (guy) => `${guy.x},${guy.y}`
  )

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

  let guysAround = 0

  areaAroundCurrentGuy.forEach((guyPosibleLocation) => {
    if (allGuysParsedLocations.includes(guyPosibleLocation)) {
      const thisMuch = allGuysParsedLocations.filter((normalGuyLocation) =>
        areaAroundCurrentGuy.includes(normalGuyLocation)
      ).length

      guysAround = thisMuch
    }
  })

  areClose = guysAround > 0

  return areClose
}
