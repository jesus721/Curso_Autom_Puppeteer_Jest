const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

describe('Visual Regression Testing', () => {
    let navegado, pagina

    beforeAll(async () => {
        navegador = await puppeteer.launch({ headless: false })
        pagina = await navegador.newPage()
    })

    afterAll(async () => {
        await navegador.close()
    })

    beforeEach(async () => {
        await pagina.goto('https://example.com')
    })

    test('Captura de pantalla completa', async () => {
        //await pagina.goto('https://example.com')
        await pagina.waitForSelector('h1')
        const image = await pagina.screenshot()
        //expect(image).toMatchImageSnapshot({  // Ya no funciona en la versión actual de puppeteer
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        })
    })

    test('Captura de pantalla de un elemento', async () => {
        await pagina.waitForSelector('h1')
        const h1 = await pagina.$('h1')
        const image = await h1.screenshot()
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    })

    test('Captura de pantalla removiendo un elemento', async () => {
        // Curso
        await pagina.evaluate(() => {
            (document.querySelectorAll('h1') || []).forEach(elemento => elemento.remove())
        })
        // Función copilot
        // await pagina.evaluate(() => {
        //     document.querySelector('h1').remove()
        // })
        await new Promise(r => setTimeout(r, 5000));
    })

    // La versión de puppeteer no soporta la emulación de dispositivos móviles
    /*test.only('Captura de pantalla de Iphone', async () => {
        await pagina.waitForSelector('h1')
        await pagina.emulate(puppeteer.devices['iPhone X'])
        const image = await pagina.screenshot()
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'pixel',
            failureThreshold: 500
        })
    })*/

    test('Captura de pantalla de un elemento con scroll', async () => {
        await pagina.goto('https://www.example.com')
        await pagina.waitForSelector('h1')
        const h1 = await pagina.$('h1')
        await pagina.evaluate(element => {
            element.scrollIntoView()
        }, h1)
        const image = await h1.screenshot()
        expect(Buffer.from(image)).toMatchImageSnapshot({
            failureThresholdType: 'percent',
            failureThreshold: 0.01
        })
    })
})
