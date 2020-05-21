game.config = {
    images: {
        main: 'assets/img1.jpg',
        overlay: 'assets/img2.jpg',
        remote: 'https://media.4rgos.it/i/Argos/7336753_R_Z001A?w=200&h=200'
    },
    sprites: {
        hole: {
            poly: [{ x: 224, y: 478 }, { x: 210, y: 485 }, { x: 194, y: 491 }, { x: 172, y: 501 }, { x: 189, y: 508 }, { x: 179, y: 510 }, { x: 174, y: 516 }, { x: 179, y: 532 }, { x: 246, y: 533 }, { x: 256, y: 534 }, { x: 253, y: 524 }, { x: 235, y: 524 }, { x: 228, y: 531 }, { x: 239, y: 507 }],
            img: 'overlay'
        },
        girl: {
            poly: [{ x: 1069, y: 353 }, { x: 1083, y: 353 }, { x: 1085, y: 359 }, { x: 1078, y: 368 }, { x: 1085, y: 380 }, { x: 1094, y: 374 }, { x: 1111, y: 403 }, { x: 1103, y: 405 }, { x: 1101, y: 401 }, { x: 1092, y: 403 }, { x: 1065, y: 400 }, { x: 1057, y: 386 }, { x: 1058, y: 369 }, { x: 1068, y: 366 }],
            img: 'overlay'
        },
        girl_dialog: {
            circle: { x: 922, y: 389, r: 100 }
        },
        smallgirl: {
            poly: [{ x: 899, y: 350 }, { x: 888, y: 368 }, { x: 886, y: 389 }, { x: 884, y: 409 }, { x: 891, y: 424 }, { x: 883, y: 434 }, { x: 872, y: 444 }, { x: 858, y: 498 }, { x: 842, y: 524 }, { x: 835, y: 551 }, { x: 824, y: 562 }, { x: 823, y: 575 }, { x: 838, y: 582 }, { x: 855, y: 583 }, { x: 841, y: 644 }, { x: 847, y: 662 }, { x: 850, y: 677 }, { x: 853, y: 770 }, { x: 830, y: 791 }, { x: 814, y: 787 }, { x: 803, y: 798 }, { x: 978, y: 799 }, { x: 999, y: 789 }, { x: 1001, y: 772 }, { x: 991, y: 761 }, { x: 997, y: 753 }, { x: 981, y: 751 }, { x: 967, y: 768 }, { x: 958, y: 774 }, { x: 953, y: 765 }, { x: 956, y: 736 }, { x: 956, y: 685 }, { x: 984, y: 669 }, { x: 1007, y: 658 }, { x: 975, y: 570 }, { x: 999, y: 551 }, { x: 1027, y: 498 }, { x: 963, y: 432 }, { x: 964, y: 410 }, { x: 958, y: 394 }, { x: 956, y: 358 }, { x: 947, y: 340 }, { x: 931, y: 344 }, { x: 916, y: 343 }],
            img: 'overlay',
        },
        girl_dialog: {
            circle: { x: 1080, y: 370, r: 100 },
            img: 'overlay'
        },
        s_red: {
            poly: [{ x: 1417, y: 200 }, { x: 1416, y: 215 }, { x: 1431, y: 216 }, { x: 1431, y: 199 }],
            img: 'overlay'
        },
        s_green: {
            poly: [{ x: 1416, y: 219 }, { x: 1433, y: 219 }, { x: 1434, y: 237 }, { x: 1415, y: 237 }],
            img: 'overlay'
        },
        remote: {
            img: 'remote',
            rect: { x: 0, y: 0, h: 200, w: 200 }
        }
    },
    objects: {
        remote: {
            name: 'Control remoto',
            see: 'Este control remoto será útil para algo',
            use: {
                semaphore_red: {
                    message: 'Usas el control remoto con el semaforo...',
                    hide: 'semaphore_red',
                    show: 'semaphore_green'
                },
                semaphore_green: {
                    message: 'Usas el control remoto con el semaforo...',
                    hide: 'semaphore_green',
                    show: 'semaphore_red'
                }
            },
            hide: true
        },
        hole: {
            name: 'Hoyo sospechoso',
            see: "No puedes ver nada ahí, esta muy obscuro"
        },
        girl: {
            name: 'Niña rara',
            sceneSprite: 'girl',
            inventorySprite: 'girl',
            talk: true,
            see: {
                sceneMessage: 'Esta niña esta sentada en el piso y se ve relajada.',
                inventoryMessage: 'Esta niña te quiere acompañar para conocer la ciudad.'
            },
            give: {
                smallgirl: {
                    add: 'remote',
                    remove: 'girl',
                    message: 'La niña pequeña esta muy feliz que puede jugar con alguien y te da un control remoto'
                }
            }
        },
        smallgirl: {
            name: 'Niña pequeña',
            see: 'Esta niña pequeña parece que quiere jugar.',
            talk: true,
        },
        semaphore_red: {
            name: 'Semaforo rojo',
            sceneSprite: 's_red',
            see: 'Es un semaforo normal como el hay miles en la CDMX.'
        },
        semaphore_green: {
            name: 'Semaforo verde',
            sceneSprite: 's_green',
            see: 'Es un semaforo normal como el hay miles en la CDMX.',
            hide: true
        }
    },
    dialogs: {
        smallgirl: {
            checks: [
                { type: 'nodisplay', value: 'semaphore_green', result: undefined }
            ],
            text: "Gracias por ayudarme con el semaforo",
            answers: [
                { text: "Mira, ya puedes cruzar la calle" },
            ]
        },
        girl: {
            sprite: 'girl_dialog',
            checks: [
                { type: 'inventory', value: 'girl', result: 'girl_inventory' }
            ],
            text: "Hola, como estas?",
            answers: [
                { text: "Bien y tu?", dialog: "girl_friendly" },
                { text: "Me caes mal", dialog: "girl_notfriendly" },
                { text: "Adios" }
            ]
        },
        girl_friendly: {
            sprite: 'girl_dialog',
            text: "Y que haces aqui?",
            answers: [
                { text: "Solamente paseando...", dialog: "girl_curious" },
                { text: "No te quiero decir", dialog: "girl_notfriendly" }
            ]
        },
        girl_notfriendly: {
            sprite: 'girl_dialog',
            text: "Hmta.... pues entonces no hablamos",
            answers: [
                { text: "Adios" }
            ]
        },
        girl_curious: {
            sprite: 'girl_dialog',
            text: "Quieres que vaya contigo?",
            answers: [
                { text: "Si", add: 'girl', hide: 'girl' },
                { text: "No" }
            ]
        },
        girl_inventory: {
            sprite: 'girl_dialog',
            text: "Vamos a descubrir la ciudad, no?",
            answers: [
                { text: "OK" }
            ]
        }
    }
}
