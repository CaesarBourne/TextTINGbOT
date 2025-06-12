import { ParseTextBotCommandOutput, Group } from './interfaces';

export const parseTextBotCommand = (rawInput: string, groups: Group[]): ParseTextBotCommandOutput | null => {
  if (
    typeof rawInput !== 'string' ||
    !Array.isArray(groups) ||
    !groups.every(
      (obj) => obj && Object.keys(obj).length === 2 && typeof obj.id === 'string' && typeof obj.name === 'string',
    ) ||
    /[<>{}]/.test(rawInput)
  ) {
    return null;
  }
  if (/[<>{}]/.test(rawInput)) return null;

  const commandRegex = /^\s*txt\s+/i;
  const match = rawInput.match(commandRegex);
  if (!match) return null;

  const inputWithoutCommand = rawInput.substring(match[0].length);
  if (inputWithoutCommand.trim() === '') return null;

  const groupsWithNorm = groups.map((g) => ({
    original: g,
    normalized: g.name.replace(/\s+/g, '').toLowerCase(),
    originalLength: g.name.length,
  }));

  groupsWithNorm.sort((a, b) => b.originalLength - a.originalLength);

  for (const group of groupsWithNorm) {
    let inputIndex = 0;
    let groupIndex = 0;
    const normalizedGroup = group.normalized;

    while (inputIndex < inputWithoutCommand.length && groupIndex < normalizedGroup.length) {
      const char = inputWithoutCommand[inputIndex];
      if (/\s/.test(char)) {
        inputIndex++;
        continue;
      }
      if (char.toLowerCase() !== normalizedGroup[groupIndex]) {
        break;
      }
      groupIndex++;
      inputIndex++;
    }

    if (groupIndex !== normalizedGroup.length) {
      continue;
    }

    if (inputIndex < inputWithoutCommand.length && !/\s/.test(inputWithoutCommand[inputIndex])) {
      continue;
    }

    const messageToSend = inputWithoutCommand.substring(inputIndex).trim();
    return {
      groupId: group.original.id,
      messageToSend,
    };
  }

  return null;
};
