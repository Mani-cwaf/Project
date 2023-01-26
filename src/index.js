const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
let mainWindow;

if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = () => {
	mainWindow = new BrowserWindow({
		icon: 'src/assets/icon.png',
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
		},
	});

	mainWindow.setMenu(null);
	mainWindow.maximize();
	mainWindow.loadFile(path.join(__dirname, 'public/home/index.html'));

	//mainWindow.webContents.openDevTools();
	
	backgroundWindow = new BrowserWindow({
		icon: path.join(__dirname, 'assets/icon.ico'),
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	backgroundWindow.loadFile(path.join(__dirname, 'public/background/index.html'));
	backgroundWindow.hide();

	mainWindow.on('close', (event) => {
		if (app.quitting) {
			mainWindow.destroy();
			backgroundWindow.destroy();
		} else {
			event.preventDefault()
			mainWindow.hide()
		}
	});
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit()
})

app.on('activate', () => {
	mainWindow.show()
});

app.on('before-quit', () => {
	app.quitting = true;
});

let tray = null
app.whenReady().then(() => {
	tray = new Tray('src/assets/icon.png')
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Quit', type: 'normal', click: () => {
			tray.destroy();
			app.quit();
		} }
	])
	tray.setToolTip('Sustainable Cities.')
	tray.setContextMenu(contextMenu)
	tray.addListener('click', () => {
		mainWindow.show();
	});
})