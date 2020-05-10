import * as vscode from 'vscode';
import { StatusBarItem, StatusBarAlignment } from 'vscode';
const execSync = require('child_process').execSync;

interface IStatusBarItemAlignment {
	position: StatusBarAlignment;
	offset: number;
};

export const activate = () => {

	const backButtonAlignment: IStatusBarItemAlignment = {
		position: StatusBarAlignment.Left,
		offset: 99999
	};

	const backButtonText: string = 'CPU: Loading...';
	const backButton: StatusBarItem = 
		buildButton(backButtonAlignment, backButtonText, '');
	
		(function(){
			setInterval(() => {
				const output = execSync('top -l 1 | grep -E "^CPU|^Phys"', { encoding: 'utf-8' });
				console.log(output);
				backButton.text = output.split('\n')[0].split(' ')[2];
			}, 1000);
	})();

	backButton.show();
}

const buildButton = (alignment: IStatusBarItemAlignment, iconName: string, tooltip: string) => {
	const button: StatusBarItem = vscode.window.createStatusBarItem(alignment.position, alignment.offset);
	button.text = iconName;
	button.tooltip = tooltip;
	return button;
}