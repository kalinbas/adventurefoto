function handleClick() {
    let mc = getMouseCoords()

    // dialog handling
    if (game.state.dialog) {
        handleDialogClick()
    } else {
        // reset message
        game.state.message = null
        game.state.messagePosition = mc

        // select action
        if (game.state.mouseOverAction) {
            game.state.action = game.state.mouseOverAction
            game.state.item1 = null
            game.state.item2 = null
        }

        let objectHovered = game.state.mouseOverObject || game.state.mouseOverInventory

        let actionKey = game.state.action
        if (objectHovered && !actionKey) {
            actionKey = 'see'
        }
        let action = game.actions[actionKey]

        if (objectHovered && action) {
            if (!game.state.item1) {
                game.state.item1 = objectHovered
            } else {
                if (action.hasTwoObjects) {
                    game.state.item2 = objectHovered
                }
            }
        }

        // do action if ready
        if (action && game.state.item1 && (!action.hasTwoObjects || game.state.item2)) {

            let object1Key = game.state.item1
            let object2Key = game.state.item2
            let object1 = game.config.objects[object1Key]
            let object2 = game.config.objects[object2Key]
            let object1ActionConfig = object1[actionKey]

            // handle default action config
            if (object1ActionConfig === true) { object1ActionConfig = object1Key }

            if (object1ActionConfig) {
                switch (actionKey) {
                    case 'see':
                        if (typeof object1ActionConfig === 'string') {
                            game.state.message = object1ActionConfig
                        } else {
                            handleActions(object1ActionConfig, object1Key)
                        }
                        break;
                    case 'talk':
                        if (typeof object1ActionConfig === 'string') {
                            game.state.dialog = object1ActionConfig
                        } else {
                            handleActions(object1ActionConfig, object1Key)
                        }
                        break;
                    case 'take':
                        if (typeof object1ActionConfig === 'string') {
                            addToInventory(object1ActionConfig)
                        } else {
                            handleActions(object1ActionConfig, object1Key)
                        }
                        break;
                    case 'move':
                        handleActions(object1ActionConfig, object1Key)
                        break;
                    case 'use':
                    case 'give':
                        if (object1ActionConfig[object2Key]) {
                            handleActions(object1ActionConfig[object2Key])
                        }
                        break;
                    default:
                        if (!game.state.message) {
                            game.state.message = action.default.replace('%1', game.config.objects[game.state.item1].name)
                            if (game.state.item2) {
                                game.state.message = game.state.message.replace('%2', game.config.objects[game.state.item2].name)
                            }
                        }
                        break;
                }
            }

            resetSelectedAction()
        }

        // if click with nothing selected - reset
        if (!(game.state.mouseOverObject || game.state.mouseOverInventory || game.state.mouseOverAction)) {
            resetSelectedAction()
        }
    }
    return false;
}

function handleActions(a, objectKey) {

    // generic counter increment
    if (a.counter) { incrementCounter(a.counter) }

    // in inventory
    if (a.add) { addToInventory(a.add) }
    if (a.remove) { removeFromInventory(a.remove) }

    // on scene
    if (a.show) { game.state.objects[a.show] = true }
    if (a.hide) { game.state.objects[a.hide] = false }

    if (a.message) { game.state.message = a.message }

    // dialog is set / or cleared
    game.state.dialog = a.dialog

    if (a.inventoryMessage && hasInventory(objectKey)) { 
        game.state.message = a.inventoryMessage
    }
    if (a.sceneMessage && !hasInventory(objectKey)) { 
        game.state.message = a.sceneMessage
    }
}

function handleDialogClick() {
    if (game.state.mouseOverAnswer !== null) {
        let dialog = game.config.dialogs[game.state.dialog]
        let answer = dialog.answers[game.state.mouseOverAnswer]
        handleActions(answer)
    }
}

function incrementCounter(name) {
    if (!game.state.counters[name]) {
        game.state.counters[name] = 1
    } else {
        game.state.counters[name]++
    }
}

function hasInventory(objectKey) {

}

function addToInventory(objectKey) {
    if (!game.state.inventory.includes(objectKey)) {
        game.state.inventory.push(objectKey)
    }
}
function removeFromInventory(objectKey) {
    game.state.inventory = game.state.inventory.filter(i => i !== objectKey)
}

function resetSelectedAction() {
    game.state.action = null
    game.state.item1 = null
    game.state.item2 = null
}