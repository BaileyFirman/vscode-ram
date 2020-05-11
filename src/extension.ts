import * as vscode from 'vscode';
import { StatusBarItem, StatusBarAlignment } from 'vscode';
const execSync = require('child_process').execSync;

interface IStatusBarItemAlignment {
	position: StatusBarAlignment;
	priority: number;
};

export const activate = () => {

	const backButtonAlignment: IStatusBarItemAlignment = {
		position: StatusBarAlignment.Left,
		priority: 99999
	};

	const backButtonText: string = 'CPU: Loading...';
	const backButton: StatusBarItem = 
	buildStatusBarItem(backButtonAlignment, backButtonText, '');
	
		(() => {
			setInterval(() => {
				// const output = execSync('top -l 1 | grep -E "^CPU|^Phys"', { encoding: 'utf-8' });
				const output = execSync('memory_pressure -Q', { encoding: 'utf-8' });
				console.log(output);
				const memoryPressure = execSync('memory_pressure -Q', { encoding: 'utf-8' });
				const pressurePercentage = memoryPressure.split('\n')[1].split(' ')[4];
				const inversePercentage = 100 - parseInt(pressurePercentage);
				backButton.text = `$(dashboard)${inversePercentage}%`;
			}, 1000);
	})();

	backButton.show();
}

const buildStatusBarItem = (
	alignment: IStatusBarItemAlignment,
	iconName: string,
	tooltip: string
) => {
	const button: StatusBarItem =
		vscode.window.createStatusBarItem(alignment.position, alignment.priority);
	button.text = iconName;
	button.tooltip = tooltip;
	return button;
};