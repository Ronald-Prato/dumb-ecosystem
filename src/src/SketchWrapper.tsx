import Sketch from 'react-p5'
import { CANVAS_H, CANVAS_W } from './constants'
import p5Types from 'p5'
import {
  generateEntities,
  getSurroundingGuys,
  randomMovement,
} from './utils/life'
import { Guy } from '../global.types'

let guys: Guy[] = []

export const MainSketch = () => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(CANVAS_H, CANVAS_W).parent(canvasParentRef)
    p5.frameRate(10)
    guys = generateEntities(3)
  }

  const draw = (p5: p5Types) => {
    p5.background('#ded4b8')

    // Creation of guys
    for (let i = 0; i < guys.length; i++) {
      const guy = guys[i]
      p5.rect(guy.x, guy.y, guy.w, guy.h)
      p5.fill(guy.theGuy ? 'steelblue' : 'tomato')
    }

    // Movement of guys
    for (let i = 0; i < guys.length; i++) {
      randomMovement(guys[i])

      // Close interaction
      getSurroundingGuys(guys, guys[i])
    }
  }

  return <Sketch setup={setup} draw={draw} />
}
