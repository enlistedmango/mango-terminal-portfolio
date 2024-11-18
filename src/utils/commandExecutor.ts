import React from 'react';
import { commands } from './commands';

export async function executeCommand(input: string): Promise<React.ReactNode> {
  // Handle commands with spaces (like "man hackerman")
  const fullCommand = input.trim().toLowerCase();
  if (commands[fullCommand]) {
    try {
      return await commands[fullCommand]([]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return `Error executing command: ${errorMessage}`;
    }
  }

  // Handle regular commands with arguments
  const [command, ...args] = input.split(' ');

  // Easter egg: konami code as a command
  if (command === 'uuddlrlrba') {
    return '🎮 Cheat code activated! You found an easter egg!';
  }

  const commandHandler = commands[command];
  if (!commandHandler) {
    return `Command not found: ${command}. Type 'help' to see available commands.`;
  }

  try {
    return await commandHandler(args);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return `Error executing command: ${errorMessage}`;
  }
} 
