const game = {
    images: {},
    sprites: {},
    width: 1600,
    height: 800,
    deltaX: 0,
    deltaY: 0,
    scale: 1.0,
    actions: { 
        see: { text: 'Ver', prefix1: 'a', x: 50, xe: 120, default: 'Es un %1 normal.' },
        talk: { text: 'Hablar', prefix1: 'con', x: 130, xe: 240, default: 'No puedes hablar con %1' },
        take : { text: 'Tomar', x: 250, xe: 360, default: 'No puedes tomar eso' },
        move : { text: 'Mover', prefix1: 'a', x: 370, xe: 480, default: 'No puedes mover eso' },
        use : { text: 'Usar', prefix2: 'con', x: 490, xe: 580, hasTwoObjects: true, default: 'No puedes usar eso asi' },
        give: { text: 'Dar', prefix2: 'a', x: 590, xe: 650, hasTwoObjects: true, default: 'No puedes darle eso a %2' },
    },
    state: {
        objects: {},
        inventory: [],
        counters: {},
        action: null,
        item1: null,
        item2: null,
        dialog: null,
        mouseOverInventory: null,
        mouseOverAction: null,
        mouseOverObject: null,
        mouseOverAnswer: null,
        message: null,
        messagePosition: null
    }
}

function preload() {
    loadImages()
}

function setup() {
    extractSprites()
    loadObjects()
    createCanvas(windowWidth, windowHeight)
    calculateSize()
}

function draw() {
    handleDraw()
}

function mouseClicked() {
    handleClick()
}

function getMouseCoords() {
    return { x: (winMouseX - game.deltaX) / game.scale, y: (winMouseY - game.deltaY) / game.scale }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calculateSize();
}

function calculateSize() {
    let windowRatio = windowWidth * 1.0 / windowHeight;
    let gameRatio = game.width * 1.0 / game.height;
    if (windowRatio > gameRatio) {
        game.scale = windowHeight * 1.0 / game.height;
        game.deltaX = (windowWidth - game.scale * game.width) / 2.0
        game.deltaY = 0
    } else {
        game.scale = windowWidth * 1.0 / game.width;
        game.deltaX = 0
        game.deltaY = (windowHeight - game.scale * game.height) / 2.0
    }
}

function loadImages() {
    for (let imageKey of Object.keys(game.config.images)) {
        game.images[imageKey] = loadImage(game.config.images[imageKey])
    }
}

function extractSprites() {
    // extract sprites
    for (let spriteKey of Object.keys(game.config.sprites)) {

        let sprite = game.config.sprites[spriteKey]

        let minX = sprite.rect ? sprite.rect.x : (sprite.circle ? sprite.circle.x - sprite.circle.r / 2 : _.minBy(sprite.poly, 'x').x)
        let maxX = sprite.rect ? sprite.rect.x + sprite.rect.w : (sprite.circle ? sprite.circle.x + sprite.circle.r / 2 : _.maxBy(sprite.poly, 'x').x)
        let minY = sprite.rect ? sprite.rect.y : (sprite.circle ? sprite.circle.y - sprite.circle.r / 2 : _.minBy(sprite.poly, 'y').y)
        let maxY = sprite.rect ? sprite.rect.y + sprite.rect.h : (sprite.circle ? sprite.circle.y + sprite.circle.r / 2 : _.maxBy(sprite.poly, 'y').y)

        let sizeX = maxX - minX
        let sizeY = maxY - minY

        // draw interesting section to img
        let img = createGraphics(sizeX, sizeY);
        img.image(game.images[sprite.img || 'main'], 0, 0, sizeX, sizeY, minX, minY, sizeX, sizeY);
        img = img.get();


        // create mask
        let mask = createGraphics(sizeX, sizeY);
        mask.fill('rgba(0, 0, 0, 1)');
        if (sprite.circle) {
            mask.circle(sprite.circle.r / 2, sprite.circle.r / 2, sprite.circle.r)
        } else if (sprite.rect) {
            mask.rect(sprite.rect.x, sprite.rect.y, sprite.rect.w, sprite.rect.h)
        } else {
            mask.beginShape();
            for (let coord of sprite.poly) {
                mask.vertex(coord.x - minX, coord.y - minY)
            }
            mask.endShape(CLOSE);
        }
        img.mask(mask);


        game.sprites[spriteKey] = {
            x: minX,
            y: minY,
            img
        }
    }
}

function loadObjects() {
    for (let objectKey of Object.keys(game.config.objects)) {
        let object = game.config.objects[objectKey]
        game.state.objects[objectKey] = !object.hide
    }
}