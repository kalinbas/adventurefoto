function handleDraw() {
    // clear full screen
    clear()
    fill(0)
    rect(0, 0, windowWidth, windowHeight)

    game.state.mouseOver = {}

    // translate all operations to game space
    translate(game.deltaX, game.deltaY)
    scale(game.scale)

    // draw main image
    image(game.images['main'], 0, 0);

    // draw objects
    drawObjects()

    if (game.state.mode === 'start') {
        drawStart()
    } else if (game.state.mode === 'game') {
        // draw inventory && actions
        drawInterface()
        // draw dialog if needed
        if (game.state.dialog) {
            drawDialog()
        }
    } else if (game.state.mode === 'end') {
        drawEnd()
    }

    // cursor handling
    cursor(_.size(game.state.mouseOver) > 0 ? HAND : ARROW)
}

function drawObjects() {

    let mc = getMouseCoords()

    for (let objectKey of Object.keys(game.config.objects)) {

        // draw if visible
        if (game.state.objects[objectKey]) {
            let object = game.config.objects[objectKey]
            let spriteKey = object.sceneSprite || objectKey
            let spriteConfig = game.config.sprites[spriteKey]

            // check if can be displayed based on rules
            let sceneChecked = !object.sceneChecks || doChecks(object.sceneChecks)

            // only draw if sprite config could be found
            if (sceneChecked && spriteConfig) {
                if (checkIfObjectIsSelected(spriteConfig, mc) && game.state.item1 !== objectKey && game.state.mode === 'game' && !game.state.dialog) {
                    tint(255, 255, 240)
                    game.state.mouseOver.object = objectKey
                }

                let sprite = game.sprites[spriteKey]
                image(sprite.img, sprite.x, sprite.y)

                noTint()
            }
        }
    }
}

function drawInterface() {


    fill('rgba(0, 0, 0, 0.5)')
    rect(0, game.height - 140, game.width, 140)

    fill(255);
    textSize(36);
    textFont('Helvetica');

    // get mouse coordinates
    let mc = getMouseCoords()

    // draw actions
    for (const actionKey of Object.keys(game.actions)) {
        const action = game.actions[actionKey]
        if (game.state.action === actionKey && game.state.mode === 'game' && !game.state.dialog) {
            fill(255, 255, 0)
        } else if (checkIfActionIsSelected(action, mc) && game.state.mode === 'game' && !game.state.dialog) {
            fill(128)
            game.state.mouseOver.action = actionKey
        } else {
            fill(255)
        }
        text(action.text, action.x, game.height - 40);
    }

    // draw inventory
    for (let i = 0; i < 6; i++) {

        // cant select twice same object
        if (game.state.inventory[i] && checkIfInventoryIsSelected(i, mc) && game.state.item1 !== game.state.inventory[i] && game.state.mode === 'game' && !game.state.dialog) {
            fill(128)
            stroke(128)
            strokeWeight(2)

            game.state.mouseOver.inventory = game.state.inventory[i]
        }

        fill('rgba(0, 0, 0, 0.5)')
        rect(1000 + i * 100, game.height - 90, 80, 80)

        fill(255)
        stroke(255)
        strokeWeight(0)

        if (game.state.inventory[i]) {
            let objectKey = game.state.inventory[i]
            let object = game.config.objects[objectKey]
            let spriteKey = object.inventorySprite || objectKey
            let sprite = game.sprites[spriteKey].img
            image(sprite, 1005 + i * 100, game.height - 85, 70, 70)
        }
    }

    // draw message
    let actionText = ''
    let hoveredObject = game.state.mouseOver.inventory || game.state.mouseOver.object

    //if action selected - show text
    if (game.state.action) {

        let action = game.actions[game.state.action]
        actionText = action.text
        if (action.prefix1) {
            actionText += ' ' + action.prefix1
        }
        if (action.hasTwoObjects && game.state.item1) {
            actionText += ' ' + game.config.objects[game.state.item1].name
            if (action.prefix2) {
                actionText += ' ' + action.prefix2
            }
        }
        if (hoveredObject) {
            actionText += ' ' + game.config.objects[hoveredObject].name
        }
    } else if (hoveredObject) {
        actionText = game.config.objects[hoveredObject].name
    }

    fill(255)
    stroke(255)
    strokeWeight(0)

    textSize(24)

    if (game.state.message) {
        text(game.state.message, game.width / 2.0 - game.state.message.length * 3.5, game.height - 110)
    } else if (actionText) {
        text(actionText, game.width / 2.0 - actionText.length * 3.5, game.height - 110);
    }
}

function drawStart() {

    let mc = getMouseCoords()

    fill('rgba(0, 0, 0, 0.5)')
    rect(50, 50, game.width - 100, game.height - 100)

    fill(255)
    stroke(255)
    strokeWeight(0)
    textSize(48)
    text("Bienvenido", 200, 200);

    textSize(24)
    text("Ayudale a la niña a cruzar la calle en este juego al estilo de los antiguos juegos 'point-and-click'. Tienes una lista de acciones, un inventario y tendras que usar tu inteligencia y imaginacion para resolver este juego.", 200, 250, game.width - 300, 500);

    let buttonWidth = 150
    let buttonHeight = 50
    let buttonX = (game.width - buttonWidth) / 2
    let buttonY = 600

    strokeWeight(1)

    if (mc.y >= buttonY && mc.y < buttonY + buttonHeight && mc.x >= buttonX && mc.x < buttonX + buttonWidth) {
        fill(128)
        game.state.mouseOver.startButton = true
    }
    else {
        fill(0, 0, 0, 0)
    }

    rect((game.width - buttonWidth) / 2, buttonY, buttonWidth, buttonHeight)

    strokeWeight(0)
    fill(255)
    text("Listo", (game.width - buttonWidth) / 2 + 50, buttonY + 33);
}

function drawEnd() {

    let mc = getMouseCoords()

    fill('rgba(0, 0, 0, 0.5)')
    rect(50, 50, game.width - 100, game.height - 100)

    fill(255)
    stroke(255)
    strokeWeight(0)
    textSize(48)
    text("Felicidades", 200, 200);

    textSize(24)
    text("Lograste ayudar a la niña y aprendiste a jugar este tipo de juego. Te gustaria hacer tu propio juego? Solo necesitas unas fotos de la escena y creatividad y un poco de curiosidad.", 200, 250, game.width - 300, 500);

}

function drawDialog() {

    let dialogKey = game.state.dialog
    let dialog = game.config.dialogs[dialogKey]
    while (dialog.checks) {
        let checkResult = doChecks(dialog.checks)
        if (checkResult) {
            dialogKey = checkResult.result
            game.state.dialog = dialogKey

            if (!dialogKey) {
                return
            }

            dialog = game.config.dialogs[dialogKey]
        } else {
            break
        }
    }

    // overlay
    fill('rgba(0, 0, 0, 0.65)')
    rect(0, 0, game.width, game.height)

    let spriteKey = dialog.sprite || dialogKey.split("_")[0]
    let sprite = game.sprites[spriteKey].img

    // draw dialog image
    image(sprite, 100, 100, 200, 200);

    // draw dialog text
    fill(255);
    textSize(36);
    textFont('Helvetica');
    text(dialog.text, 400, 180, 1000, 400);

    // get mouse coordinates
    let mc = getMouseCoords()

    let x = 400
    let y = 500
    let i = 0
    for (const answer of dialog.answers) {
        if (mc.y >= y - 50 && mc.y < y && mc.x >= x) {
            fill(128)
            game.state.mouseOver.answer = i
        }
        else {
            fill(255)
        }
        text(answer.text, x, y);
        y += 50
        i++
    }
}

function doChecks(checks) {

    for (const check of checks) {

        if (check.type === 'inventory' && game.state.inventory.includes(check.value)) {
            return { result: check.result }
        }
        if (check.type === 'noinventory' && !game.state.inventory.includes(check.value)) {
            return { result: check.result }
        }
        if (check.type === 'counter' && game.state.counters[check.value]) {
            return { result: check.result }
        }
        if (check.type === 'nocounter' && !game.state.counters[check.value]) {
            return { result: check.result }
        }
        if (check.type === 'display' && game.state.objects[check.value]) {
            return { result: check.result }
        }
        if (check.type === 'nodisplay' && !game.state.objects[check.value]) {
            return { result: check.result }
        }
    }

    return false
}

function checkIfActionIsSelected(action, mc) {
    return mc.y > game.height - 60 && mc.y < game.height - 30 && mc.x > action.x && mc.x < action.xe
}

function checkIfInventoryIsSelected(i, mc) {
    return mc.y > game.height - 90 && mc.y < game.height - 10 && mc.x > 1000 + i * 100 + 10 && mc.x < 1000 + i * 100 + 90
}

function checkIfObjectIsSelected(spriteConfig, mc) {
    if (spriteConfig.poly) {
        return isPointInsidePolygon(mc, spriteConfig.poly)
    } else if (spriteConfig.circle) {
        return isPointInsideCircle(mc, spriteConfig.circle)
    } else if (spriteConfig.rect) {
        return isPointInsideRectangle(mc, spriteConfig.rect)
    } else {
        throw new Error("Unhandled sprite type")
    }
}
function isPointInsideRectangle(p, r) {
    return p.x >= r.x && p.y >= r.y && p.x < r.x + r.w && p.y < r.y + r.h
}
function isPointInsideCircle(p, c) {
    return Math.sqrt(Math.pow(c.x - p.x, 2) + Math.pow(c.y - p.y, 2)) <= c.r
}
function isPointInsidePolygon(p, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    let x = p.x, y = p.y;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].x, yi = vs[i].y;
        let xj = vs[j].x, yj = vs[j].y;

        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
