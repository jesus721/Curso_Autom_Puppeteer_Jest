const puppeteer = require('puppeteer')
const percySnapshot = require('@percy/puppeteer')

describe('Percy Test', () => {
    let navegador, pagina

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
        await pagina.waitForSelector('h1')
        await pagina.evaluate(() => {
            (document.querySelectorAll('h1') || []).forEach(elemento => elemento.remove())
        })
        await percySnapshot(pagina, '1er. Ejemplo prueba de Percy')
    })

    /*test('Captura de pantalla de un elemento', async () => {
        await pagina.waitForSelector('h1')
        const h1 = await pagina.$('h1')
        await percySnapshot(pagina, 'Ejemplo', { 
            // Recibe un tercer parámetro con opciones
        })
    })*/
})