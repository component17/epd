const epd = require('epd2in7b');
const font = '/home/pi/epd/fonts/Montserrat-Bold.ttf';
const mdi = '/home/pi/epd/fonts/mdi.ttf';
const roboto = '/home/pi/epd/fonts/Roboto-Regular.ttf';
const rubikB = '/home/pi/epd/fonts/Rubik-Bold.ttf';
const rubikR = '/home/pi/epd/fonts/Rubik-Regular.ttf';
const qr = '/home/pi/epd/fonts/qr.ttf';
const fontSize = 50;

const img = epd.getImageBuffer('landscape');
const width = epd.height
const height = epd.width
let epdp = epd.init({fastLut: true});

const bwipjs = require('bwip-js');


let gd = require('node-gd');

let getPng = () => {
    return new Promise((resolve, reject) => {
        gd.openPng('./qr.png', (err, data) => {
            resolve(data)
        })
    })
    // return new Promise((resolve, reject) => {
    //     bwipjs.toBuffer({
    //         bcid:        'code128',       // Barcode type
    //         text:        '0123456789',    // Text to encode
    //         scale:       3,               // 3x scaling factor
    //         height:      10,              // Bar height, in millimeters
    //         includetext: true,            // Show human-readable text
    //         textxalign:  'center',        // Always good to set this
    //     }, function (err, png) {
    //         if (err) {
    //             reject(err)
    //         } else {
    //             resolve(png)
    //         }
    //     });
    // })
}

let screenHome = (img) => {
    // display a black rectangle
    img.filledRectangle(1, 1, 43, 45, epd.colors.black);

    img.stringFT(epd.colors.white, mdi, 26, 0,
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

    let box1 = img.stringFTBBox(epd.colors.black, font, 22, 0, 0, 0, 'Light Sorting');

    // // Center the message
    img.stringFT(epd.colors.black, font, 22, 0,
        Math.round(width / 2 - (box1[4] - box1[6]) / 2 + 25),
        Math.round(height / 2 + (box1[1] - box1[7]) / 2 - 60),
        'Light Sorting');

    let box2 = img.stringFTBBox(epd.colors.black, font, 18, 0, 0, 0, '192.168.1.77');

    img.stringFT(epd.colors.black, font, 18, 0,
        Math.round(width / 2 - (box2[4] - box2[6]) / 2 + 25),
        Math.round(height / 2 + (box2[1] - box2[7]) / 2 - 5),
        '192.168.1.77');

// copy watermark onto input, i.e. onto the destination


    let box4 = img.stringFTBBox(epd.colors.black, font, 18, 0, 0, 0, 'Port: 3000');

    // // Center the message
    img.stringFT(epd.colors.black, font, 18, 0,
        Math.round(width / 2 - (box4[4] - box4[6]) / 2 + 25),
        Math.round(height / 2 + (box4[1] - box4[7]) / 2 + 25),
        'Port: 3000');

    let box3 = img.stringFTBBox(epd.colors.black, rubikR, 12, 0, 0, 0, 'Powered by Component17');

    // // Center the message
    img.stringFT(epd.colors.black, rubikR, 12, 0,
        Math.round(width / 2 - (box3[4] - box3[6]) / 2 + 25),
        Math.round(height / 2 + (box3[1] - box3[7]) / 2 + 67),
        'Powered by Component17');



    // display a red rectangle
    // img.filledRectangle(
    //     Math.round(width / 4), Math.round(height / 4),
    //     Math.round(3 * width / 4), Math.round(3 * height / 4),
    //     epd.colors.red)
    return img;
};

screenQr = async (img) => {
    img.rectangle(1, 1, 43, 45, epd.colors.black);

    img.stringFT(epd.colors.black, mdi, 26, 0,
        5,
        41,
        '');


    img.filledRectangle(1, 45, 43, 89, epd.colors.black);
    img.stringFT(epd.colors.white, mdi, 24, 0,
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

    let code = await getPng();

    code.alphaBlending(0);
    code.saveAlpha(0);
    code.negate();
    code.copy(img, 70, 3, 0, 0, 170, 170);

    return img;
}

const refreshDisplay = message =>
    epdp = epdp
    // init is required since we set it sleeping at the end of this chain
        .then(() => epd.init({fastLut: true}))
        .then( () => epd.getImageBuffer('landscape').then(async img => {

            let screen = null;

            if(message === 'qr'){
                screen = await screenQr(img)
                console.log(555)
            }else if(message === 'home'){
                screen = screenHome(img)
                console.log(666)

            }

            return epd.displayImageBuffer(screen)
        }))
        .then(() => {
            epd.sleep();
        })
        .catch(e => console.log(e))

refreshDisplay('home');

// Handle buttons
epd.buttons.handler.then(handler =>
    handler.on('pressed', function (button) {
        let buttonLabel = 'none'
        console.log(button)
        switch (button) {
            case epd.buttons.button1:
                buttonLabel = 'home'
                break
            case epd.buttons.button2:
                buttonLabel = 'qr'
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
        console.log(`You pressed \n${buttonLabel}`);
        refreshDisplay(buttonLabel)
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