const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvent = require('./logEvent');
const EventEmitter = require('events');
class Emitter extends EventEmitter { };

const myEmitter = new Emitter();
myEmitter.on('log', (msg, logFile) => { logEvent(msg, logFile) });

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image') ? 'utf-8' : ''
        );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404') ? 404 : 200,
            { 'Content-Type': contentType }
        );
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : rawData
        );
    } catch (err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errorLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((request, response) => {
    console.log(request.url, request.method);
    myEmitter.emit('log', `${request.url}\t${request.method}`, 'requestLog.txt');

    // let filePath;

    // if (request.url === '/' || request.url === 'index.html') {
    //     response.statusCode = 200;
    //     response.setHeader('Content-Type', 'text/html');
    //     filePath = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(filePath, 'utf-8', (err, data) => {
    //         if (err)
    //             console.error(err);
    //         response.end(data);
    //     })
    // }

    // switch (request.url) {
    //     case '/':
    //         response.statusCode = 200;
    //         filePath = path.join(__dirname, 'views', 'index.html');
    //         fs.readFile(filePath, 'utf-8', (err, data) => {
    //             if (err)
    //                 console.error(err);
    //             response.end(data);
    //         })
    // }
    const extension = path.extname(request.url);
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json'
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html'
    }

    let filePath =
        contentType === 'text/html' && request.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && request.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', request.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', request.url)
                    : path.join(__dirname, request.url);

    // Makes .html not required in browser
    if (!extension && request.url.slice(-1) !== '/')
        filePath += '.html';

    const fileExsist = fs.existsSync(filePath);

    if (fileExsist) {
        serveFile(filePath, contentType, response);
    } else {
        // console.log(`${path.parse(filePath).base} not found`);
        // console.log(path.parse(filePath))
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                response.writeHead(301, { 'Location': '/new-page.html' });
                response.end();
                break;
            case 'www-page.html':
                response.writeHead(301, { 'Location': '/' });
                response.end();
                break;
            default:
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', response);
        }
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

