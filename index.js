const epd = require('epd2in7b');
const font = '/home/pi/epd/fonts/Montserrat-Bold.ttf';
const mdi = '/home/pi/epd/fonts/mdi.ttf';
const fontSize = 50

const img = epd.getImageBuffer('landscape');
const width = epd.height
const height = epd.width
let epdp = epd.init({fastLut: false})

const refreshDisplay = message =>
    epdp = epdp
    // init is required since we set it sleeping at the end of this chain
        .then(() => epd.init({fastLut: true}))
        .then(() => img.then(img => {
            // display a black rectangle
            img.rectangle(1, 1, 43, 45, epd.colors.black);

            img.stringFT(epd.colors.black, mdi, 26, 0,
                5,
                41,
                '');


            img.rectangle(1, 45, 43, 89, epd.colors.black);
            img.stringFT(epd.colors.black, mdi, 24, 0,
                6,
                84,
                '');

            img.rectangle(1, 89, 43, 133, epd.colors.black);
            img.stringFT(epd.colors.black, mdi, 24, 0,
                6,
                126,
                'ﳛ');

            img.rectangle(1, 133, 43, 175, epd.colors.black);
            img.stringFT(epd.colors.black, mdi, 24, 0,
                6,
                170,
                '連');

            let test = ;

            // Retrieve bounding box of displayed string
            let [xll, yll, xlr, ylr, xur, yur, xul, yul] = img.stringFTBBox(epd.colors.black, font, 24, 0, 0, 0, 'Light Sorting');

            // // Center the message
            img.stringFT(epd.colors.white, font, fontSize, 0,
                Math.round(width / 2 - (xur - xul) / 2 + 43),
                Math.round(height / 2 + (yll - yul) / 2),
                'Light Sorting');

            // display a red rectangle
            // img.filledRectangle(
            //     Math.round(width / 4), Math.round(height / 4),
            //     Math.round(3 * width / 4), Math.round(3 * height / 4),
            //     epd.colors.red)



            return epd.displayImageBuffer(img)
        }))
        .then(() => epd.sleep())

refreshDisplay(width + 'x' + height);

// Handle buttons
epd.buttons.handler.then(handler =>
    handler.on('pressed', function (button) {
        let buttonLabel = 'none'
        switch (button) {
            case epd.buttons.button1:
                buttonLabel = 'first button'
                break
            case epd.buttons.button2:
                buttonLabel = 'second button'
                break
            case epd.buttons.button3:
                buttonLabel = 'third button'
                break
            case epd.buttons.button4:
                buttonLabel = 'fourth button'
                break
            default:
                buttonLabel = 'an unknown button'
        }
        refreshDisplay(`You pressed \n${buttonLabel}`)
    })
)

// Handle exit
function exitHandler (options, err) {
    let promise = null
    if (options.cleanup) {
        promise = img.then(img => img.destroy())
    }

    if (err && err.stack) {
        console.log(err.stack)
    }

    if (options.exit) {
        if (promise !== null) {
            promise.then(() => process.exit())
        } else {
            process.exit()
        }
    }
}

process.on('exit', exitHandler.bind(null, {cleanup: true, exit: true}))
process.on('SIGINT', exitHandler.bind(null, {exit: true}))
process.on('SIGUSR1', exitHandler.bind(null, {exit: true}))
process.on('SIGUSR2', exitHandler.bind(null, {exit: true}))
process.on('uncaughtException', exitHandler.bind(null, {exit: true}))