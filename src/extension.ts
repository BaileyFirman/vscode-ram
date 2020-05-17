import * as vscode from 'vscode';
import { StatusBarItem, StatusBarAlignment } from 'vscode';
const execSync = require('child_process').execSync;

interface IStatusBarItemAlignment {
	position: StatusBarAlignment;
	priority: number;
};

export const activate = () => {

	const performanceButtonAllignment: IStatusBarItemAlignment = {
		position: StatusBarAlignment.Left,
		priority: 99999
	};

	const ramStatusText: string = '$(circuit-board)';
	const ramStatus: StatusBarItem = 
		buildStatusBarItem(performanceButtonAllignment, ramStatusText, '');

	const executeCommand = (command: string) => {
		return execSync(command, { encoding: 'utf-8' });
	};

	const memoryPressureCommand = 'memory_pressure -Q';
	const cpuLoadCommand = `ps -e -o %cpu | awk '{s+=$1} END {print s}'`;

		(() => {
			setInterval(() => {
				const memoryPressure = executeCommand(memoryPressureCommand);
				const pressurePercentage = memoryPressure.split('\n')[1].split(' ')[4];
				const inversePercentage = 100 - parseInt(pressurePercentage);
				
				const cpuLoad = executeCommand(cpuLoadCommand);
				ramStatus.text = `$(circuit-board) ${inversePercentage}% | ${cpuLoad.slice(0, cpuLoad.length-1)}%`;
			}, 2000);
	})();

	ramStatus.show();
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