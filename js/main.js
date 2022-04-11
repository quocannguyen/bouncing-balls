// set up canvas
// give access to the drawing properties
const canvasTag = document.querySelector("canvas")
const canvasContext = canvasTag.getContext("2d")

// innerWidth and innerHeight refer to the viewport
const width = canvasTag.width = window.innerWidth
const height = canvasTag.height = window.innerHeight

function randomNumber(min, max) {
    const range = max - min
    return Math.random() * range + min
}

function randomInt(min, max) {
    return Math.floor(randomNumber(min, max))
}

function randomRGB() {
    return `rgb(${randomNumber(0, 255)}, ${randomNumber(0, 255)}, ${randomNumber(0, 255)})`
}

function randomHSLA() {
    return new HSLA(randomNumber(0, 360), 80, 60, 1)
}

function shiftedHSLA(hsla) {
    return new HSLA((hsla.hue + 3) % 360, 80, 60, 1)
}

function getVectorMagnitude(distanceX, distanceY) {
    return Math.sqrt(distanceX*distanceX + distanceY*distanceY)
}

class HSLA {
    constructor(hue, saturation, lightness, alpha) {
        this.hue = hue
        this.saturation = saturation
        this.lightness = lightness
        this.alpha = alpha
    }

    getHSLA() {
        return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`
    }

    fade() {
        // this.saturation *= 0.5
        this.alpha *= 0.5
    }
}

class Ball {
    constructor(x, y, velocityX, velocityY, color, radius) {
        this.x = x
        this.y = y
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.color = color
        this.radius = radius
        this.bounced = false
    }

    draw() {
        canvasContext.beginPath() // start drawing shape
        canvasContext.fillStyle = this.color.getHSLA()
        canvasContext.arc(this.x, this.y, this.radius, 0, 2*Math.PI)
        canvasContext.fill()
    }

    update() {
        if (!this.bounced) {
            if ((this.x + this.radius) >= width || (this.x - this.radius) <= 0) { // right or left
                const temporary = this.velocityX
                this.velocityX = -this.velocityY
                this.velocityY = temporary
                if (temporary * this.velocityX > 0) {
                    this.velocityX = -this.velocityX
                    this.velocityY = -this.velocityY
                }
                this.color.fade()
                this.bounced = true
            }
            if ((this.y + this.radius) >= height || (this.y - this.radius) <= 0) { // down or up
                const temporary = this.velocityX
                this.velocityX = this.velocityY
                this.velocityY = -temporary
                if (temporary * this.velocityX < 0) {
                    this.velocityX = -this.velocityX
                    this.velocityY = -this.velocityY
                }
                this.color.fade()
                this.bounced = true
            }
        }

        if ((this.x + this.radius) < width && 
            (this.x - this.radius) > 0 &&
            (this.y + this.radius) < height && 
            (this.y - this.radius) > 0) { 
            this.bounced = false
        }

        this.x += this.velocityX
        this.y += this.velocityY
    }

    detectCollision() {
        for (const ball of balls) {
            if (!(this === ball)) {
                const dx = this.x - ball.x
                const dy = this.y - ball.y
                const distance = getVectorMagnitude(dx, dy)
                if (distance < this.radius + ball.radius) {
                    this.color = shiftedHSLA(this.color)
                    ball.color = shiftedHSLA(ball.color)
                }
            }
        }
    }
}

const balls = []
for (let i = 0; i < 50; i++) {
    const radius = randomNumber(10, 20)
    const ball = new Ball(
        randomNumber(0 + radius, width - radius),
        randomNumber(0 + radius, height - radius),
        randomNumber(1, 5),
        randomNumber(1, 5),
        randomHSLA(),
        radius
    )
    balls.push(ball)
}

function loop() {
    canvasContext.fillStyle = 'rgba(0, 0, 0, 0.05)'
    canvasContext.fillRect(0, 0, width, height)
    for (const ball of balls) {
        ball.draw()
        ball.update()
        ball.detectCollision()
    }
    requestAnimationFrame(loop)
}

loop()