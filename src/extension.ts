import * as vscode from 'vscode';
import { StatusBarItem, StatusBarAlignment } from 'vscode';

const execSync = require('child_process').execSync;

interface IStatusBarItemAlignment {
    position: StatusBarAlignment;
    priority: number;
};

const executeCommand = (command: string): string => {
    return execSync(command, { encoding: 'utf-8' });
};

const parseMemory = (result: string): number => {
    const pressure = result.split('\n')[1].split(' ')[4];
    return 100 - parseInt(pressure);
};

export const activate = () => {

    const performanceButtonAllignment: IStatusBarItemAlignment = {
        position: StatusBarAlignment.Left,
        priority: 99998
    };

    const ramStatusText: string = '$(circuit-board)';
    const ramStatus: StatusBarItem =
        buildStatusBarItem(performanceButtonAllignment, ramStatusText);

    const memoryPressureCommand = 'memory_pressure -Q';

    const pollMemory = () => {
        setInterval(() => {
            const memoryPressure = executeCommand(memoryPressureCommand);
            const inversePercentage = parseMemory(memoryPressure);
            ramStatus.text = `$(circuit-board) ${inversePercentage}%`;
        }, 2000);
    };

    pollMemory();

    ramStatus.show();
};

const buildStatusBarItem = (alignment: IStatusBarItemAlignment, iconName: string) => {
    const button: StatusBarItem = vscode.window.createStatusBarItem(alignment.position, alignment.priority);
    button.text = iconName;
    button.tooltip = '';
    return button;
};